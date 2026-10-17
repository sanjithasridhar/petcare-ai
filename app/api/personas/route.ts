import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Personas are created only by the AI generation flow (POST /api/experiments).
// The former bulk-insert endpoint (which accepted arbitrary/hardcoded personas) was removed.
export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const experimentId = new URL(request.url).searchParams.get("experimentId");
  const personas = await prisma.persona.findMany({
    where: { experiment: { userId: session.user.id, ...(experimentId ? { id: experimentId } : {}) } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ personas });
}
