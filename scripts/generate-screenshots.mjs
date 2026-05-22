/**
 * Screenshot generator for the hairdresser/barber demo site.
 *
 * Usage:
 *   node scripts/generate-screenshots.mjs [presets-file]
 *
 * Options (env vars):
 *   BASE_URL     — where the site is running  (default: http://localhost:5173)
 *   CONCURRENCY  — parallel browsers          (default: 3)
 *   OUT_DIR      — output root folder         (default: ./output)
 *
 * The presets file must be a .js or .mjs with a default export of an array:
 *   export default [ { name, type, location, phone, color, address }, ... ]
 *
 * For each preset an output/<slug>/ folder is created containing:
 *   desktop-hero.png, desktop-services.png, desktop-gallery.png,
 *   desktop-about.png, desktop-map.png, desktop-contact.png,
 *   desktop-full-page.png, desktop-modal.png,
 *   mobile-hero.png, mobile-services.png, mobile-gallery.png,
 *   mobile-nav-open.png, mobile-modal.png,
 *   link.txt
 */

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// ─── Config ────────────────────────────────────────────────────────────────
const BASE_URL    = process.env.BASE_URL   || 'http://localhost:5173';
const CONCURRENCY = parseInt(process.env.CONCURRENCY || '4', 10);
const OUT_DIR     = resolve(process.env.OUT_DIR || 'output');

// ─── Encoding (mirrors src/utils/params.js — no browser globals needed) ────
const LONG_KEYS = { name: 'n', type: 't', location: 'l', phone: 'p', color: 'c', address: 'a' };

function encodePreset(config) {
  const short = {};
  Object.entries(config).forEach(([k, v]) => {
    if (v != null && v !== '') short[LONG_KEYS[k] || k] = v;
  });
  return Buffer.from(JSON.stringify(short)).toString('base64');
}

function buildLink(config) {
  return `${BASE_URL}/?d=${encodePreset(config)}`;
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ─── Viewports ─────────────────────────────────────────────────────────────
const DESKTOP = { width: 1280, height: 900 };
const MOBILE  = { width: 390,  height: 844 };

// ─── Shot definitions ──────────────────────────────────────────────────────
// action: 'scroll'      → scroll element into view, wait for animation, screenshot
// action: 'fullPage'    → full-page scroll screenshot from top
// action: 'modal'       → click Book Now, screenshot open modal, close via Escape
// action: 'mobileNav'   → tap hamburger, screenshot open drawer
const SHOTS = [
  { file: 'desktop-hero',      viewport: DESKTOP, action: 'scroll',   selector: '#top',      waitMs: 700 },
  { file: 'desktop-services',  viewport: DESKTOP, action: 'scroll',   selector: '#services', waitMs: 900 },
  { file: 'desktop-gallery',   viewport: DESKTOP, action: 'scroll',   selector: '#gallery',  waitMs: 900 },
  { file: 'desktop-about',     viewport: DESKTOP, action: 'scroll',   selector: '#about',    waitMs: 900 },
  { file: 'desktop-map',       viewport: DESKTOP, action: 'scroll',   selector: '#location', waitMs: 700 },
  { file: 'desktop-contact',   viewport: DESKTOP, action: 'scroll',   selector: '#contact',  waitMs: 700 },
  { file: 'desktop-full-page', viewport: DESKTOP, action: 'fullPage', selector: '#top',      waitMs: 200 },
  { file: 'desktop-modal',     viewport: DESKTOP, action: 'modal' },
  { file: 'mobile-hero',       viewport: MOBILE,  action: 'scroll',   selector: '#top',      waitMs: 700 },
  { file: 'mobile-services',   viewport: MOBILE,  action: 'scroll',   selector: '#services', waitMs: 900 },
  { file: 'mobile-gallery',    viewport: MOBILE,  action: 'scroll',   selector: '#gallery',  waitMs: 800 },
  { file: 'mobile-nav-open',   viewport: MOBILE,  action: 'mobileNav' },
  { file: 'mobile-modal',      viewport: MOBILE,  action: 'modal' },
];

// ─── Per-preset screenshotter ───────────────────────────────────────────────
async function screenshotPreset(browser, preset, index, total) {
  const slug      = slugify(preset.name);
  const link      = buildLink(preset);
  const outFolder = resolve(OUT_DIR, slug);

  await mkdir(outFolder, { recursive: true });
  await writeFile(resolve(outFolder, 'link.txt'), link, 'utf8');

  const context = await browser.newContext();
  const page    = await context.newPage();

  // Navigate once at desktop size; we'll resize per shot
  await page.setViewportSize(DESKTOP);
  await page.goto(link, { waitUntil: 'networkidle', timeout: 20000 });
  // Give framer-motion entrance animations a moment to settle
  await page.waitForTimeout(800);

  for (const shot of SHOTS) {
    // Resize if needed (avoids full reload)
    const current = page.viewportSize();
    if (current.width !== shot.viewport.width || current.height !== shot.viewport.height) {
      await page.setViewportSize(shot.viewport);
      await page.waitForTimeout(300);
    }

    try {
      switch (shot.action) {
        case 'scroll': {
          const el = shot.selector === '#top'
            ? await page.$('body')
            : await page.$(shot.selector);
          if (el) await el.scrollIntoViewIfNeeded();
          else    await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(shot.waitMs);
          await page.screenshot({ path: resolve(outFolder, `${shot.file}.png`) });
          break;
        }

        case 'fullPage': {
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(shot.waitMs);
          await page.screenshot({ path: resolve(outFolder, `${shot.file}.png`), fullPage: true });
          break;
        }

        case 'modal': {
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(300);

          const isMobile = shot.viewport.width < 768;

          if (isMobile) {
            // On mobile the nav CTA is inside the hamburger drawer — open it first
            const hamburger = page.locator('[aria-label="Toggle menu"]').first();
            await hamburger.click();
            await page.waitForTimeout(350);
            const mobileBookBtn = page.locator('button', { hasText: /Book Now/i }).last();
            await mobileBookBtn.click({ timeout: 5000 });
          } else {
            const bookBtn = page.locator('nav button', { hasText: /Book Now/i }).first();
            await bookBtn.click({ timeout: 5000 });
          }

          await page.waitForTimeout(700);
          await page.screenshot({ path: resolve(outFolder, `${shot.file}.png`) });
          await page.keyboard.press('Escape');
          await page.waitForTimeout(400);
          break;
        }

        case 'mobileNav': {
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(300);
          const hamburger = page.locator('[aria-label="Toggle menu"]').first();
          await hamburger.click();
          await page.waitForTimeout(400);
          await page.screenshot({ path: resolve(outFolder, `${shot.file}.png`) });
          // Close menu
          await hamburger.click();
          await page.waitForTimeout(300);
          break;
        }
      }
    } catch (err) {
      console.warn(`  ⚠  ${slug} / ${shot.file}: ${err.message.split('\n')[0]}`);
    }
  }

  await context.close();
  console.log(`  ✓  [${index + 1}/${total}] ${preset.name}  →  output/${slug}/`);
}

// ─── Concurrency worker pool ────────────────────────────────────────────────
async function runWithConcurrency(tasks, concurrency, browser) {
  const total  = tasks.length;
  const queue  = tasks.map((preset, i) => ({ preset, i }));
  let   cursor = 0;

  async function worker() {
    while (cursor < queue.length) {
      const { preset, i } = queue[cursor++];
      await screenshotPreset(browser, preset, i, total);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, total) }, worker));
}

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
  // Resolve presets file
  const presetsArg  = process.argv[2];
  const presetsPath = presetsArg
    ? resolve(presetsArg)
    : resolve('scripts/presets.js');

  if (!existsSync(presetsPath)) {
    console.error(`\nPresets file not found: ${presetsPath}`);
    console.error('Create one (see scripts/presets.example.js) or pass a path as the first argument.\n');
    process.exit(1);
  }

  const { default: presets } = await import(pathToFileURL(presetsPath).href);

  if (!Array.isArray(presets) || presets.length === 0) {
    console.error('Presets file must export a non-empty array as default.');
    process.exit(1);
  }

  // Verify server is reachable
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch {
    console.error(`\nCannot reach ${BASE_URL}`);
    console.error('Run the server first:  npm run build && npm run preview\n');
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });

  console.log(`\nGenerating screenshots for ${presets.length} preset(s)`);
  console.log(`Server : ${BASE_URL}`);
  console.log(`Output : ${OUT_DIR}`);
  console.log(`Concurrency : ${CONCURRENCY}\n`);

  const browser = await chromium.launch({ headless: true });

  const started = Date.now();
  await runWithConcurrency(presets, CONCURRENCY, browser);
  await browser.close();

  const elapsed = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`\nDone — ${presets.length} preset(s) in ${elapsed}s  →  ${OUT_DIR}\n`);
}

main().catch((err) => {
  console.error('\nFatal:', err.message);
  process.exit(1);
});
