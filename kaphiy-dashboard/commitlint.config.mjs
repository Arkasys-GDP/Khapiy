/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "chore", "refactor", "docs", "test", "perf", "style", "ci", "build", "revert"],
    ],
    "subject-case": [0],
    "header-max-length": [2, "always", 100],
  },
};

export default config;
