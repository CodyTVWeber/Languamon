import { test, expect } from "@playwright/test";
import { enterOverworld, moveSteps, dismissDialogue } from "./helpers";

const HUD_FEED_ENTRY = "#hud-feed p";

test.describe("Lingua Legends overworld", () => {
    test("LexiLog prompt appears when collection is empty", async ({ page }) => {
        await enterOverworld(page);

        await page.keyboard.press("KeyL");
        const lexilogPrompt = page.getByText("LexiLog is empty for this track.");
        await expect(lexilogPrompt).toBeVisible({ timeout: 3_000 });

        await dismissDialogue(page, 3);
    });

    test("random encounter logs battle outcome", async ({ page }) => {
        await page.addInitScript(values => {
            const queue = values.slice();
            let index = 0;
            const fallback = 0.4;
            Math.random = () => {
                if (index < queue.length) {
                    const result = queue[index];
                    index += 1;
                    return result;
                }
                return fallback;
            };
        }, [0.01, 0.2, 0.4, 0.6, 0.3, 0.5]);

        await enterOverworld(page);

        await moveSteps(page, "ArrowLeft", 7);

        const battlePrompt = page.getByText("Enter/Space to answer");
        await expect(battlePrompt).toBeVisible({ timeout: 5_000 });

        await page.keyboard.press("Enter");

        const outcome = page.getByText(/Captured|Missed/);
        await expect(outcome).toBeVisible({ timeout: 5_000 });

        await page.waitForTimeout(2_000);

        const feedEntry = page.locator(HUD_FEED_ENTRY).first();
        await expect(feedEntry).toHaveText(/Captured|Missed/);
    });
});
