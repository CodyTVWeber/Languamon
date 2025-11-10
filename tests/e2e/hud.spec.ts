import { test, expect } from "@playwright/test";
import { enterOverworld } from "./helpers";

const HUD_FEED_ITEMS = "#hud-feed p";
const HUD_PROGRESS = "#hud-progress";

test.describe("HUD updates", () => {
    test("log feed shows welcome messages after selecting the track", async ({ page }) => {
        await enterOverworld(page);

        const items = page.locator(HUD_FEED_ITEMS);
        await expect(items).toHaveCount(2);
        await expect(items).toContainText([
            "Sunny greetings and everyday essentials from the valley.",
            "Welcome to Valle Verde!",
        ]);
    });

    test("progress panel reflects Spanish lexicon size", async ({ page }) => {
        await enterOverworld(page);

        await expect(page.locator(HUD_PROGRESS)).toHaveText(/Lexicon:\s*0\s*\/\s*8/);
    });
});
