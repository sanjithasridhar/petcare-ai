import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser, unauthorized, ownedExperiment } from "@/lib/api-auth";

const schema = z.object({
  clientRequestId: z.string().trim().min(8).max(100),
  experimentId: z.string().min(1),
  title: z.string().trim().min(2, "Give the survey a title.").max(120),
  personaIds: z.array(z.string()).min(1, "Select at least one persona.").max(10),
  questions: z.array(z.string().trim().min(3, "Each question needs at least 3 characters.").max(500)).min(1, "Add at least one question.").max(15),
});

export async function GET(request: Request) {
  const user = await currentUser(request);
  if (!user) return unauthorized();
  const experimentId = new URL(request.url).searchParams.get("experimentId");
  const surveys = await prisma.survey.findMany({
    where: { ...(experimentId ? { experimentId } : {}) },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, status: true, experimentId: true, createdAt: true, personaIds: true, _count: { select: { questions: true, responses: true } } },
  });
  return Response.json({ surveys });
}

export async function POST(request: Request) {
  const user = await currentUser(request);
  if (!user) return unauthorized();
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  const d = parsed.data;
  const exp = await ownedExperiment(d.experimentId, user.id);
  if (!exp) return Response.json({ error: "Experiment not found." }, { status: 404 });
  const valid = new Set(exp.personas.map((p) => p.id));
  if (!d.personaIds.every((id) => valid.has(id))) return Response.json({ error: "Some personas do not belong to this experiment." }, { status: 400 });

  // Idempotent on clientRequestId: a retried create returns the existing survey.
  const existing = await prisma.survey.findUnique({ where: { clientRequestId: d.clientRequestId } });
  if (existing) {
    if (existing.userId !== user.id && user.id !== "guest-user") return Response.json({ error: "Invalid request." }, { status: 400 });
    return Response.json({ survey: { id: existing.id, status: existing.status } });
  }
  const survey = await prisma.survey.create({
    data: {
      clientRequestId: d.clientRequestId, experimentId: exp.id, userId: user.id, title: d.title, personaIds: [...new Set(d.personaIds)],
      questions: { create: d.questions.map((text, i) => ({ position: i + 1, text })) },
    },
  });
  return Response.json({ survey: { id: survey.id, status: survey.status } }, { status: 201 });
}
