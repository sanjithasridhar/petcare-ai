import { prisma } from "@/lib/prisma";
import { currentUser, unauthorized, ownedExperiment } from "@/lib/api-auth";
import { reportPdf } from "@/lib/report-pdf";
import { loadEvidence } from "@/lib/insight-data";
import type { InsightData } from "@/lib/research-ai";

export async function GET(request: Request) {
  const user = await currentUser(request);
  if (!user) return unauthorized();
  const experimentId = new URL(request.url).searchParams.get("experimentId") ?? "";
  const exp = await ownedExperiment(experimentId, user.id);
  if (!exp) return Response.json({ error: "Experiment not found." }, { status: 404 });
  const report = await prisma.insightReport.findFirst({ where: { experimentId: exp.id }, orderBy: { createdAt: "desc" } });
  if (!report) return Response.json({ error: "Generate insights for this experiment before exporting." }, { status: 404 });
  const { counts } = await loadEvidence(exp.id);
  const pdf = reportPdf(
    { experimentName: exp.name || exp.productName, productName: exp.productName, productDescription: exp.productDescription, targetAudience: exp.targetAudience, researchObjectives: exp.researchObjectives, personas: exp.personas, ...counts },
    report.data as unknown as InsightData,
  );
  const safe = (exp.name || exp.productName).replace(/[^a-z0-9]+/gi, "_").slice(0, 40) || "report";
  return new Response(pdf as BodyInit, { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="research_report_${safe}.pdf"`, "Cache-Control": "no-store" } });
}
