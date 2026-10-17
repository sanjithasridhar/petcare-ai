import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser, unauthorized, ownedExperiment, aiErrorResponse } from "@/lib/api-auth";
import { geminiJson } from "@/lib/gemini-personas";
import { buildInsightData, buildInsightPrompt, INSIGHT_SCHEMA, type PersonaProfile } from "@/lib/research-ai";
import { loadEvidence } from "@/lib/insight-data";

export const maxDuration = 180;
export async function GET(request: Request) {
  const user = await currentUser(request);
  if (!user) return unauthorized();
  const experimentId = new URL(request.url).searchParams.get("experimentId") ?? "";
  const exp = await ownedExperiment(experimentId, user.id);
  if (!exp) return Response.json({ error: "Experiment not found." }, { status: 404 });
  const [report, { counts }] = await Promise.all([
    prisma.insightReport.findFirst({ where: { experimentId: exp.id }, orderBy: { createdAt: "desc" } }),
    loadEvidence(exp.id),
  ]);
  return Response.json({ report, available: counts });
}

const schema = z.object({ experimentId: z.string().min(1) });
export async function POST(request: Request) {
  const user = await currentUser(request);
  if (!user) return unauthorized();
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Select an experiment." }, { status: 400 });
  const exp = await ownedExperiment(parsed.data.experimentId, user.id);
  if (!exp) return Response.json({ error: "Experiment not found." }, { status: 404 });
  try {
    const { evidence, counts } = await loadEvidence(exp.id);
    if (evidence.length === 0) {
      return Response.json({ error: "No survey answers or interview replies exist for this experiment yet. Run a survey or interview a persona first; nothing was analysed." }, { status: 400 });
    }
    const personas = exp.personas as unknown as PersonaProfile[];
    const raw = await geminiJson(buildInsightPrompt(exp, personas, evidence), INSIGHT_SCHEMA, { temperature: 0.4, timeoutMs: 150_000 });
    const data = buildInsightData(raw, personas, evidence);
    const { surveyCount, responseCount, interviewCount } = counts;
    const report = await prisma.insightReport.create({
      data: { experimentId: exp.id, userId: user.id, data: data as object, surveyCount, responseCount, interviewCount },
    });
    return Response.json({ report, available: counts });
  } catch (e) {
    return aiErrorResponse(e);
  }
}
