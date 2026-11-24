// Doorbellr — The Worst App Idea Ever Pitched.
//
// A smart doorbell that, for a small monthly fee, instantly calls your phone
// to tell you someone just rang your doorbell — which you already heard,
// because you were standing right next to it.
//
// The program writes the pitch as one text to the output dir and reads it
// back to verify it byte for byte.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ENTRY =
  "Doorbellr is a smart doorbell that, for a small monthly fee, instantly calls your phone to tell you someone just rang your doorbell, which you already heard because you were standing right next to it.";

// Gate self-check: one sentence, 1–240 chars, non-blank.
const sentenceCount = ENTRY.trim().split(/[.!?]+/).filter(Boolean).length;
if (sentenceCount !== 1) {
  throw new Error(`entry must be exactly one sentence, got ${sentenceCount}`);
}
if (ENTRY.length === 0 || ENTRY.length > 240 || ENTRY.trim().length === 0) {
  throw new Error(`entry must be 1-240 chars, got ${ENTRY.length}`);
}

// Output dir: /output when the grading sandbox provides it, else ./output.
const here = dirname(fileURLToPath(import.meta.url));
const outDir =
  process.env.OUTPUT_DIR ?? (existsSync("/output") ? "/output" : join(here, "output"));
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Read it back and verify it byte for byte, then report its sha256.
const back = readFileSync(outPath);
if (!back.equals(Buffer.from(ENTRY, "utf8"))) {
  throw new Error("read-back mismatch: entry.txt does not match the entry");
}
const sha256 = createHash("sha256").update(back).digest("hex");

console.log(back.toString("utf8"));
console.log(`chars: ${ENTRY.length}`);
console.log(`sha256: ${sha256}`);
