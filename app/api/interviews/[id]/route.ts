import { prisma } from "@/lib/prisma";
import { currentUser, unauthorized } from "@/lib/api-auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser(request);
  if (!user) return unauthorized();
  const { id } = await params;
  const interview = await prisma.interview.findFirst({
    where: { id },
    include: { persona: true, messages: { orderBy: { position: "asc" } } },
  });
  if (!interview) return Response.json({ error: "Interview not found." }, { status: 404 });
  return Response.json({ interview });
}
