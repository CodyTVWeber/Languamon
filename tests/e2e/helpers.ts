import { expect, type Page } from "@playwright/test";

const INTRO_SELECTOR = "text=/Welcome to/";

export async function enterOverworld(page: Page, options?: { select?: number }) {
    await page.goto("/");

    const trackIndex = options?.select ?? 0;
    if (trackIndex > 0) {
        for (let i = 0; i < trackIndex; i += 1) {
            await page.keyboard.press("ArrowDown");
            await page.waitForTimeout(60);
        }
    }

    await page.keyboard.press("Enter");
    const intro = page.locator(INTRO_SELECTOR);
    await expect(intro).toBeVisible({ timeout: 7_000 });

    await dismissDialogue(page, 6);
}

export async function dismissDialogue(page: Page, attempts = 4) {
    for (let i = 0; i < attempts; i += 1) {
        await page.keyboard.press("Space");
        await page.waitForTimeout(120);
    }
}

export async function moveSteps(page: Page, direction: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight", steps: number) {
    for (let i = 0; i < steps; i += 1) {
        await page.keyboard.down(direction);
        await page.waitForTimeout(160);
        await page.keyboard.up(direction);
        await page.waitForTimeout(80);
    }
}
