import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const startMarker = "const QUESTIONS = ";
const start = source.indexOf(startMarker) + startMarker.length;
const end = source.indexOf("// ============ FIGURES", start);

assert.ok(start >= startMarker.length && end > start, "Question data block was not found");

const questions = Function(`return ${source.slice(start, end).trim()}`)();
assert.equal(questions.length, 31, "The paper must contain 31 questions");
assert.deepEqual(
  Object.fromEntries(["A", "B", "C"].map((section) => [section, questions.filter((q) => q.sec === section).length])),
  { A: 15, B: 10, C: 6 },
  "Section question counts changed",
);

const recalculated = [
  6483,
  Array.from({ length: 49 }, (_, i) => i + 41).filter((n) => n % 9 === 0).length,
  40 / 5,
  7245 - 300,
  600,
  18 * 60 + 35 - 47,
  48 / 8,
  4 * 20 + 6 * 2 + 7 * 0.5,
  4 * 60 + 18,
  4 * 3 * 2 * 1,
  1,
  2 * (1 + (52 - 7) / 5),
  Math.sqrt(64) * Math.sqrt(100),
  (3 * 250) / 6,
  11 * 15,
  4863,
  Math.ceil((428 + 317) / 8),
  16 * 60 + 20 - (3 * 60 + 45 + 50),
  (30 / 5) * 7.5 + (30 / 6) * 8.4,
  24 * (2 * 38) + 2 * 38 * 38,
  (9000 - 6576) / 6,
  52 - 15 + 7 + 11,
  321 / 3 + 185 + 321 / 3 + 321,
  (177 - 4 * 11) / 7 + 11,
  Math.floor(400 / (45 / 5)) + 1,
  Math.floor(47 / 5) * 7 + (47 % 5) * 2,
  (3 - 1) * 2400,
  Math.floor(62 / 4) * 23 + 2 + 7,
  (1098 - 7 * 42) / 6,
  (180 / 10) * 4,
  2 * ((220 + 6 * 140) / (6 - 1)),
];

const stored = questions.map((q, i) => {
  if (i === 0) return Number(q.answer.replaceAll(" ", ""));
  if (i === 4) return Number(q.answer.match(/\d+/)[0]);
  if (i === 5) {
    const [hours, minutes] = q.answer.split(" ").map(Number);
    return hours * 60 + minutes;
  }
  if (i === 7) return Number(q.answer.replace("$", ""));
  if (i === 10) return q.answer === "4/10 and 6/15" ? 1 : 0;
  if ([11, 12, 13, 14].includes(i)) return Number(q.answer.match(/\d+/)[0]);
  if (i === 17) return Math.floor(q.answer / 100) * 60 + (q.answer % 100);
  return Number(q.answer);
});

questions.forEach((question, index) => {
  assert.ok(Array.isArray(question.steps) && question.steps.length >= 3, `Q${index + 1} needs complete working`);
  assert.ok(question.check, `Q${index + 1} needs an independent check`);
  if (question.options) assert.ok(question.options.includes(question.answer), `Q${index + 1} answer is missing from its options`);
  assert.equal(stored[index], recalculated[index], `Q${index + 1} failed independent recalculation`);
});

const missed = new Set([10, 12, 18, 19, 24, 25, 26, 27, 29, 30, 31]);
const points = { A: 2, B: 4, C: 5 };
const importedScore = questions.reduce((score, q, index) => score + (missed.has(index + 1) ? 0 : points[q.sec]), 0);
assert.equal(importedScore, 55, "Allison's imported score no longer reconciles");

console.log("Verified 31 questions, section totals, answer options, workings, checks, and Allison's 55-point import.");
