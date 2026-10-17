import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser, unauthorized, ownedExperiment } from "@/lib/api-auth";

export async function GET(request: Request) {
  const user = await currentUser(request);
  if (!user) return unauthorized();
  const experimentId = new URL(request.url).searchParams.get("experimentId");
  const interviews = await prisma.interview.findMany({
    where: { ...(experimentId ? { experimentId } : {}) },
    orderBy: { createdAt: "desc" },
    select: { id: true, experimentId: true, personaId: true, createdAt: true, persona: { select: { name: true, segment: true } }, _count: { select: { messages: true } } },
  });
  return Response.json({ interviews });
}

const schema = z.object({ experimentId: z.string().min(1), personaId: z.string().min(1) });
export async function POST(request: Request) {
  const user = await currentUser(request);
  if (!user) return unauthorized();
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Select an experiment and a persona." }, { status: 400 });
  const exp = await ownedExperiment(parsed.data.experimentId, user.id);
  const persona = exp?.personas.find((p) => p.id === parsed.data.personaId);
  if (!exp || !persona) return Response.json({ error: "Persona not found in this experiment." }, { status: 404 });
  const interview = await prisma.interview.create({ data: { experimentId: exp.id, personaId: persona.id, userId: user.id } });
  return Response.json({ interview: { id: interview.id } }, { status: 201 });
}
