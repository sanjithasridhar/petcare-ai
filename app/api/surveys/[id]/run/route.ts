import { prisma } from "@/lib/prisma";
import { currentUser, unauthorized, aiErrorResponse } from "@/lib/api-auth";
import { geminiJson, PersonaGenerationError } from "@/lib/gemini-personas";
import { buildSurveyPrompt, parseSurveyAnswers, SURVEY_SCHEMA, type PersonaProfile } from "@/lib/research-ai";

export const maxDuration = 300;
const running = new Set<string>(); // per-instance guard against concurrent duplicate runs

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser(request);
  if (!user) return unauthorized();
  const { id } = await params;
  const survey = await prisma.survey.findFirst({
    where: { id },
    include: { questions: { orderBy: { position: "asc" } }, responses: { select: { personaId: true } }, experiment: true },
  });
  if (!survey) return Response.json({ error: "Survey not found." }, { status: 404 });
  if (running.has(id)) return Response.json({ error: "This survey is already running." }, { status: 409 });

  const personas = await prisma.persona.findMany({ where: { id: { in: survey.personaIds }, experimentId: survey.experimentId } });
  const answered = new Set(survey.responses.map((r) => r.personaId));
  const todo = personas.filter((p) => !answered.has(p.id)); // retries only fill what is missing
  if (todo.length === 0) return Response.json({ status: survey.status === "draft" ? "completed" : survey.status, failures: [] });

  running.add(id);
  try {
    await prisma.survey.update({ where: { id }, data: { status: "running" } });
    const ctx = survey.experiment;
    const questions = survey.questions.map((q) => q.text);
    const failures: { persona: string; error: string }[] = [];
    let firstError: unknown = null;

    const runOne = async (p: (typeof personas)[number]) => {
      try {
        const raw = await geminiJson(buildSurveyPrompt(p as PersonaProfile, ctx, questions), SURVEY_SCHEMA);
        const answers = parseSurveyAnswers(raw, questions.length);
        await prisma.surveyResponse.createMany({
          data: survey.questions.map((q, i) => ({ surveyId: id, questionId: q.id, personaId: p.id, text: answers[i] })),
          skipDuplicates: true,
        });
      } catch (e) {
        firstError ??= e;
        failures.push({ persona: p.name, error: e instanceof PersonaGenerationError ? e.message : "Failed to save answers." });
      }
    };
    for (let i = 0; i < todo.length; i += 4) await Promise.all(todo.slice(i, i + 4).map(runOne));

    const total = await prisma.surveyResponse.groupBy({ by: ["personaId"], where: { surveyId: id } });
    const status = total.length >= personas.length ? "completed" : total.length > 0 ? "partial" : "failed";
    await prisma.survey.update({ where: { id }, data: { status } });
    if (status === "failed" && firstError) return aiErrorResponse(firstError);
    return Response.json({ status, failures });
  } catch (e) {
    return aiErrorResponse(e);
  } finally {
    running.delete(id);
  }
}
