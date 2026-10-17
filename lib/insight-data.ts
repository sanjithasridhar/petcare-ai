import "server-only";
import { prisma } from "@/lib/prisma";
import type { EvidenceItem } from "@/lib/research-ai";

const clip = (t: string, n = 600) => (t.length > n ? `${t.slice(0, n)}...` : t);

/** Gathers only this experiment's saved survey + interview data. */
export async function loadEvidence(experimentId: string) {
  const [surveys, interviews] = await Promise.all([
    prisma.survey.findMany({ where: { experimentId }, include: { questions: true, responses: { include: { persona: { select: { name: true } } } } } }),
    prisma.interview.findMany({ where: { experimentId }, include: { persona: { select: { name: true } }, messages: { orderBy: { position: "asc" } } } }),
  ]);
  const evidence: EvidenceItem[] = [];
  let s = 0, i = 0;
  for (const sv of surveys) {
    const q = new Map(sv.questions.map((x) => [x.id, x.text]));
    for (const r of sv.responses) evidence.push({ ref: `S${++s}`, kind: "survey", persona: r.persona.name, text: `Q: ${clip(q.get(r.questionId) ?? "", 200)} A: ${clip(r.text)}` });
  }
  let interviewMessages = 0;
  for (const iv of interviews) {
    interviewMessages += iv.messages.length;
    iv.messages.forEach((m, k) => {
      if (m.role !== "persona") return;
      const prev = iv.messages[k - 1];
      evidence.push({ ref: `I${++i}`, kind: "interview", persona: iv.persona.name, text: `Researcher: ${clip(prev?.content ?? "", 200)} Persona: ${clip(m.content)}` });
    });
  }
  return { evidence: evidence.slice(0, 200), counts: { surveyCount: surveys.filter((x) => x.responses.length).length, responseCount: surveys.reduce((a, x) => a + x.responses.length, 0), interviewCount: interviews.filter((x) => x.messages.length).length, interviewMessageCount: interviewMessages } };
}

