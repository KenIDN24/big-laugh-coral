import { writeFileSync, mkdirSync, readFileSync } from "node:fs";

const LINE =
  'I told my dentist I floss daily. He said "great" and then found a piece of popcorn from the Obama administration between my molars.';

function main(): void {
  const text = LINE;
  if (text.length < 1 || text.length > 200) {
    throw new Error(`entry length ${text.length} outside 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  const outDir =
    process.env.OUTPUT_DIR ?? process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  // Round-trip guard: the file we write back must be byte-identical to the
  // line above, so a stray newline or encoding slip fails loudly here.
  const outPath = `${outDir}/entry.txt`;
  writeFileSync(outPath, text, "utf8");
  const back = readFileSync(outPath, "utf8");
  if (back !== text) {
    throw new Error("round-trip mismatch: written entry differs from the line");
  }
  // Judge-brief guard: the joke must keep its setup ("dentist" / "floss")
  // and land its punch on the final words ("between my molars.").
  if (!text.includes("dentist") || !text.includes("floss")) {
    throw new Error("entry lost its dentist/floss setup");
  }
  if (!text.endsWith("between my molars.")) {
    throw new Error("entry must end on its punch: between my molars.");
  }
  console.log(`entry ok: ${text.length} chars, 1 line`);
}

main();
