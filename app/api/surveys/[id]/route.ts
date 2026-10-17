import { prisma } from "@/lib/prisma";
import { currentUser, unauthorized } from "@/lib/api-auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser(request);
  if (!user) return unauthorized();
  const { id } = await params;
  const survey = await prisma.survey.findFirst({
    where: { id },
    include: { questions: { orderBy: { position: "asc" } }, responses: true },
  });
  if (!survey) return Response.json({ error: "Survey not found." }, { status: 404 });
  const personas = await prisma.persona.findMany({
    where: { id: { in: survey.personaIds }, experimentId: survey.experimentId },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, age: true, occupation: true, segment: true },
  });
  return Response.json({ survey, personas });
}
