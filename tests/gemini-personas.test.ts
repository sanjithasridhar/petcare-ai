// Run: node --test tests/gemini-personas.test.ts   (Node >= 22.18; Gemini is mocked, no network/credits used)
import test from "node:test";
import assert from "node:assert/strict";
import { generatePersonas, validatePersonas, PersonaGenerationError, buildPrompt } from "../lib/gemini-personas.ts";

const input = { productName: "BudgetBee", productDescription: "A budgeting app for freelancers that tracks irregular income.", targetAudience: "Freelancers aged 22-45", researchObjectives: "Learn what blocks adoption of automated tracking.", personaCount: 2 };
const mk = (n: string) => ({ name: n, age: 30, occupation: "Designer", segment: "Irregular earner", context: "c", coreNeeds: "n", primaryConcern: "p", personalityTraits: ["a"], goals: ["g"], preferences: ["x"], behaviorPatterns: "b", painPoints: ["pp"], psychologicalProfile: "ps", productOpinions: "o" });
const ok = (body: unknown, status = 200) => (async () => new Response(typeof body === "string" ? body : JSON.stringify(body), { status })) as unknown as typeof fetch;
const wrap = (obj: unknown) => ({ candidates: [{ content: { parts: [{ text: JSON.stringify(obj) }] } }] });
const code = async (p: Promise<unknown>) => { try { await p; return "NO_ERROR"; } catch (e) { return (e as PersonaGenerationError).code; } };

test("prompt embeds the experiment's own inputs", () => {
  const p = buildPrompt(input);
  for (const s of ["BudgetBee", "Freelancers aged 22-45", "irregular income", "exactly 2"]) assert.ok(p.includes(s));
});
test("valid response is parsed", async () => {
  const r = await generatePersonas(input, { apiKey: "k", fetchImpl: ok(wrap({ personas: [mk("Ana"), mk("Raj")] })) });
  assert.equal(r.length, 2);
});
test("missing API key", async () => { delete process.env.GEMINI_API_KEY; assert.equal(await code(generatePersonas(input)), "NO_API_KEY"); });
test("401 -> AUTH", async () => assert.equal(await code(generatePersonas(input, { apiKey: "k", fetchImpl: ok({ error: { message: "x" } }, 401) })), "AUTH"));
test("404 -> MODEL_NOT_FOUND", async () => assert.equal(await code(generatePersonas(input, { apiKey: "k", fetchImpl: ok({ error: { message: "x" } }, 404) })), "MODEL_NOT_FOUND"));
test("429 -> QUOTA", async () => assert.equal(await code(generatePersonas(input, { apiKey: "k", fetchImpl: ok({ error: {} }, 429) })), "QUOTA"));
test("503 -> UPSTREAM", async () => assert.equal(await code(generatePersonas(input, { apiKey: "k", fetchImpl: ok("oops", 503) })), "UPSTREAM"));
test("malformed JSON", async () => assert.equal(await code(generatePersonas(input, { apiKey: "k", fetchImpl: ok({ candidates: [{ content: { parts: [{ text: "{not json" }] } }] }) })), "MALFORMED_RESPONSE"));
test("empty response", async () => assert.equal(await code(generatePersonas(input, { apiKey: "k", fetchImpl: ok({ candidates: [] }) })), "EMPTY_RESPONSE"));
test("incomplete persona rejected", () => { const bad = mk("Z") as Record<string, unknown>; delete bad.productOpinions; assert.throws(() => validatePersonas({ personas: [bad, mk("Y")] }, 2), /incomplete/); });
test("too few / duplicate personas rejected", () => {
  assert.throws(() => validatePersonas({ personas: [mk("A")] }, 2), /requested/);
  assert.throws(() => validatePersonas({ personas: [mk("A"), mk("a")] }, 2), /duplicate/);
});
test("timeout -> TIMEOUT", async () => {
  const slow = ((_u: string, o: RequestInit) => new Promise((_, rej) => o.signal!.addEventListener("abort", () => rej(Object.assign(new Error("a"), { name: "AbortError" }))))) as unknown as typeof fetch;
  assert.equal(await code(generatePersonas(input, { apiKey: "k", timeoutMs: 20, fetchImpl: slow })), "TIMEOUT");
});
