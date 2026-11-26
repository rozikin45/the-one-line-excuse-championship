import { writeFileSync, renameSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const LINE =
  "I deleted the file, but I kept a perfect memory of it, which is the same as having it, except it is not.";

// Competition gate: the excuse must be 1-140 characters.
const MAX_CHARS = 140;

const outputPath = "/output/entry.txt";
const outputDir = dirname(outputPath);
const tmpPath = join(outputDir, `.entry-${process.pid}.tmp`);

writeFileSync(tmpPath, LINE, "utf8");
renameSync(tmpPath, outputPath);

const written = readFileSync(outputPath, "utf8");
if (written !== LINE) {
  throw new Error("[byte-for-byte match] verification failed: written content does not match the expected line");
}
if (written.length < 1 || written.length > MAX_CHARS) {
  throw new Error(`[length 1-${MAX_CHARS}] verification failed: line is ${written.length} characters, must be 1-${MAX_CHARS}`);
}
if (written.includes("\n") || written.includes("\r")) {
  throw new Error("[single line] verification failed: line must be a single line with no newline");
}
if (written.trim().length === 0) {
  throw new Error("[non-whitespace] verification failed: line must not be whitespace-only");
}
if ([...written].some((ch) => ch < " ")) {
  throw new Error("[no control characters] verification failed: line contains a control character below U+0020");
}
