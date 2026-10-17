// Run: node --test tests/   (all AI output is mocked; no network or credits used)
import test from "node:test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildSurveyPrompt, parseSurveyAnswers, interviewSystem, toHistory, needsSummary, buildInsightData, buildInsightPrompt, type PersonaProfile, type EvidenceItem } from "../lib/research-ai.ts";
import { reportPdf } from "../lib/report-pdf.ts";
import { buildPdf, sanitize } from "../lib/simple-pdf.ts";

const P = (id: string, name: string, segment: string): PersonaProfile => ({ id, name, age: 31, occupation: "Nurse", segment, context: "ctx", coreNeeds: "n", primaryConcern: "cost", personalityTraits: ["careful"], goals: ["g"], preferences: ["p"], behaviorPatterns: "b", painPoints: ["pp"], psychologicalProfile: "ps", productOpinions: "o" });
const personas = [P("1", "Ana", "Budget-conscious"), P("2", "Raj", "Tech-savvy")];
const ctx = { productName: "PawPal", productDescription: "Pet care app", targetAudience: "Pet owners", researchObjectives: "Learn barriers" };

test("survey prompt contains persona profile, product and every question", () => {
  const t = buildSurveyPrompt(personas[0], ctx, ["Would you pay?", "What worries you?"]);
  for (const s of ["Ana", "PawPal", "1. Would you pay?", "2. What worries you?", "Budget-conscious"]) assert.ok(t.includes(s));
});
test("survey answers parsed in order; incomplete rejected", () => {
  assert.deepEqual(parseSurveyAnswers({ answers: [{ questionNumber: 2, answer: " b " }, { questionNumber: 1, answer: "a" }] }, 2), ["a", "b"]);
  assert.throws(() => parseSurveyAnswers({ answers: [{ questionNumber: 1, answer: "a" }] }, 2), /did not answer/);
  assert.throws(() => parseSurveyAnswers({}, 1), /malformed/);
});
test("interview system prompt keeps persona + summary; history starts with a researcher turn", () => {
  const sys = interviewSystem(personas[1], ctx, "Said he pays $20/month.");
  assert.ok(sys.includes("Raj") && sys.includes("Said he pays $20/month."));
  const h = toHistory([{ role: "persona", content: "x" }, { role: "researcher", content: "q" }, { role: "persona", content: "a" }]);
  assert.deepEqual(h.map((m) => m.role), ["user", "model"]);
  assert.equal(needsSummary(17, 0), true); assert.equal(needsSummary(16, 0), false);
});

const evidence: EvidenceItem[] = [
  { ref: "S1", kind: "survey", persona: "Ana", text: "Q: pay? A: only if cheap" },
  { ref: "I1", kind: "interview", persona: "Ana", text: "Researcher: why? Persona: costs worry me" },
  { ref: "S2", kind: "survey", persona: "Raj", text: "Q: pay? A: yes for sync" },
];
const raw = {
  keyFindings: [{ finding: "Cost is a barrier", source: "wrong", evidence: ["S1", "I1", "NOPE"] }],
  themes: [{ theme: "Price", category: "concern", description: "d", source: "survey", evidence: ["S1", "S2"] }],
  sentiment: { perPersona: [{ personaName: "ana", sentiment: "Mixed", reason: "r" }, { personaName: "Ghost", sentiment: "positive", reason: "x" }], mainReasons: ["price"] },
  agreements: [{ point: "Wants reminders", personaNames: ["Ana", "Ghost"] }], disagreements: [{ topic: "Premium", positions: ["Ana no", "Raj yes"] }],
  behavioralTrends: [{ trend: "t", evidence: ["S2"] }], painPoints: [{ painPoint: "cost", evidence: ["I1"] }],
  segments: [{ name: "Cost-sensitive", personaNames: ["Ana"], summary: "s" }, { name: "Invented", personaNames: ["Nobody"], summary: "x" }],
  recommendations: [{ recommendation: "Free tier", rationale: "cost", evidence: ["S1"] }],
  assessments: [{ personaName: "Ana", score: 140, reasons: ["r"], benefits: ["b"], barriers: ["c"], conditions: ["free"] }, { personaName: "Raj", score: 72, reasons: ["r"], benefits: [], barriers: [], conditions: [] }, { personaName: "Ghost", score: 5, reasons: [], benefits: [], barriers: [], conditions: [] }],
  limitations: ["Small sample"],
};
test("insight data: drops invented evidence/personas/segments, clamps scores, computes aggregates and source", () => {
  const d = buildInsightData(raw, personas, evidence);
  assert.deepEqual(d.keyFindings[0].evidence, ["S1", "I1"]); assert.equal(d.keyFindings[0].source, "both");
  assert.equal(d.assessments.length, 2); assert.equal(d.assessments[0].score, 100);
  assert.equal(d.overall.averageScore, 86); assert.equal(d.segments.length, 1); assert.equal(d.segments[0].averageScore, 100);
  assert.equal(d.sentiment.counts.mixed, 1); assert.equal(d.sentiment.perPersona.length, 1); assert.deepEqual(d.agreements[0].personaNames, ["Ana"]);
  assert.throws(() => buildInsightData({}, personas, evidence), /malformed/);
});
test("insight prompt only contains supplied evidence ids and persona names", () => {
  const t = buildInsightPrompt(ctx, personas, evidence);
  assert.ok(t.includes("[S1]") && t.includes("[I1]") && t.includes("Raj") && t.includes("SYNTHETIC"));
});
test("PDF export contains the real report text and is a valid multi-section PDF", () => {
  const d = buildInsightData(raw, personas, evidence);
  const pdf = reportPdf({ experimentName: "Exp A", productName: "PawPal", productDescription: "Pet care app", targetAudience: "Pet owners", researchObjectives: "Learn barriers", personas, surveyCount: 1, responseCount: 2, interviewCount: 1, interviewMessageCount: 2 }, d);
  writeFileSync(join(tmpdir(), "test_report.pdf"), pdf);
  const s = Buffer.from(pdf).toString("latin1");
  assert.ok(s.startsWith("%PDF-1.4") && s.trimEnd().endsWith("%%EOF"));
  for (const t of ["Cost is a barrier", "Free tier", "Would-you-use-this-product", "Limitations", "Small sample", "synthetic"]) assert.ok(s.includes(t), t);
});
test("long text wraps onto several pages and non-latin characters are sanitized", () => {
  const pdf = buildPdf(Array.from({ length: 120 }, (_, i) => ({ type: "p" as const, text: `Paragraph ${i} ${"word ".repeat(60)}` })));
  assert.ok((Buffer.from(pdf).toString("latin1").match(/\/Type \/Page /g) ?? []).length >= 3);
  assert.equal(sanitize("a\u201Cb\u201D \u4E2D"), 'a"b" ?');
});
