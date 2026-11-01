// Builds the 4 Month 1 deliverables into submission/.
// Usage: npm run submission   (run after committing, because the zip is taken from HEAD)
import { execSync } from "node:child_process";
import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const NAME = "subhash-jeewantha-month1";
const OUT = "submission";
const run = (cmd) => execSync(cmd, { encoding: "utf8" });

mkdirSync(OUT, { recursive: true });

// 1. Test suite zip: every committed test file plus the config needed to run them.
const testPaths = [
  ":(glob)src/**/*.test.tsx",
  "tests",
  "cypress/e2e",
  "cypress/support",
  "cypress/tsconfig.json",
  "jest.config.js",
  "jest.setup.js",
  "cypress.config.js",
  "tsconfig.jest.json",
  "package.json",
];
run(
  `git archive --format=zip -o ${OUT}/${NAME}-test-suite.zip HEAD -- ${testPaths.map((p) => `"${p}"`).join(" ")}`,
);

// 2. Coverage report: run Jest with coverage, then inline the report's CSS/JS into one HTML file.
run("npx jest --coverage --silent");
const reportDir = "coverage/lcov-report";
const html = readFileSync(join(reportDir, "index.html"), "utf8")
  .replace(/<link rel="stylesheet" href="([^"]+)" \/>/g, (_, href) =>
    `<style>${readFileSync(join(reportDir, href), "utf8")}</style>`,
  )
  .replace(/<script src="([^"]+)"><\/script>/g, (_, src) =>
    `<script>${readFileSync(join(reportDir, src), "utf8")}</script>`,
  );
writeFileSync(join(OUT, `${NAME}-coverage-report.html`), html);

// 3. Bug documentation.
copyFileSync("docs/BUG-FIXES.md", join(OUT, `${NAME}-bug-fixes.md`));

// 4. TDD commit history, labelled red / green / refactor from the Conventional Commit prefixes.
const commits = run('git log --reverse --date=short --format="%h|%ad|%s"')
  .trim()
  .split("\n")
  .map((line) => {
    const [hash, date, ...rest] = line.split("|");
    return { hash, date, subject: rest.join("|") };
  });
const phase = (s) =>
  s.startsWith("test: failing test for") ? "🔴 RED"
  : s.startsWith("fix:") ? "🟢 GREEN"
  : s.startsWith("refactor:") ? "🔵 REFACTOR"
  : "";

const tddRows = commits
  .filter((c) => phase(c.subject))
  .map((c) => `| \`${c.hash}\` | ${phase(c.subject)} | ${c.subject} |`);
const allRows = commits.map((c) => `| \`${c.hash}\` | ${c.date} | ${c.subject} |`);

writeFileSync(
  join(OUT, `${NAME}-tdd-commits.md`),
  `# Month 1 – TDD Commit History

Generated from \`git log\` by \`npm run submission\`.
Repository: https://github.com/HVSJeew4/bistec-m1-code-quality

Every bug was fixed with red → green → refactor:

- 🔴 **RED** – \`test: failing test for …\` commits a test that fails because of the bug (the only
  commits in the history with a failing test).
- 🟢 **GREEN** – \`fix: …\` makes that test pass with the smallest change; all tests pass.
- 🔵 **REFACTOR** – \`refactor: …\` cleans up with tests still green (only where useful).

## TDD cycles

| Commit | Phase | Message |
|---|---|---|
${tddRows.join("\n")}

## Full history

| Commit | Date | Message |
|---|---|---|
${allRows.join("\n")}

To reproduce: \`git log --oneline\`. To see any red step fail: \`git checkout <red hash> && npm test\`.
`,
);

console.log(`Wrote to ${OUT}/:\n  ${readdirSync(OUT).join("\n  ")}`);
