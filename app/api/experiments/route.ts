import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { generatePersonas, PersonaGenerationError } from "@/lib/gemini-personas";

export const maxDuration = 120;

const bodySchema = z.object({
  clientRequestId: z.string().trim().min(8).max(100),
  name: z.string().trim().max(120).default(""),
  category: z.string().trim().max(120).default(""),
  productName: z.string().trim().min(2, "Product name is required.").max(120),
  productDescription: z.string().trim().min(20, "Describe the product in at least 20 characters.").max(3000),
  targetAudience: z.string().trim().min(5, "Describe the target audience.").max(1500),
  researchObjectives: z.string().trim().min(10, "Describe the research objectives.").max(2000),
  personaCount: z.number().int().min(1).max(10).default(3),
});

const include = { personas: { orderBy: { createdAt: "asc" as const } } };

export async function GET(request: Request) {
  const experiments = await prisma.experiment.findMany({
    where: { status: "completed" },
    orderBy: { createdAt: "desc" },
    include,
  });
  return NextResponse.json({ experiments });
}

export async function POST(request: Request) {
  const user = await currentUser(request);

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }
  const input = parsed.data;

  try {
    // Idempotent per clientRequestId: a retry reuses the same experiment instead of duplicating it.
    let experiment = await prisma.experiment.findUnique({ where: { clientRequestId: input.clientRequestId }, include });
    if (experiment && experiment.userId !== user.id && user.id !== "guest-user") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    if (experiment?.status === "completed") {
      return NextResponse.json({ experiment });
    }
    if (!experiment) {
      experiment = await prisma.experiment.create({
        data: {
          clientRequestId: input.clientRequestId,
          userId: user.id,
          name: input.name || input.productName,
          category: input.category,
          productName: input.productName,
          productDescription: input.productDescription,
          targetAudience: input.targetAudience,
          researchObjectives: input.researchObjectives,
          personaCount: input.personaCount,
        },
        include,
      });
    }

    let personas;
    try {
      personas = await generatePersonas(input);
    } catch (e) {
      const err = e instanceof PersonaGenerationError ? e : null;
      await prisma.experiment.update({
        where: { id: experiment.id },
        data: { status: "failed", errorMessage: (err?.message ?? "Unexpected error").slice(0, 500) },
      }).catch(() => {});
      if (!err) throw e;
      return NextResponse.json({ error: err.message, code: err.code, retryable: err.retryable }, { status: err.status });
    }

    // Personas are only written after the AI response is fully validated; all-or-nothing.
    const saved = await prisma.$transaction(async (tx) => {
      await tx.persona.deleteMany({ where: { experimentId: experiment.id } });
      await tx.persona.createMany({ data: personas.map((p) => ({ ...p, experimentId: experiment.id })) });
      return tx.experiment.update({
        where: { id: experiment.id },
        data: { status: "completed", errorMessage: null },
        include,
      });
    });
    return NextResponse.json({ experiment: saved });
  } catch (error) {
    console.error("[experiments] generation failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Could not save the generated personas to the database. Please retry." }, { status: 500 });
  }
}
