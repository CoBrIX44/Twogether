import { test, expect } from '@playwright/test';

test.describe('Twogether Photo Booth Happy Path', () => {
  test('navigates through the entire photo booth flow and takes screenshots', async ({ page }) => {
    // 1. Visit landing page
    await page.goto('/');
    await expect(page).toHaveTitle(/Twogether/i);
    await expect(page.getByRole('heading', { name: /Capturing moments/i })).toBeVisible();

    // Screenshot of landing page
    await page.screenshot({ path: 'dist/preview-landing.png', fullPage: true });

    // 2. Start photo session & select Same Device
    const startBtn = page.getByRole('button', { name: /step inside the booth/i });
    await expect(startBtn).toBeVisible();
    await startBtn.click({ force: true });

    // Choose Same Device in modal
    const sameDeviceBtn = page.getByRole('button', { name: /same device/i });
    await expect(sameDeviceBtn).toBeVisible();
    await sameDeviceBtn.click({ force: true });

    // 3. Verify capture screen with dual panels
    await expect(page.getByText(/round 1 of 3/i)).toBeVisible();
    await expect(page.getByText('Person 1')).toBeVisible();
    await expect(page.getByText('Person 2')).toBeVisible();

    const shutterBtn = page.getByLabel(/capture photo shutter button/i);
    await expect(shutterBtn).toBeVisible();
    await page.screenshot({ path: 'dist/preview-booth.png', fullPage: true });

    // Round 1: Click shutter and wait for Round 2
    await expect(shutterBtn).toBeEnabled();
    await shutterBtn.click({ force: true });
    await expect(page.getByText(/round 2 of 3/i)).toBeVisible({ timeout: 20000 });

    // Round 2: Click shutter and wait for Round 3
    await expect(shutterBtn).toBeEnabled({ timeout: 10000 });
    await shutterBtn.click({ force: true });
    await expect(page.getByText(/round 3 of 3/i)).toBeVisible({ timeout: 20000 });

    // Round 3: Click shutter and wait for Review screen
    await expect(shutterBtn).toBeEnabled({ timeout: 10000 });
    await shutterBtn.click({ force: true });

    // 4. Review screen
    await expect(page.getByText(/review your shots/i)).toBeVisible({ timeout: 25000 });
    await page.screenshot({ path: 'dist/preview-review.png', fullPage: true });

    // Proceed to Customise / Editor
    const decorateBtn = page.getByRole('button', { name: /looks great/i });
    await expect(decorateBtn).toBeVisible();
    await decorateBtn.click({ force: true });

    // 5. Editor screen
    // Test selecting a photo booth frame / template
    await expect(page.getByText(/photo booth frames/i)).toBeVisible();
    const kittyFrame = page.getByRole('button', { name: /kitty stars/i });
    if (await kittyFrame.isVisible()) {
      await kittyFrame.click({ force: true });
    }

    // Switch to Stickers tab
    await page.getByRole('button', { name: /stickers/i }).click({ force: true });
    await expect(page.getByText(/stickers & original mascots/i)).toBeVisible();

    // Add Boba Bunny sticker
    const bobaSticker = page.getByTitle(/add boba bunny happy/i);
    if (await bobaSticker.isVisible()) {
      await bobaSticker.click({ force: true });
    }

    // Switch to Themes tab and select Lavender Mist
    await page.getByRole('button', { name: /theme/i }).click({ force: true });
    await page.getByText(/lavender mist/i).first().click({ force: true });

    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'dist/preview-editor.png', fullPage: true });

    // 6. Export screen
    const exportBtn = page.getByRole('button', { name: /export strip/i });
    await exportBtn.click({ force: true });

    await expect(page.getByText(/download your memory/i)).toBeVisible();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'dist/preview-export.png', fullPage: true });
  });

  test('opens remote booth invite flow and auto-joins via query parameter', async ({ page }) => {
    // Test URL query param ?room=TW-8899 auto-opens join modal
    await page.goto('/?room=TW-8899');
    await expect(page.getByText(/join a remote photo booth/i)).toBeVisible();
    const input = page.getByPlaceholder(/TW-8492/i);
    await expect(input).toHaveValue('TW-8899');
  });
});
