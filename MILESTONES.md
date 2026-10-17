# PetCare AI - Milestones 1-4 (AI synthetic user research)

## Setup
1. Copy `.env.example` to `.env.local`; set `DATABASE_URL`/`DIRECT_URL` (Postgres), `BETTER_AUTH_SECRET` (32+ chars), `BETTER_AUTH_URL`, `GEMINI_API_KEY` (server-side only) and optionally `GEMINI_MODEL` (default `gemini-3.8-flash`).
2. `npm install`
3. `npx prisma generate --config prisma7.config.ts`
4. `npx prisma db push --config prisma7.config.ts` - adds Experiment, Survey, SurveyQuestion, SurveyResponse, Interview, InterviewMessage, InsightReport and the extended Persona columns. Back up first if your DB already has a different `Persona` table.
5. `npm run dev`, register/sign in.

## Use
- `/experiments` - enter product, audience, objectives, count (default 3, max 10) -> Gemini generates personas -> saved and shown; reload to confirm persistence.
- `/surveys` - pick experiment + personas, add questions, launch; each persona answers independently; results grouped by question side by side; "Retry missing answers" fills only gaps.
- `/interviews` - pick experiment + persona, chat; history is stored in the DB; old turns are folded into a stored summary; reopen from "Past session logs".
- `/insights` - generate insights from saved survey/interview data (refuses if none), see themes, sentiment, agreements, trends, pain points, segments, 0-100 use-likelihood per persona, recommendations; "Download PDF report".

## Tests
`npm test` - 19 unit tests; Gemini is mocked (no credits used). They cover Gemini errors, persona validation, survey/interview prompts and memory helpers, insight validation (invented evidence/personas dropped), and PDF output.

## Notes
- All AI output comes from live Gemini calls; there are no stored personas or fallback answers. Failures return honest errors.
- PDF export uses a built-in minimal writer (no new dependency): Helvetica, Latin-1 text only (other scripts print as "?"), text-only (no charts).
- Removed: the hardcoded persona injection, the fake `/api/chat` route and the static mock interview page.
- Synthetic results are directional hypotheses, not validated real-user research.
