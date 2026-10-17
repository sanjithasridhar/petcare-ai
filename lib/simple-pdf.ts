// Minimal dependency-free PDF writer (Helvetica, WinAnsi). Supports headings, wrapped paragraphs, bullets and page breaks.
export type Block = { type: "title" | "h1" | "h2" | "p" | "bullet" | "small"; text: string };

const FONT: Record<Block["type"], { size: number; bold: boolean; lead: number; before: number; indent: number }> = {
  title: { size: 22, bold: true, lead: 28, before: 0, indent: 0 },
  h1: { size: 15, bold: true, lead: 20, before: 14, indent: 0 },
  h2: { size: 11.5, bold: true, lead: 15, before: 8, indent: 0 },
  p: { size: 10, bold: false, lead: 13.5, before: 3, indent: 0 },
  bullet: { size: 10, bold: false, lead: 13.5, before: 2, indent: 14 },
  small: { size: 8.5, bold: false, lead: 11.5, before: 3, indent: 0 },
};
// Approximate Helvetica widths (average); good enough for wrapping.
const width = (t: string, size: number, bold: boolean) => t.length * size * (bold ? 0.55 : 0.5);

export function sanitize(t: string): string {
  return t
    .replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, "-").replace(/\u2026/g, "...").replace(/\u2022/g, "-")
    .replace(/[\r\t]/g, " ")
    .replace(/[^\x20-\x7E\n\xA0-\xFF]/g, "?");
}
const esc = (t: string) => t.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

function wrap(text: string, maxW: number, size: number, bold: boolean): string[] {
  const lines: string[] = [];
  for (const para of sanitize(text).split("\n")) {
    let cur = "";
    for (const word of para.split(/\s+/).filter(Boolean)) {
      let w = word;
      while (width(w, size, bold) > maxW) { // break very long tokens
        const n = Math.max(1, Math.floor(maxW / (size * 0.5)));
        if (cur) { lines.push(cur); cur = ""; }
        lines.push(w.slice(0, n)); w = w.slice(n);
      }
      const next = cur ? `${cur} ${w}` : w;
      if (width(next, size, bold) > maxW && cur) { lines.push(cur); cur = w; } else cur = next;
    }
    lines.push(cur);
  }
  return lines;
}

export function buildPdf(blocks: Block[], footer = ""): Uint8Array {
  const W = 595, H = 842, M = 54, maxW = W - 2 * M;
  const pages: string[][] = [[]];
  let y = H - M;
  const newPage = () => { pages.push([]); y = H - M; };
  for (const b of blocks) {
    const f = FONT[b.type];
    const lines = wrap((b.type === "bullet" ? "- " : "") + b.text, maxW - f.indent, f.size, f.bold);
    y -= f.before;
    if (y - f.lead < M + 20 || (b.type.startsWith("h") && y - 3 * f.lead < M + 20)) newPage();
    for (const line of lines) {
      if (y - f.lead < M + 20) newPage();
      y -= f.lead;
      pages[pages.length - 1].push(`BT /${f.bold ? "F2" : "F1"} ${f.size} Tf ${M + f.indent} ${y.toFixed(1)} Td (${esc(line)}) Tj ET`);
    }
  }
  const objs: string[] = [];
  const add = (s: string) => objs.push(s);
  add("<< /Type /Catalog /Pages 2 0 R >>");
  const kids = pages.map((_, i) => `${5 + i * 2} 0 R`).join(" ");
  add(`<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>`);
  add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  pages.forEach((ops, i) => {
    const foot = `BT /F1 8 Tf ${M} 30 Td (${esc(sanitize(footer))}  -  Page ${i + 1} of ${pages.length}) Tj ET`;
    const content = [...ops, foot].join("\n");
    add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${6 + i * 2} 0 R >>`);
    add(`<< /Length ${Buffer.byteLength(content, "latin1")} >>\nstream\n${content}\nendstream`);
  });
  let out = "%PDF-1.4\n";
  const offsets: number[] = [];
  objs.forEach((o, i) => { offsets.push(Buffer.byteLength(out, "latin1")); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xref = Buffer.byteLength(out, "latin1");
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("");
  out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Uint8Array(Buffer.from(out, "latin1"));
}
