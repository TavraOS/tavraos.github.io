import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDirectory, "..");
const read = (relativePath) => readFile(path.join(root, relativePath), "utf8");

const [page, styles, launcher, home, sitemap] = await Promise.all([
  read("support/index.html"),
  read("support/support.css"),
  read("support/support.js"),
  read("index.html"),
  read("sitemap.xml"),
]);

const deepLink = "aiansweringservice://support/new?source=website";

assert.match(page, /<title>Tavra Support Center \| Open Tavra<\/title>/);
assert.match(page, /<meta name="description" content="[^"]+">/);
assert.match(page, /<h1[^>]*>[\s\S]*Support Center[\s\S]*<\/h1>/);
assert.match(page, /<link rel="canonical" href="https:\/\/www\.tavraos\.com\/support\/">/);
assert.match(page, /application\/ld\+json/);
assert.ok(page.includes(`href="${deepLink}"`), "The manual launch control must use the canonical deep link.");
assert.ok(launcher.includes(`const deepLink = "${deepLink}"`), "The automatic launcher must use the canonical deep link.");
assert.match(launcher, /window\.setTimeout\(launchTavra, 140\)/);
assert.match(launcher, /window\.location\.href = deepLink/);
assert.match(styles, /--orange:/);
assert.match(styles, /--green:/);
assert.match(home, /href="support\/">Support<\/a>/);
assert.match(sitemap, /<loc>https:\/\/www\.tavraos\.com\/support\/<\/loc>/);
assert.doesNotMatch(`${page}\n${launcher}`, /Hagerlabs|AutoRec/i);

console.log("Support launcher regression passed.");
