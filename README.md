# SMC Practice App

A focused, installable Grade 3 Singapore Math Challenge practice app.

Live app: https://gavgunawan.github.io/mathchamps/

## Product flow

1. Start the 31-question paper.
2. Complete one timed question at a time.
3. Save the result automatically on the device.
4. Review records and analytics.
5. Open verified working for missed questions after completion.

The app intentionally has no accounts, avatars, streaks, combos, leaderboards, rewards, or user-created papers.

## Included

- 90-minute paper split across Sections A, B and C
- Automatic scoring and section breakdowns
- Device-local attempt history
- Three-paper trend, question-style accuracy, and pacing analytics
- Allison's imported old-version result (55/100, 35:16)
- Step-by-step working and a separate validation check for every answer
- Installable PWA and offline support after the first successful load

## Run locally

```bash
npm install
npm run dev
```

## Validate and build

```bash
npm run check
```

The production output is written to `dist/`.
