import { test, expect } from "@playwright/test";
import { enterOverworld } from "./helpers";

const HUD_TRACK = "#hud-track";
const HUD_PROGRESS = "#hud-progress";
const HUD_LEVEL = "#hud-level";

test.describe("Lingua Legends sanity checks", () => {
    test("loads the menu and shows HUD defaults", async ({ page }) => {
        await page.goto("/");

        await expect(page.getByText("Lingua Legends GB").first()).toBeVisible();
        await expect(page.locator(HUD_TRACK)).toHaveText(/Track: —/);
        await expect(page.locator(HUD_PROGRESS)).toHaveText(/Lexicon: 0/);
        await expect(page.locator(HUD_LEVEL)).toHaveText(/Rank: 1/);
    });

    test("selects a track and updates HUD after entering overworld", async ({ page }) => {
        await page.goto("/");

        await enterOverworld(page, { select: 1 });

        await expect(page.locator("canvas")).toBeVisible();
        await expect(page.locator(HUD_TRACK)).not.toHaveText(/Track: —/);
        await expect(page.locator(HUD_PROGRESS)).toHaveText(/Lexicon: \d+\/\d+/);
    });
});
