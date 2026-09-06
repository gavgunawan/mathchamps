import React, { useState, useRef, useEffect } from "react";

// ============ SMC GRADE 3 PRACTICE TEST ============
// Question formats adapted from the official SMC Primary 3 papers (2024 +
// 2023), with refreshed values and independently checked answers.
// Real duration: 1 h 30 min. Timing split by
// difficulty: Section A 2 min/q, B 3 min/q, C 5 min/q
// (15×2 + 10×3 + 6×5 = 90 min exactly).
// No points deducted for wrong answers (SMC rule).
// ===================================================

// Section A: MCQ / short, 2 pts, 120 s each
// Section B: open-ended, 4 pts, 180 s each
// Section C: open-ended, 5 pts, 300 s each
// Total: 15×2 + 10×4 + 6×5 = 100 points

// q: { sec:'A'|'B'|'C', text, options? (mcq), numeric?, answer, answerLabel?, steps[], check }

const QUESTIONS = [
  // ---------------- SECTION A ----------------
  {
    sec: "A", src: "SMC 2024 Q1",
    text: "The missing number in the box is GREATER than 6 438. Which of the following can it be?  ▢ > 6 438",
    options: ["6 348", "6 384", "6 418", "6 483"], answer: "6 483",
    steps: [
      "Compare each option with 6 438 place by place, starting from the thousands digit.",
      "All four numbers have 6 thousands, so compare the hundreds digit next.",
      "6 348 and 6 384 have only 3 hundreds, so both are smaller. 6 418 has 4 hundreds but only 1 ten, so it is also smaller.",
      "6 483 has the same thousands and hundreds, but 8 tens > 3 tens. Therefore 6 483 > 6 438.",
    ],
    check: "Reverse check: 6 483 − 6 438 = 45, which is positive. Each other option is below 6 438.",
  },
  {
    sec: "A", src: "SMC 2024 Q2",
    text: "How many numbers between 40 and 90 can be divided exactly by 9?",
    options: ["4", "6", "5", "7"], answer: "5",
    steps: [
      "List the multiples of 9 near the interval: 36, 45, 54, 63, 72, 81, 90.",
      "Keep only those strictly between 40 and 90: 45, 54, 63, 72, 81.",
      "Count them: 5 numbers.",
    ],
    check: "Boundary check: 4 × 9 = 36 is too small and 10 × 9 = 90 is not between 40 and 90, so exactly 5 multiples fit.",
  },
  {
    sec: "A", src: "SMC 2024 Q3",
    text: "8 + 8 + 8 + 8 + 8 = 5 × ▢. What is the missing number in the box?",
    options: ["40", "13", "8", "5"], answer: "8",
    steps: [
      "Work out the repeated addition: 8 + 8 + 8 + 8 + 8 = 40.",
      "So 5 × ▢ = 40.",
      "▢ = 40 ÷ 5 = 8.",
    ],
    check: "Substitute the answer: 5 × 8 = 40, the same as five groups of 8.",
  },
  {
    sec: "A", src: "SMC 2023 Q1", numeric: true,
    text: "3 hundreds more than ▢ is 7 245. What is the missing number in the box?",
    answer: 6945,
    steps: [
      "'3 hundreds more' means + 300.",
      "▢ + 300 = 7 245.",
      "▢ = 7 245 − 300 = 6 945.",
    ],
    check: "Add back the 3 hundreds: 6 945 + 300 = 7 245.",
  },
  {
    sec: "A", src: "SMC 2024 Q5",
    text: "Mr Loh bought a standard sliced loaf of white bread (16 slices). Which of the following could be the mass of the loaf of bread?",
    options: ["2 kg", "6 g", "60 g", "600 g"], answer: "600 g",
    steps: [
      "6 g is lighter than a normal slice of bread, and 60 g is only about one or two slices.",
      "2 kg would be unusually heavy for one standard loaf.",
      "600 g is a sensible estimate for a loaf containing 16 slices.",
    ],
    check: "Reasonableness check: 600 g ÷ 16 ≈ 37.5 g per slice, which is a plausible slice mass.",
  },
  {
    sec: "A", src: "SMC 2024 Q6 (clock described)",
    text: "A clock shows 18 35. What was the time 47 minutes earlier?",
    options: ["17 48", "18 08", "17 58", "18 22"], answer: "17 48",
    steps: [
      "Start from 18 35 and go back 35 minutes to reach 18 00.",
      "There are 12 minutes still to subtract because 47 − 35 = 12.",
      "18 00 − 12 min = 17 48.",
    ],
    check: "Forward check: 17 48 + 12 min = 18 00, then +35 min = 18 35; altogether 47 minutes.",
  },
  {
    sec: "A", src: "SMC 2023 Q2", numeric: true,
    text: "32 + 8 + 8 = ▢ × 8. What is the missing number in the box?",
    answer: 6,
    steps: [
      "Left side: 32 + 8 + 8 = 48.",
      "▢ × 8 = 48.",
      "▢ = 48 ÷ 8 = 6.",
    ],
    check: "Substitute 6: 6 × 8 = 48, and 32 + 8 + 8 = 48.",
  },
  {
    sec: "A", src: "SMC 2024 Q8",
    text: "Andy has 4 twenty-dollar notes, 6 two-dollar notes and 7 fifty-cent coins. How much money does Andy have?",
    options: ["$92.50", "$93.50", "$95.50", "$97.00"], answer: "$95.50",
    steps: [
      "4 twenty-dollar notes = 4 × $20 = $80.",
      "6 two-dollar notes = 6 × $2 = $12.",
      "7 fifty-cent coins = 7 × $0.50 = $3.50.",
      "$80 + $12 + $3.50 = $95.50.",
    ],
    check: "Cent check: 8 000¢ + 1 200¢ + 350¢ = 9 550¢ = $95.50.",
  },
  {
    sec: "A", src: "SMC 2023 Q4", numeric: true,
    text: "Express 4 h 18 min in minutes.",
    answer: 258,
    steps: [
      "1 hour = 60 minutes.",
      "4 h = 4 × 60 = 240 min.",
      "240 + 18 = 258 minutes.",
    ],
    check: "Reverse check: 258 − 18 = 240, and 240 ÷ 60 = 4 hours.",
  },
  {
    sec: "A", src: "SMC 2023 Q22", numeric: true,
    text: "Amy, Ben, Chen and Devi are standing in a row to take a photograph. They switch positions after each shot. How many different ways can they stand in a row?",
    answer: 24,
    steps: [
      "First position: 4 choices of person.",
      "After that choice, the second position has 3 choices, then 2 choices, then 1.",
      "4 × 3 × 2 × 1 = 24 different ways.",
    ],
    check: "Grouping check: for each of the 4 possible first people, the remaining 3 people have 3 × 2 × 1 = 6 orders; 4 × 6 = 24.",
  },
  {
    sec: "A", src: "SMC 2024 Q11",
    text: "Which pair of fractions are equivalent fractions?",
    options: ["3/8 and 6/12", "4/10 and 6/15", "5/10 and 6/10", "2/7 and 4/21"], answer: "4/10 and 6/15",
    steps: [
      "Simplify each fraction to lowest terms.",
      "4/10 = 2/5 (divide top and bottom by 2).",
      "6/15 = 2/5 (divide top and bottom by 3).",
      "Both equal 2/5, so they are equivalent.",
    ],
    check: "Cross-multiply: 4 × 15 = 60 and 10 × 6 = 60. Equal cross-products confirm the fractions are equivalent.",
  },
  {
    sec: "A", src: "SMC 2024 Q12",
    text: "James forms figures with triangles and lines in a pattern. Figure 1: 2 triangles, 7 lines. Figure 2: 4 triangles, 12 lines. Figure 3: 6 triangles, 17 lines. How many triangles are in the figure that has 52 lines?",
    options: ["16", "18", "20", "22"], answer: "20",
    steps: [
      "Lines go 7, 12, 17, … adding 5 each time.",
      "Lines in Figure n = 7 + 5 × (n − 1).",
      "52 = 7 + 5 × (n − 1) → 45 = 5 × (n − 1) → n = 10.",
      "Triangles = 2 per figure number: 2 × 10 = 20.",
    ],
    check: "Substitute n = 10: lines = 7 + 5 × 9 = 52 and triangles = 2 × 10 = 20.",
  },
  {
    sec: "A", src: "SMC 2024 Q13",
    text: "▢ × ▢ = 64 and ▲ × ▲ = 100. What is the product of ▢ and ▲?",
    options: ["18", "64", "80", "100"], answer: "80",
    steps: [
      "▢ × ▢ = 64, so ▢ = 8 because 8 × 8 = 64.",
      "▲ × ▲ = 100, so ▲ = 10 because 10 × 10 = 100.",
      "Product: 8 × 10 = 80.",
    ],
    check: "Substitution check: 8² = 64, 10² = 100, and 8 × 10 = 80.",
  },
  {
    sec: "A", src: "SMC 2024 Q14",
    text: "Daniel fills a pail completely. 3 identical bottles (250 ml each) fill half the pail. 6 identical cups fill the other half. What is the capacity of one cup?",
    options: ["100 ml", "125 ml", "250 ml", "1500 ml"], answer: "125 ml",
    steps: [
      "Half the pail = 3 bottles = 3 × 250 = 750 ml.",
      "The other half is also 750 ml, filled by 6 cups.",
      "1 cup = 750 ÷ 6 = 125 ml.",
    ],
    check: "Capacity check: 6 × 125 = 750 ml, equal to 3 × 250 = 750 ml.",
  },
  {
    sec: "A", src: "SMC 2024 Q15",
    text: "Cookies cost $15 per packet, with a promotion: buy 3 packets, get 1 packet free. Mrs Mandy left with 14 packets. What is the least amount she paid?",
    options: ["$135", "$150", "$165", "$210"], answer: "$165",
    steps: [
      "The deal gives 4 packets while charging for 3: 4 packets cost 3 × $15 = $45.",
      "12 packets = 3 deals, so they cost 3 × $45 = $135.",
      "Buy the remaining 2 packets normally: 2 × $15 = $30.",
      "Least total = $135 + $30 = $165.",
    ],
    check: "Minimum check: paying for 10 packets gives only 10 + 3 free = 13. Paying for 11 gives 11 + 3 free = 14, costing 11 × $15 = $165.",
  },

  // ---------------- SECTION B ----------------
  {
    sec: "B", src: "SMC 2024 Q16", numeric: true,
    text: "Andy is thinking of a 4-digit number between 4000 and 6000. The digit in the hundreds place is twice the digit in the thousands place. The digit in the ones place is 3 less than the digit in the tens place. All the digits add up to 21. What is the number?",
    answer: 4863,
    steps: [
      "The thousands digit is 4 or 5. Twice 5 is 10, not a single digit, so it must be 4.",
      "The hundreds digit is twice 4, so it is 8.",
      "The last two digits must sum to 21 − 4 − 8 = 9.",
      "If tens = t, ones = t − 3. Then t + (t − 3) = 9, so 2t = 12 and t = 6; ones = 3.",
      "The number is 4 863.",
    ],
    check: "Condition check: 4 863 is between 4 000 and 6 000; 8 = 2 × 4; 3 = 6 − 3; and 4 + 8 + 6 + 3 = 21.",
  },
  {
    sec: "B", src: "SMC 2024 Q17", numeric: true,
    text: "Mrs Tan baked 428 cookies. Mrs Lee baked 317 cookies. They packed all the cookies into packets of 8. What is the least number of packets needed to contain ALL the cookies?",
    answer: 94,
    steps: [
      "Total cookies = 428 + 317 = 745.",
      "745 ÷ 8 = 93 remainder 1.",
      "The 1 leftover cookie still needs one more packet.",
      "Least packets = 93 + 1 = 94.",
    ],
    check: "Capacity check: 93 packets hold only 744 cookies, but 94 hold 752, so 94 is the least that can hold 745.",
  },
  {
    sec: "B", src: "SMC 2024 Q18", numeric: true,
    text: "Benjamin's flight from Singapore to Taipei took 3 h 45 min, then 50 min more from the airport to his hotel. He reached the hotel at 16 20. What time did he leave Singapore? (24-hour time, e.g. answer 0915 as 915)",
    answer: 1145, answerLabel: "11 45",
    steps: [
      "Total journey = 3 h 45 min + 50 min = 4 h 35 min.",
      "Work backwards from 16 20.",
      "16 20 − 4 h = 12 20.",
      "12 20 − 35 min = 11 45. He left at 11 45.",
    ],
    check: "Forward check: 11 45 + 3 h 45 min = 15 30; +50 min = 16 20.",
  },
  {
    sec: "B", src: "SMC 2024 Q19", numeric: true,
    text: "Shop A sells 5 apples for $7.50. Shop B sells 6 apples for $8.40. Mdm Lee bought 30 apples from Shop A. Mrs Benson bought 30 apples from Shop B. How much did they pay in total (in dollars)?",
    answer: 87, answerLabel: "$87",
    steps: [
      "Shop A: 30 apples = 6 packs of 5, so the cost is 6 × $7.50 = $45.",
      "Shop B: 30 apples = 5 packs of 6, so the cost is 5 × $8.40 = $42.",
      "Total = $45 + $42 = $87.",
    ],
    check: "Pack check: 6 × 5 = 30 and 5 × 6 = 30; cost check: $45 + $42 = $87.",
  },
  {
    sec: "B", src: "SMC 2024 Q20", numeric: true,
    text: "A figure is made of one rectangle and two identical squares stacked beside it. The rectangle's breadth is 24 cm. Each square has sides of 38 cm, and the rectangle's length equals the two squares' combined height. Find the total area of the figure in cm².",
    answer: 4712, answerLabel: "4712 cm²",
    steps: [
      "Two squares stacked: height = 38 + 38 = 76 cm.",
      "Rectangle area = 24 × 76 = 1 824 cm².",
      "Two square areas = 2 × (38 × 38) = 2 × 1 444 = 2 888 cm².",
      "Total area = 1 824 + 2 888 = 4 712 cm².",
    ],
    check: "Alternative check: factor out the height 76 cm. Total width is 24 + 38 = 62 cm, so area = 76 × 62 = 4 712 cm².",
  },
  {
    sec: "B", src: "SMC 2024 Q21", numeric: true,
    text: "Mr Wong bought 9 ℓ of orange juice. His guests drank 6 576 ml of it. He poured the rest equally into 6 bottles. How much juice went into each bottle (in ml)?",
    answer: 404, answerLabel: "404 ml",
    steps: [
      "9 ℓ = 9 000 ml.",
      "Left over: 9 000 − 6 576 = 2 424 ml.",
      "Each bottle: 2 424 ÷ 6 = 404 ml.",
    ],
    check: "Reverse check: 404 × 6 = 2 424 ml, and 2 424 + 6 576 = 9 000 ml.",
  },
  {
    sec: "B", src: "SMC 2024 Q22", numeric: true,
    text: "Some passengers were on a bus when it left stop A. At stop B, 11 passengers alighted. At stop C, 15 boarded and 7 alighted, and then there were 52 passengers. How many passengers were on the bus when it left stop A?",
    answer: 55,
    steps: [
      "Work backwards from the end: 52 passengers.",
      "Undo stop C: 52 − 15 (who boarded) + 7 (who left) = 44.",
      "Undo stop B: 44 + 11 = 55.",
      "55 passengers left stop A.",
    ],
    check: "Forward check: 55 − 11 = 44; then 44 + 15 − 7 = 52.",
  },
  {
    sec: "B", src: "SMC 2024 Q23", numeric: true,
    text: "Helen has 3 bottles of buttons. Bottle A has 185 more buttons than Bottle B. Bottle C has 3 times as many as Bottle B. Bottle C has 321 buttons. How many buttons does Helen have altogether?",
    answer: 720,
    steps: [
      "Bottle C = 321 = 3 × B, so B = 321 ÷ 3 = 107.",
      "Bottle A = 107 + 185 = 292.",
      "Altogether: 292 + 107 + 321 = 720 buttons.",
    ],
    check: "Condition check: 321 = 3 × 107 and 292 − 107 = 185; total check: 292 + 107 + 321 = 720.",
  },
  {
    sec: "B", src: "SMC 2024 Q24", numeric: true,
    text: "3 umbrellas and 4 raincoats cost $177 altogether. Each raincoat costs $11 more than each umbrella. Find the cost of each raincoat (in dollars).",
    answer: 30, answerLabel: "$30",
    steps: [
      "Each raincoat = 1 umbrella + $11.",
      "So 4 raincoats = 4 umbrellas + $44.",
      "3 + 4 = 7 umbrella-units, so 7 umbrellas + $44 = $177.",
      "7 umbrellas = $133, so one umbrella = $19. One raincoat = $19 + $11 = $30.",
    ],
    check: "Substitute: 3 × $19 + 4 × $30 = $57 + $120 = $177, and $30 − $19 = $11.",
  },
  {
    sec: "B", src: "SMC 2024 Q25", numeric: true,
    text: "Ben hangs stars at equal distances on a string. The distance between the 2nd star and the 7th star is 45 cm. How many stars can Ben hang if the string is 4 m long?",
    answer: 45,
    steps: [
      "2nd to 7th star = 5 gaps, so each gap = 45 ÷ 5 = 9 cm.",
      "String = 4 m = 400 cm.",
      "400 ÷ 9 = 44 remainder 4, so only 44 full gaps fit.",
      "44 gaps hold 44 + 1 = 45 stars.",
    ],
    check: "Maximum check: 44 gaps use 44 × 9 = 396 cm and fit; 45 gaps need 405 cm and do not fit. Therefore the maximum is 45 stars.",
  },

  // ---------------- SECTION C ----------------
  {
    sec: "C", src: "SMC 2024 Q26", numeric: true,
    text: "At a fruit stall, 4 oranges cost $7 and buying 4 gives 1 more orange FREE. Single oranges cost $2 each. Miss Hong received 47 oranges and used the promotion as many times as possible. How much did she pay (in dollars)?",
    answer: 67, answerLabel: "$67",
    steps: [
      "Each promotion group gives 4 paid + 1 free = 5 oranges for $7.",
      "47 ÷ 5 = 9 full promotion groups (45 oranges) with 2 oranges left.",
      "9 promotion groups cost 9 × $7 = $63.",
      "2 single oranges cost 2 × $2 = $4.",
      "Total = $63 + $4 = $67.",
    ],
    check: "Quantity check: 9 × 5 + 2 = 47 oranges. Cost check: 9 × $7 + 2 × $2 = $67.",
  },
  {
    sec: "C", src: "SMC 2024 Q27", numeric: true,
    text: "Factory A made 1 380 chairs more than Factory B. Factory C made 3 times as many chairs as Factory B. After 3 180 chairs were sold from Factory A, there were 4 times as many chairs in Factory B as in Factory A. How many more chairs were there in Factory C than Factory B?",
    answer: 4800,
    steps: [
      "Let Factory B have x chairs. Then A = x + 1 380.",
      "After selling, A has x + 1 380 − 3 180 = x − 1 800.",
      "B is 4 times the remaining A: x = 4 × (x − 1 800) = 4x − 7 200.",
      "3x = 7 200, so x = 2 400. Thus B made 2 400 chairs.",
      "C made 3 × 2 400 = 7 200 chairs, so C − B = 7 200 − 2 400 = 4 800.",
    ],
    check: "Full check: A made 3 780; after selling 3 180 it had 600. B = 2 400 = 4 × 600, and C = 7 200 = 3 × B. Difference = 4 800.",
  },
  {
    sec: "C", src: "SMC 2024 Q28", numeric: true,
    text: "A number pattern repeats: 2, 7, 5, 9, 2, 7, 5, 9, … What is the sum of the first 62 numbers of the pattern?",
    answer: 354,
    steps: [
      "The repeating block is 2, 7, 5, 9 — four numbers.",
      "One block sums to 2 + 7 + 5 + 9 = 23.",
      "62 numbers = 15 full blocks (60 numbers) + 2 extra numbers.",
      "15 × 23 = 345. The 2 extra numbers sum to 2 + 7 = 9.",
      "Total = 345 + 9 = 354.",
    ],
    check: "Count check: 15 × 4 + 2 = 62 numbers. Sum check: 15 × 23 + 9 = 345 + 9 = 354.",
  },
  {
    sec: "C", src: "SMC 2023 Q43", numeric: true,
    text: "7 dustbins are lined up in a row with equal distances between them. Each dustbin is 42 cm long. The total distance from the start of the first dustbin to the end of the last dustbin is 1 098 cm. What is the distance between the 6th and 7th dustbins (in cm)?",
    answer: 134, answerLabel: "134 cm",
    steps: [
      "The 7 dustbins themselves take 7 × 42 = 294 cm.",
      "The gaps take 1 098 − 294 = 804 cm.",
      "There are 6 equal gaps between 7 dustbins.",
      "Each gap = 804 ÷ 6 = 134 cm.",
    ],
    check: "Rebuild the full length: 7 × 42 + 6 × 134 = 294 + 804 = 1 098 cm.",
  },
  {
    sec: "C", src: "SMC 2023 Q44", numeric: true,
    text: "Mrs Tan invited children to her party. The number of girls was 3 times the number of boys. Each girl received 2 lollipops and each boy received 4 lollipops. Mrs Tan gave out 180 lollipops in all. How many children were invited?",
    answer: 72,
    steps: [
      "Let boys = b. Then girls = 3b.",
      "Girls receive 2 each, so they use 2 × 3b = 6b lollipops. Boys use 4b.",
      "6b + 4b = 10b = 180, so b = 18.",
      "Girls = 3 × 18 = 54. Children = 18 + 54 = 72.",
    ],
    check: "Substitute: 54 girls × 2 = 108 and 18 boys × 4 = 72; 108 + 72 = 180 lollipops, and 54 = 3 × 18.",
  },
  {
    sec: "C", src: "SMC 2024 Q31", numeric: true,
    text: "A box had an equal number of red and green beans. After taking out 140 red beans and adding 220 green beans, the number of green beans became 6 times the number of red beans. How many beans were there altogether at first?",
    answer: 424,
    steps: [
      "Start: g red and g green (equal).",
      "After the change: red = g − 140 and green = g + 220.",
      "g + 220 = 6 × (g − 140) = 6g − 840.",
      "1 060 = 5g, so g = 212.",
      "Altogether at first = 212 + 212 = 424 beans.",
    ],
    check: "Substitute: red after = 212 − 140 = 72; green after = 212 + 220 = 432; and 432 = 6 × 72.",
  },
];

// ============ FIGURES ============
// Diagrams for questions whose official papers include a picture.
// Keyed by q.src so questions stay untouched.
const FIG = { ink: "#1F2D3D", blue: "#2F6FDB", red: "#D23B2E", green: "#1E8A4C", gold: "#E2A100", light: "#E8EEF4", pale: "#F6F9FC" };
const figWrap = { margin: "10px 0 12px", background: FIG.pale, border: `1.5px solid ${FIG.light}`, borderRadius: 10, padding: "8px 10px 6px" };
const figCap = { fontSize: 11, color: "#6B7B8C", marginTop: 4, textAlign: "center", fontWeight: 600 };
const Svg = ({ w, h, children, maxW = 380 }) => (
  <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ maxWidth: maxW, display: "block", margin: "0 auto", height: "auto" }} xmlns="http://www.w3.org/2000/svg">{children}</svg>
);
const T = ({ x, y, size = 11, fill = FIG.ink, w = 700, a = "middle", children }) => (
  <text x={x} y={y} fontSize={size} fill={fill} fontWeight={w} textAnchor={a} fontFamily="Verdana, sans-serif">{children}</text>
);
// bracket with label (horizontal)
const Brace = ({ x1, x2, y, label, color = FIG.blue }) => (
  <g>
    <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth="1.5" />
    <line x1={x1} y1={y - 5} x2={x1} y2={y + 5} stroke={color} strokeWidth="1.5" />
    <line x1={x2} y1={y - 5} x2={x2} y2={y + 5} stroke={color} strokeWidth="1.5" />
    <T x={(x1 + x2) / 2} y={y + 14} size={11} fill={color}>{label}</T>
  </g>
);
// bar-model row
const Bar = ({ x, y, w, h = 22, units = 1, fill = FIG.light, stroke = FIG.ink, label, labelX, extra }) => {
  const uw = w / units;
  return (
    <g>
      {Array.from({ length: units }, (_, i) => <rect key={i} x={x + i * uw} y={y} width={uw} height={h} fill={fill} stroke={stroke} strokeWidth="1.5" />)}
      {label && <T x={labelX != null ? labelX : x - 8} y={y + h / 2 + 4} a="end" size={12}>{label}</T>}
      {extra}
    </g>
  );
};

const FIGURES = {
  // Q6 — analog clock at 18 35
  "SMC 2024 Q6 (clock described)": () => {
    const cx = 90, cy = 90, r = 78;
    const hand = (deg, len, wdt, col) => { const a = (deg - 90) * Math.PI / 180; return <line x1={cx} y1={cy} x2={cx + len * Math.cos(a)} y2={cy + len * Math.sin(a)} stroke={col} strokeWidth={wdt} strokeLinecap="round" />; };
    return (
      <div style={figWrap}>
        <Svg w={180} h={180} maxW={200}>
          <circle cx={cx} cy={cy} r={r} fill="#fff" stroke={FIG.ink} strokeWidth="3" />
          {Array.from({ length: 12 }, (_, i) => { const a = (i * 30 - 90) * Math.PI / 180; return <T key={i} x={cx + 64 * Math.cos(a)} y={cy + 64 * Math.sin(a) + 5} size={13} w={800}>{i === 0 ? 12 : i}</T>; })}
          {Array.from({ length: 60 }, (_, i) => { const a = (i * 6 - 90) * Math.PI / 180; const L = i % 5 === 0 ? 8 : 4; return <line key={i} x1={cx + (r - L) * Math.cos(a)} y1={cy + (r - L) * Math.sin(a)} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke={FIG.ink} strokeWidth={i % 5 === 0 ? 2 : 1} />; })}
          {hand(6 * 30 + 35 * 0.5, 40, 5, FIG.ink)}
          {hand(35 * 6, 58, 3, FIG.blue)}
          <circle cx={cx} cy={cy} r={4} fill={FIG.ink} />
        </Svg>
        <div style={figCap}>The clock shows 18 35 (twenty-five to seven in the evening)</div>
      </div>
    );
  },

  // Q12 — pattern of triangles and lines (diamonds sharing a vertex, one stick at each end)
  "SMC 2024 Q12": () => {
    const Diamond = ({ x, y, s = 22 }) => (
      <g stroke={FIG.ink} strokeWidth="2" fill="none">
        <polygon points={`${x},${y} ${x + s},${y - s * 0.9} ${x + 2 * s},${y} ${x + s},${y + s * 0.9}`} fill="#DCE8FA" />
        <line x1={x} y1={y} x2={x + 2 * s} y2={y} />
      </g>
    );
    const Figure = ({ n, ox, label, tri, lines }) => {
      const s = 22, y = 40;
      return (
        <g>
          <line x1={ox} y1={y} x2={ox + 16} y2={y} stroke={FIG.ink} strokeWidth="2" />
          {Array.from({ length: n }, (_, i) => <Diamond key={i} x={ox + 16 + i * 2 * s} y={y} s={s} />)}
          <line x1={ox + 16 + n * 2 * s} y1={y} x2={ox + 32 + n * 2 * s} y2={y} stroke={FIG.ink} strokeWidth="2" />
          <T x={ox + 16 + n * s} y={y + 40} size={12} w={800}>{label}</T>
          <T x={ox + 16 + n * s} y={y + 54} size={11} fill="#6B7B8C" w={600}>{tri} triangles · {lines} lines</T>
        </g>
      );
    };
    return (
      <div style={figWrap}>
        <Svg w={620} h={100} maxW={620}>
          <Figure n={1} ox={50} label="Figure 1" tri={2} lines={7} />
          <Figure n={2} ox={200} label="Figure 2" tri={4} lines={12} />
          <Figure n={3} ox={400} label="Figure 3" tri={6} lines={17} />
        </Svg>
        <div style={figCap}>Each new figure adds one diamond: +2 triangles and +5 lines</div>
      </div>
    );
  },

  // Q20 — rectangle beside two stacked squares
  "SMC 2024 Q20": () => (
    <div style={figWrap}>
      <Svg w={300} h={198} maxW={300}>
        <rect x={70} y={20} width={48} height={152} fill="#FBE7C6" stroke={FIG.ink} strokeWidth="2" />
        <rect x={118} y={20} width={76} height={76} fill="#DCE8FA" stroke={FIG.ink} strokeWidth="2" />
        <rect x={118} y={96} width={76} height={76} fill="#DCE8FA" stroke={FIG.ink} strokeWidth="2" />
        <T x={94} y={188} size={11} w={800}>24 cm</T>
        <T x={156} y={62} size={11} w={800}>38 cm</T>
        <T x={156} y={138} size={11} w={800}>38 cm</T>
        <line x1={198} y1={20} x2={198} y2={96} stroke={FIG.blue} strokeWidth="1.5" /><T x={208} y={62} size={11} fill={FIG.blue} a="start">38 cm</T>
        <line x1={40} y1={20} x2={40} y2={172} stroke={FIG.red} strokeWidth="1.5" /><line x1={35} y1={20} x2={45} y2={20} stroke={FIG.red} strokeWidth="1.5" /><line x1={35} y1={172} x2={45} y2={172} stroke={FIG.red} strokeWidth="1.5" />
        <T x={30} y={100} size={11} fill={FIG.red} a="end">?</T>
      </Svg>
      <div style={figCap}>The rectangle's length (red) equals the two squares stacked (38 + 38)</div>
    </div>
  ),

  // Q23 — bar model: bottles A, B, C
  "SMC 2024 Q23": () => (
    <div style={figWrap}>
      <Svg w={380} h={126} maxW={380}>
        <Bar x={40} y={8} w={70} label="B" />
        <Bar x={40} y={40} w={70} label="A" extra={<g><rect x={110} y={40} width={140} height={22} fill="#FBE7C6" stroke={FIG.ink} strokeWidth="1.5" /><T x={180} y={55} size={11} w={800}>185 more</T></g>} />
        <Bar x={40} y={72} w={210} units={3} label="C" fill="#DCE8FA" />
        <Brace x1={40} x2={250} y={104} label="321 buttons" />
      </Svg>
      <div style={figCap}>Bar model: C is 3 units = 321, so 1 unit (Bottle B) = 107</div>
    </div>
  ),

  // Q24 — umbrellas and raincoats
  "SMC 2024 Q24": () => (
    <div style={figWrap}>
      <Svg w={380} h={100} maxW={380}>
        <Bar x={90} y={8} w={84} units={3} label="3 umbrellas" />
        <Bar x={90} y={40} w={112} units={4} label="4 raincoats" fill="#DCE8FA" extra={<g><rect x={202} y={40} width={72} height={22} fill="#FBE7C6" stroke={FIG.ink} strokeWidth="1.5" /><T x={238} y={55} size={10} w={800}>4 × $11</T></g>} />
        <Brace x1={90} x2={274} y={82} label="$177 altogether (7 units + $44)" />
      </Svg>
      <div style={figCap}>Each raincoat = 1 unit + $11, so 7 units + $44 = $177</div>
    </div>
  ),

  // Q25 — stars on a string
  "SMC 2024 Q25": () => (
    <div style={figWrap}>
      <Svg w={380} h={96} maxW={380}>
        <line x1={20} y1={40} x2={360} y2={40} stroke={FIG.ink} strokeWidth="2" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <T key={i} x={34 + i * 50} y={47} size={20} fill={FIG.gold}>★</T>)}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <T key={"n" + i} y={70} x={34 + i * 50} size={10} fill="#6B7B8C">{i + 1}{i === 0 ? "st" : i === 1 ? "nd" : i === 2 ? "rd" : "th"}</T>)}
        <Brace x1={84} x2={334} y={18} label="" />
        <T x={209} y={12} size={11} fill={FIG.blue}>45 cm = 5 gaps</T>
        <T x={340} y={86} size={10} fill="#6B7B8C" a="end">… the string is 4 m long</T>
      </Svg>
      <div style={figCap}>Count the gaps, not the stars: 2nd to 7th star is 5 equal gaps</div>
    </div>
  ),

  // Q21-2024? no. Bus stops — flow diagram
  "SMC 2024 Q22": () => (
    <div style={figWrap}>
      <Svg w={410} h={70} maxW={410}>
        {[["A", 20, "?"], ["B", 140, "−11"], ["C", 260, "+15, −7"]].map(([n, x, lab], i) => (
          <g key={n}>
            <rect x={x} y={14} width={70} height={30} rx={6} fill="#DCE8FA" stroke={FIG.ink} strokeWidth="1.5" />
            <T x={x + 35} y={34} size={12} w={800}>Stop {n}</T>
            <T x={x + 35} y={60} size={11} fill={i === 0 ? FIG.red : FIG.blue} w={800}>{lab}</T>
            {i < 2 && <line x1={x + 70} y1={29} x2={x + 118} y2={29} stroke={FIG.ink} strokeWidth="1.5" markerEnd="url(#arr)" />}
          </g>
        ))}
        <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill={FIG.ink} /></marker></defs>
        <T x={402} y={34} size={12} a="end" w={800}>= 52</T>
      </Svg>
      <div style={figCap}>Work backwards from 52: undo C, then undo B</div>
    </div>
  ),

  // Q27 (2024) — factory chairs bar model (after selling)
  "SMC 2024 Q27": () => (
    <div style={figWrap}>
      <Svg w={380} h={112} maxW={380}>
        <T x={10} y={16} size={11} a="start" fill="#6B7B8C" w={600}>After 3 180 chairs were sold from A:</T>
        <Bar x={110} y={24} w={45} label="Factory A" />
        <Bar x={110} y={56} w={180} units={4} label="Factory B" fill="#DCE8FA" />
        <Bar x={110} y={88} w={135} units={3} label="Factory C" fill="#FBE7C6" extra={<T x={255} y={103} size={10} a="start" fill="#6B7B8C">(C = 3 × B)</T>} />
      </Svg>
      <div style={figCap}>After the sale, Factory B has 4 equal units while Factory A has 1</div>
    </div>
  ),

  // Repeating pattern blocks
  "SMC 2024 Q28": () => (
    <div style={figWrap}>
      <Svg w={380} h={64} maxW={380}>
        {[0, 1, 2].map((g) => (
          <g key={g}>
            <rect x={14 + g * 118} y={10} width={108} height={34} rx={6} fill={g === 2 ? "#F6F9FC" : "#DCE8FA"} stroke={FIG.ink} strokeWidth="1.5" strokeDasharray={g === 2 ? "4 3" : "0"} />
            {["2", "7", "5", "9"].map((d, i) => <T key={i} x={36 + g * 118 + i * 22} y={33} size={15} w={800}>{d}</T>)}
            <T x={68 + g * 118} y={58} size={10} fill="#6B7B8C">group {g + 1} = 23</T>
          </g>
        ))}
        <T x={372} y={33} size={16} a="end">…</T>
      </Svg>
      <div style={figCap}>The pattern repeats every 4 numbers; 62 = 15 full groups + 2 extra</div>
    </div>
  ),

  // 2023 Q43 — dustbins in a row
  "SMC 2023 Q43": () => (
    <div style={figWrap}>
      <Svg w={380} h={84} maxW={380}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={10 + i * 52} y={18} width={24} height={30} rx={4} fill="#DCE8FA" stroke={FIG.ink} strokeWidth="1.5" />)}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <T key={"l" + i} x={22 + i * 52} y={13} size={8} fill="#6B7B8C">42 cm</T>)}
        {[0, 1, 2, 3, 4, 5].map((i) => <T key={"g" + i} x={44 + i * 52} y={38} size={10} fill={FIG.blue} w={800}>?</T>)}
        <Brace x1={10} x2={346} y={62} label="1 098 cm from start of 1st to end of 7th" />
      </Svg>
      <div style={figCap}>7 dustbins make 6 equal gaps</div>
    </div>
  ),

  // 2023 Q44 — party: girls twice boys, lollipops
  "SMC 2023 Q44": () => (
    <div style={figWrap}>
      <Svg w={380} h={96} maxW={380}>
        <Bar x={70} y={8} w={42} label="Boys" extra={<T x={91} y={23} size={10} w={800}>4 each</T>} />
        <Bar x={70} y={40} w={126} units={3} label="Girls" fill="#DCE8FA" extra={<><T x={91} y={55} size={9} w={800}>2 each</T><T x={133} y={55} size={9} w={800}>2 each</T><T x={175} y={55} size={9} w={800}>2 each</T></>} />
        <T x={210} y={31} size={11} a="start" fill={FIG.blue} w={700}>1 boy + 3 girls</T>
        <T x={210} y={47} size={11} a="start" fill={FIG.blue} w={700}>= 4 + 2 + 2 + 2 = 10</T>
        <Brace x1={70} x2={196} y={78} label="180 lollipops = 18 groups" />
      </Svg>
      <div style={figCap}>Each group of 4 children uses 10 lollipops</div>
    </div>
  ),

  // 2023 Q45 — red and green beans before/after
  "SMC 2024 Q31": () => (
    <div style={figWrap}>
      <Svg w={380} h={112} maxW={380}>
        <T x={10} y={14} size={11} a="start" fill="#6B7B8C" w={600}>After: green = 6 × red</T>
        <Bar x={80} y={22} w={36} label="Red" fill="#F9D2CE" extra={<T x={126} y={37} size={10} a="start" fill="#6B7B8C">← took out 140</T>} />
        <Bar x={80} y={54} w={216} units={6} label="Green" fill="#D9F2E1" />
        <Brace x1={80} x2={296} y={88} label="green before (= red before) + 220" color={FIG.green} />
      </Svg>
      <div style={figCap}>Both colours started equal; red lost 140 and green gained 220</div>
    </div>
  ),
};

function QuestionFigure({ src }) {
  const F = FIGURES[src];
  return F ? <F /> : null;
}


const SEC_INFO = {
  A: { pts: 2, secs: 120, label: "Section A · 2 pts · 2 min" },
  B: { pts: 4, secs: 180, label: "Section B · 4 pts · 3 min" },
  C: { pts: 5, secs: 300, label: "Section C · 5 pts · 5 min" },
};
const MAX_SCORE = QUESTIONS.reduce((s, q) => s + SEC_INFO[q.sec].pts, 0); // 100

// Question style tags (by position in QUESTIONS) — drive the analytics breakdown
const TYPES = [
  "Number sense", "Number sense", "Number sense", "Number sense", "Measurement",
  "Time", "Number sense", "Money", "Time", "Logic & counting",
  "Fractions", "Patterns", "Number sense", "Measurement", "Money",
  "Logic & counting", "Word problems", "Time", "Money", "Geometry & area",
  "Measurement", "Word problems", "Bar model", "Bar model", "Gaps & spacing",
  "Money", "Bar model", "Patterns", "Gaps & spacing", "Bar model", "Bar model",
];
const typeOf = (i) => TYPES[i] || "Other";

// Allison completed this paper in the earlier app, before attempt logging existed.
// Per-question timing was not recorded, so it is deliberately left null rather
// than estimated. The known overall time (35:16) remains available to analytics.
const ALLISON_IMPORTED_ID = "allison-old-version-2026-09-06";
const ALLISON_MISSED = {
  9: { kind: "incorrect", given: "9" },
  11: { kind: "incorrect", given: "16" },
  17: { kind: "incorrect", given: "920" },
  18: { kind: "incorrect", given: "3400" },
  23: { kind: "incorrect", given: "13" },
  24: { kind: "incorrect", given: "25" },
  25: { kind: "incorrect", given: "62" },
  26: { kind: "incorrect", given: "196" },
  28: { kind: "incorrect", given: "25" },
  29: { kind: "incorrect", given: "128" },
  30: { kind: "timeout", given: "" },
};
const ALLISON_IMPORTED_ATTEMPT = {
  id: ALLISON_IMPORTED_ID,
  date: "2026-09-06",
  when: "Allison · 6 Sep 2026",
  learner: "Allison",
  source: "old version",
  imported: true,
  score: 55,
  correct: 20,
  incorrect: 10,
  timeout: 1,
  elapsed: 35 * 60 + 16,
  bySec: {
    A: { got: 26, max: 30, right: 13, n: 15 },
    B: { got: 24, max: 40, right: 6, n: 10 },
    C: { got: 5, max: 30, right: 1, n: 6 },
  },
  q: QUESTIONS.map((qq, i) => {
    const missed = ALLISON_MISSED[i];
    return {
      i, sec: qq.sec, type: typeOf(i),
      kind: missed ? missed.kind : "correct",
      given: missed ? missed.given : "",
      secs: null,
    };
  }),
};

function includeImportedAttempts(log) {
  return log.some((r) => r.id === ALLISON_IMPORTED_ID) ? log : [ALLISON_IMPORTED_ATTEMPT, ...log];
}

// ---------- attempt log persistence ----------
// Prefers the artifact storage API (window.storage); falls back to localStorage, then memory.
const LOG_KEY = "smc-grade3-log";
async function loadLog() {
  try { if (window.storage) { const r = await window.storage.get(LOG_KEY); if (r && r.value) return includeImportedAttempts(JSON.parse(r.value)); } } catch (e) {}
  try { const v = localStorage.getItem(LOG_KEY); if (v) return includeImportedAttempts(JSON.parse(v)); } catch (e) {}
  return [ALLISON_IMPORTED_ATTEMPT];
}
async function saveLog(log) {
  const s = JSON.stringify(log);
  try { if (window.storage) { await window.storage.set(LOG_KEY, s); return; } } catch (e) {}
  try { localStorage.setItem(LOG_KEY, s); } catch (e) {}
}

// ---------- analytics over the last N attempts ----------
function computeAnalytics(log, n = 3) {
  const recent = log.slice(0, n);
  if (!recent.length) return null;
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const avgOrNull = (arr) => arr.length ? avg(arr) : null;
  const total = avg(recent.map((r) => r.score));
  const bySec = {};
  ["A", "B", "C"].forEach((s) => {
    const recordedTimes = recent.flatMap((r) => r.q.filter((x) => x.sec === s && Number.isFinite(x.secs)).map((x) => x.secs));
    bySec[s] = {
      pts: avg(recent.map((r) => r.bySec[s].got)), max: recent[0].bySec[s].max,
      acc: avg(recent.map((r) => r.bySec[s].right / r.bySec[s].n)) * 100,
      secs: avgOrNull(recordedTimes),
      allowed: SEC_INFO[s].secs,
    };
  });
  const byType = {};
  recent.forEach((r) => r.q.forEach((x) => {
    const t = byType[x.type] || (byType[x.type] = { n: 0, right: 0, wrong: 0, timeout: 0, secs: 0, allowed: 0, timed: 0 });
    t.n++;
    if (Number.isFinite(x.secs)) { t.secs += x.secs; t.allowed += SEC_INFO[x.sec].secs; t.timed++; }
    if (x.kind === "correct") t.right++; else if (x.kind === "timeout") t.timeout++; else t.wrong++;
  }));
  const types = Object.entries(byType).map(([type, t]) => ({
    type, n: t.n, right: t.right, wrong: t.wrong, timeout: t.timeout,
    acc: (t.right / t.n) * 100,
    avgSecs: t.timed ? t.secs / t.timed : null,
    pace: t.timed ? t.secs / t.allowed : null,
  })).sort((a, b) => a.acc - b.acc || (b.pace || 0) - (a.pace || 0));
  const weakest = types.filter((t) => t.n >= 2 && t.acc < 100).slice(0, 3);
  const slowest = [...types].filter((t) => t.pace != null).sort((a, b) => b.pace - a.pace).filter((t) => t.pace > 0.6).slice(0, 3);
  const trend = recent.map((r) => r.score).reverse(); // oldest → newest
  return {
    n: recent.length, total, bySec, types, weakest, slowest, trend,
    elapsed: avg(recent.map((r) => r.elapsed || 0)),
    imported: recent.filter((r) => r.imported).length,
  };
}

function fmtDuration(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function answerText(qq) {
  return qq.answerLabel || String(qq.answer);
}

// ---------- log & analytics panels ----------
function LogPanel({ log }) {
  if (!log.length) return <div style={st.subtle}>No papers finished yet — the log fills in after each test.</div>;
  return (
    <div style={{ ...st.secTable, padding: "6px 10px" }}>
      <div style={{ ...st.secRow, fontSize: 11, color: "#6B7B8C", borderBottom: "1px solid #D5DFE7" }}>
        <span style={{ flex: 1.4 }}>Paper</span><span style={{ flex: 0.8, textAlign: "right" }}>Total</span>
        <span style={{ flex: 0.8, textAlign: "right" }}>A /30</span><span style={{ flex: 0.8, textAlign: "right" }}>B /40</span><span style={{ flex: 0.8, textAlign: "right" }}>C /30</span><span style={{ flex: 0.7, textAlign: "right" }}>Time</span>
      </div>
      {log.map((r, i) => (
        <div key={r.id} style={{ ...st.secRow, fontWeight: i === 0 ? 800 : 600 }}>
          <span style={{ flex: 1.4 }}>{r.when}{r.imported ? <span style={st.importTag}> imported</span> : null}</span>
          <span style={{ flex: 0.8, textAlign: "right", color: r.score >= 80 ? "#1E8A4C" : "#1E4FA3" }}>{r.score}</span>
          {["A", "B", "C"].map((s) => <span key={s} style={{ flex: 0.8, textAlign: "right" }}>{r.bySec[s].got} <span style={{ color: "#6B7B8C", fontSize: 10 }}>({r.bySec[s].right}/{r.bySec[s].n})</span></span>)}
          <span style={{ flex: 0.7, textAlign: "right", color: "#6B7B8C" }}>{fmtDuration(r.elapsed)}</span>
        </div>
      ))}
    </div>
  );
}

function AnalyticsPanel({ log }) {
  const a = computeAnalytics(log, 3);
  if (!a) return <div style={st.subtle}>Analytics appear after the first finished paper (best after 3).</div>;
  const importedResult = log.find((r) => r.id === ALLISON_IMPORTED_ID);
  const pct = (x) => `${Math.round(x)}%`;
  const paceCol = (p) => (p == null ? "#6B7B8C" : p > 0.85 ? "#D23B2E" : p > 0.6 ? "#B0731D" : "#1E8A4C");
  const bar = (v, max, col) => (
    <span style={{ display: "inline-block", width: 90, height: 8, background: "#D5DFE7", borderRadius: 99, overflow: "hidden", verticalAlign: "middle", marginLeft: 6 }}>
      <span style={{ display: "block", width: `${Math.max(0, Math.min(100, (v / max) * 100))}%`, height: "100%", background: col }}></span>
    </span>
  );
  return (
    <div style={{ textAlign: "left" }}>
      <div style={st.secTable}>
        <div style={st.secRow}><b>Average of last {a.n} paper{a.n > 1 ? "s" : ""}</b><span style={{ fontWeight: 900, color: "#1E4FA3" }}>{a.total.toFixed(1)} / {MAX_SCORE}</span></div>
        <div style={st.secRow}><span>Trend (oldest → newest)</span><span>{a.trend.map((t, i) => <span key={i}>{i > 0 ? (t > a.trend[i - 1] ? " ↗ " : t < a.trend[i - 1] ? " ↘ " : " → ") : ""}{t}</span>)}</span></div>
        <div style={st.secRow}><span>Average time used</span><span>{fmtDuration(a.elapsed)} of 90:00</span></div>
        {a.imported > 0 && <div style={st.analyticsNote}>Includes Allison's old-version result. Only the known total time is used; missing per-question times are not estimated.</div>}
      </div>
      <div style={{ ...st.secTable }}>
        <div style={{ fontSize: 11, color: "#6B7B8C", marginBottom: 2 }}>BY SECTION · avg points · accuracy · pace</div>
        {["A", "B", "C"].map((s) => (
          <div key={s} style={st.secRow}>
            <b>Section {s}</b>
            <span>{a.bySec[s].pts.toFixed(1)}/{a.bySec[s].max} · {pct(a.bySec[s].acc)} · <span style={{ color: paceCol(a.bySec[s].secs == null ? null : a.bySec[s].secs / a.bySec[s].allowed) }}>{a.bySec[s].secs == null ? "pace not recorded" : `${Math.round(a.bySec[s].secs)}s of ${a.bySec[s].allowed}s`}</span></span>
          </div>
        ))}
      </div>
      <div style={{ ...st.secTable }}>
        <div style={{ fontSize: 11, color: "#6B7B8C", marginBottom: 2 }}>BY QUESTION STYLE · right / wrong / ⏰ · accuracy · avg time</div>
        {a.types.map((t) => (
          <div key={t.type} style={{ ...st.secRow, alignItems: "center" }}>
            <span style={{ flex: 1.3 }}>{t.type}</span>
            <span style={{ flex: 0.9, textAlign: "right", fontSize: 12 }}><span style={{ color: "#1E8A4C" }}>{t.right}</span> / <span style={{ color: "#D23B2E" }}>{t.wrong}</span> / <span style={{ color: "#B0731D" }}>{t.timeout}</span></span>
            <span style={{ flex: 1.2, textAlign: "right" }}>{pct(t.acc)}{bar(t.acc, 100, t.acc >= 80 ? "#1E8A4C" : t.acc >= 50 ? "#B0731D" : "#D23B2E")}</span>
            <span style={{ flex: 0.7, textAlign: "right", color: paceCol(t.pace), fontSize: 12 }}>{t.avgSecs == null ? "—" : `${Math.round(t.avgSecs)}s`}</span>
          </div>
        ))}
      </div>
      {(a.weakest.length > 0 || a.slowest.length > 0) && (
        <div style={{ ...st.secTable, background: "#FFF8E8", borderColor: "#B0731D" }}>
          {a.weakest.length > 0 && <div style={{ fontSize: 13 }}><b>Practice next:</b> {a.weakest.map((t) => `${t.type} (${pct(t.acc)})`).join(" · ")}</div>}
          {a.slowest.length > 0 && <div style={{ fontSize: 13, marginTop: 4 }}><b>Slowest (uses most of the clock):</b> {a.slowest.map((t) => `${t.type} (${Math.round(t.pace * 100)}% of time)`).join(" · ")}</div>}
        </div>
      )}
      {importedResult && (
        <div style={{ ...st.secTable, background: "#F8F4FF", borderColor: "#7952B3" }}>
          <div style={{ ...st.secRow, alignItems: "baseline" }}>
            <b>Allison · old version</b>
            <span style={{ fontWeight: 900, color: "#5A3A91" }}>55 / 100 · {fmtDuration(importedResult.elapsed)}</span>
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.55 }}>
            A 13/15 (26/30) · B 6/10 (24/40) · C 1/6 (5/30)<br />
            Incorrect: Q10, Q12, Q18, Q19, Q24, Q25, Q26, Q27, Q29, Q30 · Timeout: Q31
          </div>
        </div>
      )}
    </div>
  );
}

function VerifiedAnswerKey({ openKey, setOpenKey }) {
  return (
    <div style={st.answerKeyWrap}>
      <div style={st.answerKeyIntro}>
        <b>Parent/teacher validation key</b><br />
        Every answer includes the full working and a separate reverse, substitution or boundary check. Keep this panel closed during a test.
      </div>
      {QUESTIONS.map((qq, i) => {
        const open = openKey === i;
        return (
          <div key={i} style={st.reviewItem}>
            <button style={st.reviewHead} onClick={() => setOpenKey(open ? null : i)} aria-expanded={open}>
              <span style={st.reviewQnum}>Q{i + 1} · Section {qq.sec}</span>
              <span style={{ color: "#1E8A4C", fontWeight: 900, fontSize: 12 }}>Answer: {answerText(qq)} {open ? "▴" : "▾"}</span>
            </button>
            {open && (
              <div style={st.tutorialBox}>
                <div style={st.reviewQText}>{qq.text}</div>
                <QuestionFigure src={qq.src} />
                {qq.steps.map((step, si) => (
                  <div key={si} style={st.stepLine}>
                    <span style={st.stepNum}>{si + 1}</span> {step}
                  </div>
                ))}
                <div style={st.verifyBox}>
                  <b>🔎 Independent verification</b>
                  <div style={{ marginTop: 4 }}>{qq.check}</div>
                </div>
                <div style={st.finalAns}>✅ Verified answer: {answerText(qq)} <span style={{ color: "#8A93A0", fontWeight: 400 }}>(format adapted from {qq.src})</span></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------- main component ----------

const PAD_KEYS = [7, 8, 9, 4, 5, 6, 1, 2, 3];

export default function SmcGrade3Practice() {
  const [phase, setPhase] = useState("idle"); // idle | running | done
  const [qIdx, setQIdx] = useState(0);
  const [input, setInput] = useState("");
  const [picked, setPicked] = useState(null); // mcq selection
  const [timeLeft, setTimeLeft] = useState(SEC_INFO.A.secs);
  const [results, setResults] = useState([]); // {kind:'correct'|'incorrect'|'timeout', given}
  const [startAt, setStartAt] = useState(0);
  const [summary, setSummary] = useState(null);
  const [openReview, setOpenReview] = useState(null); // index of expanded review item
  const [revealed, setRevealed] = useState(1); // steps revealed in open review item
  const [log, setLog] = useState([]);          // saved attempts, newest first
  const [panel, setPanel] = useState(null);    // null | "log" | "analytics" | "answerKey"
  const wakeRef = useRef(null);
  useEffect(() => {
    loadLog().then((l) => {
      const loaded = Array.isArray(l) ? l : [ALLISON_IMPORTED_ATTEMPT];
      setLog(loaded);
      saveLog(loaded); // persists the one-time imported result without duplicating it
    });
  }, []);

  const q = QUESTIONS[qIdx];
  const info = q ? SEC_INFO[q.sec] : SEC_INFO.A;

  // ----- wake lock -----
  async function acquireWakeLock() {
    try { if ("wakeLock" in navigator) wakeRef.current = await navigator.wakeLock.request("screen"); } catch (e) {}
  }
  function releaseWakeLock() { try { wakeRef.current?.release(); } catch (e) {} wakeRef.current = null; }
  useEffect(() => {
    if (phase === "running") acquireWakeLock(); else releaseWakeLock();
    const onVis = () => { if (document.visibilityState === "visible" && phase === "running") acquireWakeLock(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { document.removeEventListener("visibilitychange", onVis); releaseWakeLock(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ----- countdown -----
  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [phase, qIdx]);

  useEffect(() => {
    if (phase === "running" && timeLeft <= 0) record("timeout");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  function start() {
    setQIdx(0);
    setInput("");
    setPicked(null);
    setResults([]);
    setTimeLeft(SEC_INFO[QUESTIONS[0].sec].secs);
    setStartAt(Date.now());
    setSummary(null);
    setPhase("running");
  }

  function fmtAnswer(qq) {
    return qq.answerLabel || String(qq.answer);
  }

  function record(kind, given = "") {
    const nextResults = [...results, { kind, given, secs: SEC_INFO[q.sec].secs - Math.max(0, timeLeft) }];
    setResults(nextResults);
    if (qIdx + 1 >= QUESTIONS.length) finish(nextResults);
    else {
      const nq = QUESTIONS[qIdx + 1];
      setQIdx(qIdx + 1);
      setInput("");
      setPicked(null);
      setTimeLeft(SEC_INFO[nq.sec].secs);
    }
  }

  function finish(finalResults) {
    let score = 0;
    const bySec = { A: { got: 0, max: 0, right: 0, n: 0 }, B: { got: 0, max: 0, right: 0, n: 0 }, C: { got: 0, max: 0, right: 0, n: 0 } };
    finalResults.forEach((r, i) => {
      const qq = QUESTIONS[i];
      const p = SEC_INFO[qq.sec].pts;
      bySec[qq.sec].max += p;
      bySec[qq.sec].n += 1;
      if (r.kind === "correct") { score += p; bySec[qq.sec].got += p; bySec[qq.sec].right += 1; }
    });
    const elapsed = Math.round((Date.now() - startAt) / 1000);
    setSummary({
      score, bySec,
      correct: finalResults.filter((r) => r.kind === "correct").length,
      incorrect: finalResults.filter((r) => r.kind === "incorrect").length,
      timeout: finalResults.filter((r) => r.kind === "timeout").length,
      mins: `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`,
      results: finalResults,
    });
    const now = new Date();
    const attempt = {
      id: String(Date.now()), date: now.toISOString().slice(0, 10),
      when: now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      score, bySec, elapsed,
      q: finalResults.map((r, i) => ({ i, sec: QUESTIONS[i].sec, type: typeOf(i), kind: r.kind, secs: r.secs || 0 })),
    };
    const nl = [attempt, ...log].slice(0, 50);
    setLog(nl); saveLog(nl);
    setOpenReview(null);
    setPanel(null);
    setPhase("done");
  }

  // ----- input -----
  const isMcq = q && !q.numeric;
  function pressKey(k) {
    if (phase !== "running" || input.length >= 8) return;
    setInput(input + k);
  }
  function pressBackspace() { setInput(input.slice(0, -1)); }
  function submit() {
    if (isMcq) {
      if (picked === null) return;
      record(picked === q.answer ? "correct" : "incorrect", picked);
    } else {
      if (input.trim() === "") return;
      record(parseInt(input, 10) === q.answer ? "correct" : "incorrect", input);
    }
  }

  const timerPct = Math.max(0, timeLeft / info.secs) * 100;
  const timerColor = timeLeft <= 20 ? "#D23B2E" : "#1E4FA3";
  const mm = Math.floor(Math.max(0, timeLeft) / 60), ss = String(Math.max(0, timeLeft) % 60).padStart(2, "0");
  const elapsedMin = phase === "running" ? Math.floor((Date.now() - startAt) / 60000) : 0;

  const wrongList = summary
    ? summary.results.map((r, i) => ({ ...r, i })).filter((r) => r.kind !== "correct")
    : [];

  return (
    <div style={st.page}>
      <style>{css}</style>
      <header style={st.appHeader}>
        <div style={st.brandMark}>SMC</div>
        <div>
          <div style={st.brandName}>Practice Paper</div>
          <div style={st.brandMeta}>Grade 3 · records saved on this device</div>
        </div>
      </header>

      {/* ---------- start ---------- */}
      {phase === "idle" && (
        <div style={st.card}>
          <div style={st.kicker}>SINGAPORE MATH CHALLENGE · GRADE 3</div>
          <h1 style={st.title}>SMC Practice</h1>
          <p style={st.introText}>
            The real SMC Grade 3 paper is <b>1 hour 30 minutes</b> — this practice uses the full 90 minutes,
            split by difficulty exactly like the contest:
          </p>
          <div style={st.secTable}>
            <div style={st.secRow}><b>Section A</b><span>15 questions · 2 pts · 2 min each</span></div>
            <div style={st.secRow}><b>Section B</b><span>10 questions · 4 pts · 3 min each</span></div>
            <div style={st.secRow}><b>Section C</b><span>6 questions · 5 pts · 5 min each</span></div>
          </div>
          <p style={st.introText}>
            Question formats are adapted from the official 2024 and 2023 SMC papers, with fresh numbers for this version.
            One question at a time — no going back, just like the app drills.
            No points are lost for wrong answers (real SMC rule), so always try!
            At the end: your total score out of {MAX_SCORE}, plus working diagrams, step-by-step solutions and an independent check for every question missed.
          </p>
          <button style={st.primaryBtn} onClick={start}>Start paper</button>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
            <button style={{ ...st.ghostBtn, ...(panel === "log" ? { background: "#E4ECF6" } : {}) }} onClick={() => setPanel(panel === "log" ? null : "log")}>Records ({log.length})</button>
            <button style={{ ...st.ghostBtn, ...(panel === "analytics" ? { background: "#E4ECF6" } : {}) }} onClick={() => setPanel(panel === "analytics" ? null : "analytics")}>Analytics</button>
          </div>
          {panel === "log" && <div style={{ marginTop: 10 }}><LogPanel log={log} /></div>}
          {panel === "analytics" && <div style={{ marginTop: 10 }}><AnalyticsPanel log={log} /></div>}
        </div>
      )}

      {/* ---------- running ---------- */}
      {phase === "running" && q && (
        <div style={st.playArea}>
          <div style={st.statusRow}>
            <span style={st.qCount}>Q{qIdx + 1}/{QUESTIONS.length} · {SEC_INFO[q.sec].label}</span>
            <span style={{ ...st.clock, color: timerColor }}>⏱ {mm}:{ss}</span>
          </div>
          <div style={st.timerTrack}>
            <div style={{ ...st.timerFill, width: `${timerPct}%`, background: timerColor }} />
          </div>

          <div style={st.sheet}>
            <div style={st.marginLine} aria-hidden="true" />
            <div style={st.qText}>{q.text}</div>
            <QuestionFigure src={q.src} />

            {isMcq ? (
              <div style={st.optionCol}>
                {q.options.map((op) => (
                  <button
                    key={op}
                    onClick={() => setPicked(op)}
                    style={{ ...st.optionBtn, ...(picked === op ? st.optionOn : {}) }}
                  >
                    {op}
                  </button>
                ))}
              </div>
            ) : (
              <div style={st.inputBox} aria-label="your answer">
                {input === "" ? <span style={{ color: "#9BB2C6" }}>answer…</span> : input}
              </div>
            )}
          </div>

          <div className="pad-wrap" style={st.padWrap}>
            {isMcq ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7B8C", fontSize: 13, fontWeight: 700 }}>
                Select one answer.
              </div>
            ) : (
              <div className="answer-pad" style={st.pad}>
                {PAD_KEYS.map((k) => (
                  <button key={k} style={st.key} onClick={() => pressKey(String(k))}>{k}</button>
                ))}
                <button style={st.key} onClick={() => pressKey("0")}>0</button>
                <button style={{ ...st.key, ...st.keyBack, gridColumn: "span 2" }} onClick={pressBackspace} aria-label="backspace">⌫</button>
              </div>
            )}
            <div className="action-col" style={st.actionCol}>
              <button style={st.goBtn} onClick={submit}>Submit & next</button>
              <button style={st.restartBtn} onClick={start}>Restart paper</button>
            </div>
          </div>
          <div style={st.subtle}>{elapsedMin} min elapsed · full test is 90 min</div>
        </div>
      )}

      {/* ---------- recap + tutorials ---------- */}
      {phase === "done" && summary && (
        <>
          <div style={st.card}>
            <div style={st.kicker}>SMC PRACTICE · RESULT</div>
            <h2 style={{ margin: "4px 0", color: "#1E4FA3" }}>Paper complete</h2>
            <div style={st.bigScore}>{summary.score} / {MAX_SCORE}</div>
            <div style={st.tally}>
              <span style={{ color: "#1E8A4C" }}>✓ {summary.correct}</span>
              <span style={{ color: "#D23B2E" }}>✗ {summary.incorrect}</span>
              <span style={{ color: "#B0731D" }}>⏰ {summary.timeout}</span>
              <span style={{ color: "#6B7B8C" }}>🕐 {summary.mins}</span>
            </div>
            <div style={st.secTable}>
              {["A", "B", "C"].map((s) => (
                <div key={s} style={st.secRow}>
                  <b>Section {s}</b>
                  <span>{summary.bySec[s].right}/{summary.bySec[s].n} correct · {summary.bySec[s].got}/{summary.bySec[s].max} pts</span>
                </div>
              ))}
            </div>
            <button style={{ ...st.primaryBtn, marginTop: 14 }} onClick={start}>Start another paper</button>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
              <button style={{ ...st.ghostBtn, ...(panel === "log" ? { background: "#E4ECF6" } : {}) }} onClick={() => setPanel(panel === "log" ? null : "log")}>Records ({log.length})</button>
              <button style={{ ...st.ghostBtn, ...(panel === "analytics" ? { background: "#E4ECF6" } : {}) }} onClick={() => setPanel(panel === "analytics" ? null : "analytics")}>Analytics</button>
              <button style={{ ...st.ghostBtn, ...(panel === "answerKey" ? { background: "#E4ECF6" } : {}) }} onClick={() => { setPanel(panel === "answerKey" ? null : "answerKey"); setOpenReview(null); }}>Answer key</button>
            </div>
            {panel === "log" && <div style={{ marginTop: 10 }}><LogPanel log={log} /></div>}
            {panel === "analytics" && <div style={{ marginTop: 10 }}><AnalyticsPanel log={log} /></div>}
            {panel === "answerKey" && <VerifiedAnswerKey openKey={openReview} setOpenKey={setOpenReview} />}
          </div>

          {wrongList.length > 0 && (
            <div style={st.logBox}>
              <div style={st.logTitle}>Review the {wrongList.length} missed questions</div>
              {wrongList.map((m) => {
                const qq = QUESTIONS[m.i];
                const open = openReview === m.i;
                return (
                  <div key={m.i} style={st.reviewItem}>
                    <button
                      style={st.reviewHead}
                      onClick={() => { setOpenReview(open ? null : m.i); setRevealed(1); }}
                    >
                      <span style={st.reviewQnum}>Q{m.i + 1} · {qq.sec} · {SEC_INFO[qq.sec].pts} pts</span>
                      <span style={{ color: m.kind === "timeout" ? "#B0731D" : "#D23B2E", fontWeight: 800, fontSize: 12 }}>
                        {m.kind === "timeout" ? "⏰ out of time" : `✗ you put ${m.given}`}
                      </span>
                    </button>
                    {open && (
                      <div style={st.tutorialBox}>
                        <div style={st.reviewQText}>{qq.text}</div>
                        <QuestionFigure src={qq.src} />
                        {qq.steps.slice(0, revealed).map((s, si) => (
                          <div key={si} className="fade" style={st.stepLine}>
                            <span style={st.stepNum}>{si + 1}</span> {s}
                          </div>
                        ))}
                        {revealed < qq.steps.length ? (
                          <div style={st.stepActions}>
                            <button style={st.stepBtn} onClick={() => setRevealed(revealed + 1)}>Next step →</button>
                            <button style={st.showAllBtn} onClick={() => setRevealed(qq.steps.length)}>Show all working</button>
                          </div>
                        ) : (
                          <>
                            <div style={st.verifyBox}>
                              <b>🔎 Parent/teacher verification</b>
                              <div style={{ marginTop: 4 }}>{qq.check}</div>
                            </div>
                            <div style={st.finalAns}>✅ Verified answer: {fmtAnswer(qq)} <span style={{ color: "#8A93A0", fontWeight: 400 }}>(format adapted from {qq.src})</span></div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ---------- styles: focused assessment interface ----------

const ink = "#1E4FA3";
const graphite = "#2A2A33";
const redPen = "#D23B2E";

const st = {
  page: {
    minHeight: "100vh", background: "#F3F6F9",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: graphite,
    display: "flex", flexDirection: "column", alignItems: "center", padding: "18px 14px 40px",
  },
  appHeader: {
    width: "100%", maxWidth: 760, display: "flex", alignItems: "center", gap: 12,
    marginBottom: 14, padding: "2px 2px 10px", borderBottom: "1px solid #D7E0E8",
  },
  brandMark: {
    width: 42, height: 42, borderRadius: 10, background: ink, color: "#fff", display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: 13, letterSpacing: "0.08em", fontWeight: 900,
  },
  brandName: { fontSize: 16, fontWeight: 800, color: "#173B76", lineHeight: 1.2 },
  brandMeta: { fontSize: 12, color: "#6B7B8C", marginTop: 2 },
  kicker: { fontSize: 12, letterSpacing: "0.12em", color: "#6B7B8C", fontWeight: 750 },
  title: { margin: "6px 0 0", fontSize: "clamp(24px, 5vw, 34px)", color: "#173B76" },
  card: {
    background: "#fff", border: "1px solid #D7E0E8", borderRadius: 16, padding: "26px 24px", maxWidth: 760, width: "100%",
    boxShadow: "0 10px 30px rgba(31,45,61,0.08)", textAlign: "center",
  },
  introText: { fontSize: 14.5, lineHeight: 1.55, margin: "10px 0 12px", textAlign: "left" },
  subtle: { fontSize: 11, color: "#6B7B8C", marginTop: 5, textAlign: "center" },
  secTable: {
    background: "#F4F8FC", border: `2px solid ${ink}`, borderRadius: 10,
    padding: "8px 12px", margin: "6px 0", textAlign: "left",
  },
  secRow: { display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", gap: 8 },
  importTag: {
    display: "inline-block", marginLeft: 4, padding: "1px 5px", borderRadius: 99,
    background: "#E9EEF4", color: "#6B7B8C", fontSize: 9, fontWeight: 800, textTransform: "uppercase",
  },
  analyticsNote: { fontSize: 11, color: "#6B7B8C", lineHeight: 1.4, paddingTop: 5, borderTop: "1px solid #D5DFE7", marginTop: 3 },
  playArea: { width: "100%", maxWidth: 760, display: "flex", flexDirection: "column" },
  statusRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 8 },
  qCount: { fontWeight: 800, fontSize: 12, color: "#6B7B8C" },
  clock: { fontWeight: 800, fontSize: 18, fontVariantNumeric: "tabular-nums" },
  timerTrack: { width: "100%", height: 8, background: "#D5DFE7", borderRadius: 999, overflow: "hidden", marginBottom: 6 },
  timerFill: { height: "100%", transition: "width 1s linear, background .3s" },
  sheet: {
    position: "relative", width: "100%",
    background: "#fff", border: "1px solid #D7E0E8",
    borderRadius: 14, boxShadow: "0 8px 24px rgba(31,45,61,0.08)",
    padding: "22px 20px 22px 38px",
  },
  marginLine: { position: "absolute", top: 14, bottom: 14, left: 22, width: 3, borderRadius: 99, background: "#C8D9EE" },
  qText: { fontSize: "clamp(15px, 4.4vw, 17px)", lineHeight: 1.55, fontWeight: 600, textAlign: "left" },
  optionCol: { display: "flex", flexDirection: "column", gap: 8, marginTop: 12 },
  optionBtn: {
    padding: "10px 14px", fontSize: 16, fontWeight: 700, textAlign: "left",
    background: "#fff", color: graphite,
    border: "1.5px solid #AFC0D0", borderRadius: 10, cursor: "pointer",
    fontFamily: "Consolas, Menlo, monospace", touchAction: "manipulation",
  },
  optionOn: { border: `2px solid ${ink}`, background: "#EEF4FD", color: ink },
  inputBox: {
    margin: "12px auto 0", minHeight: 50, maxWidth: 300,
    border: "2px solid #AFC0D0", borderRadius: 10, background: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "Consolas, Menlo, monospace", fontWeight: 800, fontSize: 27,
  },
  padWrap: { display: "flex", gap: 8, marginTop: 10, alignItems: "stretch", minHeight: 120 },
  pad: { flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 },
  key: {
    height: "clamp(42px, 6.2vh, 54px)", fontSize: 22, fontWeight: 800,
    fontFamily: "Consolas, Menlo, monospace",
    background: "#fff", color: graphite, border: "2px solid #9BB2C6",
    borderRadius: 10, cursor: "pointer", boxShadow: "0 2px 0 rgba(100,120,140,0.35)",
    touchAction: "manipulation", userSelect: "none",
  },
  keyBack: { color: redPen, borderColor: redPen, fontSize: 24 },
  actionCol: { display: "flex", flexDirection: "column", gap: 6, width: "30%", minWidth: 132 },
  goBtn: {
    flex: 1, background: ink, color: "#fff", border: "none", borderRadius: 12,
    fontSize: 16, fontWeight: 800, cursor: "pointer",
    boxShadow: "0 3px 10px rgba(30,79,163,0.2)", touchAction: "manipulation",
  },
  restartBtn: {
    background: "#fff", color: ink, border: `2px solid ${ink}`, borderRadius: 10,
    padding: "8px 6px", fontSize: 12, fontWeight: 700, cursor: "pointer", touchAction: "manipulation",
  },
  ghostBtn: {
    background: "#fff", color: "#1E4FA3", border: "2px solid #1E4FA3", borderRadius: 10,
    padding: "8px 14px", fontWeight: 800, fontSize: 13, cursor: "pointer",
  },
  primaryBtn: {
    background: ink, color: "#fff", border: "none", borderRadius: 12,
    padding: "12px 26px", fontSize: 16, fontWeight: 800, cursor: "pointer",
    boxShadow: "0 4px 12px rgba(30,79,163,0.22)",
  },
  bigScore: { fontSize: 52, fontWeight: 900, color: ink, margin: "6px 0" },
  tally: { display: "flex", gap: 16, justifyContent: "center", fontWeight: 800, fontSize: 15, margin: "0 0 10px", flexWrap: "wrap" },
  logBox: {
    width: "100%", maxWidth: 760, marginTop: 20, background: "#fff", border: "1px solid #D7E0E8",
    borderRadius: 14, padding: "16px 16px", boxShadow: "0 6px 18px rgba(30,60,90,0.08)",
  },
  logTitle: { fontWeight: 800, color: ink, fontSize: 14, letterSpacing: "0.02em", marginBottom: 10 },
  answerKeyWrap: { marginTop: 12, textAlign: "left", borderTop: "2px solid #D5DFE7", paddingTop: 8 },
  answerKeyIntro: {
    background: "#EAF7EF", border: "1.5px solid #1E8A4C", borderRadius: 9,
    padding: "9px 11px", marginBottom: 5, color: "#205B38", fontSize: 12, lineHeight: 1.45,
  },
  reviewItem: { borderBottom: "1px solid #EDF1F5" },
  reviewHead: {
    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
    background: "none", border: "none", padding: "10px 2px", cursor: "pointer", textAlign: "left",
  },
  reviewQnum: { fontWeight: 800, fontSize: 13, color: ink },
  reviewQText: { fontSize: 13.5, lineHeight: 1.5, marginBottom: 10, fontWeight: 600 },
  tutorialBox: {
    background: "#F4F8FC", border: `2px solid ${ink}`, borderRadius: 10,
    padding: "12px 14px", margin: "0 0 12px", textAlign: "left",
  },
  stepLine: { fontSize: 13.5, lineHeight: 1.6, marginBottom: 6, display: "flex", gap: 8, alignItems: "flex-start" },
  stepNum: {
    minWidth: 20, height: 20, borderRadius: "50%", background: ink, color: "#fff",
    fontSize: 11, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: 2,
  },
  stepBtn: {
    marginTop: 6, background: ink, color: "#fff", border: "none", borderRadius: 10,
    padding: "8px 16px", fontSize: 13, fontWeight: 800, cursor: "pointer",
  },
  stepActions: { display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" },
  showAllBtn: {
    marginTop: 6, background: "#fff", color: ink, border: `2px solid ${ink}`, borderRadius: 10,
    padding: "6px 14px", fontSize: 13, fontWeight: 800, cursor: "pointer",
  },
  verifyBox: {
    marginTop: 10, background: "#FFF8E8", border: "1.5px solid #B0731D", borderRadius: 9,
    padding: "9px 11px", color: "#604A1D", fontSize: 13, lineHeight: 1.5,
  },
  finalAns: { marginTop: 8, fontWeight: 800, color: "#1E8A4C", fontSize: 14 },
};

const css = `
* { box-sizing: border-box; }
html, body, #root { min-height: 100%; }
body { margin: 0; background: #F3F6F9; }
@keyframes fadeSlide { 0%{opacity:0; transform:translateY(-4px)} 100%{opacity:1; transform:none} }
.fade { animation: fadeSlide .25s ease-out; }
@media (prefers-reduced-motion: reduce) { .fade { animation: none; } }
@media (max-width: 520px) {
  .pad-wrap { flex-direction: column; }
  .action-col { width: 100% !important; min-width: 0 !important; flex-direction: row !important; }
  .action-col > button { min-height: 48px; }
}
button:focus-visible { outline: 3px solid #1E4FA3; outline-offset: 2px; }
button:active { transform: translateY(1px); }
`;
export { FIGURES };
