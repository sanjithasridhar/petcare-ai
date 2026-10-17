import { buildPdf, type Block } from "./simple-pdf.ts";
import type { InsightData } from "./research-ai.ts";

export type ReportMeta = {
  experimentName: string; productName: string; productDescription: string; targetAudience: string; researchObjectives: string;
  personas: { name: string; age: number; occupation: string; segment: string }[];
  surveyCount: number; responseCount: number; interviewCount: number; interviewMessageCount: number;
};

export function reportBlocks(m: ReportMeta, d: InsightData): Block[] {
  const b: Block[] = [];
  const h = (t: string) => b.push({ type: "h1", text: t });
  const h2 = (t: string) => b.push({ type: "h2", text: t });
  const p = (t: string) => t && b.push({ type: "p", text: t });
  const li = (t: string) => t && b.push({ type: "bullet", text: t });
  const ev = (e: string[]) => (e.length ? ` [evidence: ${e.join(", ")}]` : " [no linked evidence]");

  b.push({ type: "title", text: "Synthetic User Research Report" });
  p(`Experiment: ${m.experimentName}`);
  p(`Product: ${m.productName}`);
  p(`Generated: ${d.generatedAt.slice(0, 10)}`);
  b.push({ type: "small", text: d.disclaimer });

  h("1. Experiment overview");
  p(m.productDescription); h2("Target audience"); p(m.targetAudience); h2("Research objectives"); p(m.researchObjectives);
  h("2. Personas and data analysed");
  m.personas.forEach((x) => li(`${x.name}, ${x.age} - ${x.occupation} (${x.segment})`));
  p(`Data analysed: ${m.surveyCount} survey(s) with ${m.responseCount} persona answers; ${m.interviewCount} interview(s) with ${m.interviewMessageCount} messages.`);

  h("3. Key findings");
  d.keyFindings.forEach((f) => li(`${f.finding} (source: ${f.source})${ev(f.evidence)}`));
  h("4. Recurring themes");
  d.themes.forEach((t) => li(`${t.theme} [${t.category}, ${t.source}]: ${t.description}${ev(t.evidence)}`));
  h("5. Sentiment");
  p(`Personas by sentiment - positive: ${d.sentiment.counts.positive}, mixed: ${d.sentiment.counts.mixed}, neutral: ${d.sentiment.counts.neutral}, negative: ${d.sentiment.counts.negative} (counts of personas as labelled by the AI analysis; not a numeric score).`);
  d.sentiment.perPersona.forEach((s) => li(`${s.personaName}: ${s.sentiment} - ${s.reason}`));
  d.sentiment.mainReasons.forEach((r) => li(`Reason: ${r}`));
  h("6. Agreement and disagreement");
  d.agreements.forEach((a) => li(`Agreement: ${a.point}${a.personaNames.length ? ` (${a.personaNames.join(", ")})` : ""}`));
  d.disagreements.forEach((x) => li(`Disagreement: ${x.topic} - ${x.positions.join(" | ")}`));
  h("7. Behavioral trends");
  d.behavioralTrends.forEach((t) => li(`${t.trend}${ev(t.evidence)}`));
  h("8. Pain points");
  d.painPoints.forEach((t) => li(`${t.painPoint}${ev(t.evidence)}`));
  h("9. Persona segments");
  d.segments.forEach((s) => li(`${s.name} (${s.personaNames.join(", ")})${s.averageScore === null ? "" : `, average use-likelihood ${s.averageScore}/100`}: ${s.summary}`));
  h("10. Would-you-use-this-product assessment");
  p("Scale: 0 = certainly would not use, 50 = undecided, 100 = certainly would use. Each score is an AI-generated estimate for a synthetic persona based on its profile and responses. It is not a market statistic and is not calibrated to real adoption.");
  p(`Overall average: ${d.overall.averageScore === null ? "n/a" : `${d.overall.averageScore}/100`} across ${d.overall.assessed} persona(s).`);
  d.assessments.forEach((a) => {
    h2(`${a.personaName} (${a.segment}) - ${a.score}/100`);
    a.reasons.forEach((r) => li(`Reason: ${r}`)); a.benefits.forEach((r) => li(`Benefit: ${r}`));
    a.barriers.forEach((r) => li(`Barrier: ${r}`)); a.conditions.forEach((r) => li(`Could change if: ${r}`));
  });
  h("11. Recommendations");
  d.recommendations.forEach((r) => li(`${r.recommendation} - ${r.rationale}${ev(r.evidence)}`));
  h("12. Limitations and uncertainty");
  d.limitations.forEach((l) => li(l));
  li("Participants are AI-simulated; findings are directional hypotheses that should be validated with real users.");

  const refs = new Set<string>();
  [...d.keyFindings, ...d.themes, ...d.behavioralTrends, ...d.painPoints, ...d.recommendations].forEach((x) => x.evidence.forEach((r) => refs.add(r)));
  if (refs.size) {
    h("Appendix: evidence referenced");
    [...refs].forEach((r) => { const e = d.evidenceIndex[r]; if (e) b.push({ type: "small", text: `[${r}] ${e.kind}, ${e.persona}: ${e.text.slice(0, 400)}` }); });
  }
  return b;
}
export const reportPdf = (m: ReportMeta, d: InsightData) => buildPdf(reportBlocks(m, d), `${m.experimentName} - synthetic research report`);
