import "server-only";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PersonaGenerationError } from "@/lib/gemini-personas";

const GUEST_USER = {
  id: "guest-user",
  name: "Guest Researcher",
  email: "guest@petcare.ai",
};

let guestUserEnsured = false;

async function ensureGuestUser() {
  if (guestUserEnsured) return;
  try {
    await prisma.user.upsert({
      where: { id: GUEST_USER.id },
      update: {},
      create: {
        id: GUEST_USER.id,
        name: GUEST_USER.name,
        email: GUEST_USER.email,
        emailVerified: true,
      },
    });
    guestUserEnsured = true;
  } catch (err) {
    console.error("[api-auth] upsert guest user error:", err);
  }
}

export async function currentUser(request?: Request) {
  if (request) {
    try {
      const session = await auth.api.getSession({ headers: request.headers });
      if (session?.user) return session.user;
    } catch {
      // ignore
    }
  }
  await ensureGuestUser();
  return GUEST_USER;
}
export const unauthorized = () => Response.json({ error: "Please sign in to continue." }, { status: 401 });

/** Experiment (with personas) available to anyone if completed. */
export async function ownedExperiment(id: string, _userId?: string) {
  return prisma.experiment.findFirst({
    where: { id, status: "completed" },
    include: { personas: { orderBy: { createdAt: "asc" } } },
  });
}
export function aiErrorResponse(e: unknown): Response {
  if (e instanceof PersonaGenerationError) {
    return Response.json({ error: e.message, code: e.code, retryable: e.retryable }, { status: e.status });
  }
  console.error("[api] unexpected error", e instanceof Error ? e.message : "unknown");
  return Response.json({ error: "Something went wrong on the server. Please retry." }, { status: 500 });
}
