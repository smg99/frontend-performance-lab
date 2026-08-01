const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = '/Users/sumitg/.gemini/antigravity-ide/brain/88291a52-a991-4da2-b45f-ecaf2345509e';

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: ARTIFACTS_DIR,
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 800 },
    colorScheme: 'dark' // We want to showcase dark mode too ideally, or default
  });

  const page = await context.newPage();
  
  console.log('Navigating to homepage...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  console.log('Recording 15 seconds of Hero LiveAnalyzer animation...');
  await page.waitForTimeout(15000); // 15 seconds

  console.log('Taking full page desktop screenshot...');
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'desktop_homepage.png'), fullPage: true });

  console.log('Taking Hero close-up...');
  // The Hero section is roughly the first viewport, but let's take a regular screenshot
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'hero_closeup.png') });

  console.log('Opening command palette...');
  await page.keyboard.press('Meta+K');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'command_palette.png') });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  console.log('Switching to mobile viewport...');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile_homepage.png'), fullPage: true });

  console.log('Navigating to MCP Install page...');
  await page.goto('http://localhost:3000/mcp/install', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mcp_install.png'), fullPage: true });

  console.log('Closing browser to save video...');
  const videoPath = await page.video().path();
  await context.close();
  await browser.close();

  // Rename video to something readable
  const fs = require('fs');
  fs.renameSync(videoPath, path.join(ARTIFACTS_DIR, 'live_analyzer_recording.webm'));

  console.log('Done!');
})();
