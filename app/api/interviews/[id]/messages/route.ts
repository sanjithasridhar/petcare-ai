import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser, unauthorized, aiErrorResponse } from "@/lib/api-auth";
import { geminiGenerate } from "@/lib/gemini-personas";
import { buildSummaryPrompt, interviewSystem, needsSummary, toHistory, KEEP_RECENT, type PersonaProfile } from "@/lib/research-ai";

export const maxDuration = 120;
const schema = z.object({ clientId: z.string().trim().min(8).max(100), content: z.string().trim().min(1, "Type a question first.").max(2000) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser(request);
  if (!user) return unauthorized();
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Invalid message." }, { status: 400 });
  const { id } = await params;
  const interview = await prisma.interview.findFirst({ where: { id }, include: { persona: true, experiment: true } });
  if (!interview) return Response.json({ error: "Interview not found." }, { status: 404 });

  try {
    let messages = await prisma.interviewMessage.findMany({ where: { interviewId: id }, orderBy: { position: "asc" } });
    // Idempotent on clientId: a retry reuses the saved researcher message instead of duplicating it.
    let mine = messages.find((m) => m.clientId === parsed.data.clientId);
    if (!mine) {
      mine = await prisma.interviewMessage.create({
        data: { interviewId: id, position: (messages.at(-1)?.position ?? 0) + 1, role: "researcher", content: parsed.data.content, clientId: parsed.data.clientId },
      });
      messages = [...messages, mine];
    }
    const reply = messages.find((m) => m.position === mine!.position + 1 && m.role === "persona");
    if (reply) return Response.json({ messages });

    const persona = interview.persona as unknown as PersonaProfile;
    let { summary, summarizedCount } = interview;
    // Context management: fold older turns into a persistent summary; keep the most recent turns verbatim.
    if (needsSummary(messages.length, summarizedCount)) {
      const older = messages.slice(summarizedCount, messages.length - KEEP_RECENT);
      summary = (await geminiGenerate(buildSummaryPrompt(summary, older, persona.name), { temperature: 0.2 })).trim();
      summarizedCount = messages.length - KEEP_RECENT;
      await prisma.interview.update({ where: { id }, data: { summary, summarizedCount } });
    }
    const recent = messages.slice(summarizedCount, messages.indexOf(mine));
    const text = await geminiGenerate(mine.content, {
      system: interviewSystem(persona, interview.experiment, summary),
      history: toHistory(recent),
      temperature: 0.9,
    });
    const saved = await prisma.interviewMessage.create({
      data: { interviewId: id, position: mine.position + 1, role: "persona", content: text.trim() },
    });
    return Response.json({ messages: [...messages, saved] });
  } catch (e) {
    return aiErrorResponse(e); // researcher message stays saved; retry with the same clientId regenerates only the reply
  }
}
