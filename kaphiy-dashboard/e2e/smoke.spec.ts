import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home renders and has no critical a11y violations", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/KAPHIY/);

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  const critical = results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious",
  );
  expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
});
