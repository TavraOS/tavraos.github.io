import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, script, styles] = await Promise.all([
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../script.js", import.meta.url), "utf8"),
  readFile(new URL("../styles.css", import.meta.url), "utf8")
]);

const capabilities = [
  "menuItems",
  "customAnswers",
  "eventsUrl",
  "hours",
  "reservationRules"
];

for (const capability of capabilities) {
  assert.match(
    html,
    new RegExp(`<input[^>]+checked[^>]+data-capability-toggle="${capability}"|<input[^>]+data-capability-toggle="${capability}"[^>]+checked`),
    `${capability} must render as a default-on checkbox`
  );
}
assert.doesNotMatch(
  html,
  /<div class="quick-buttons"[\s\S]*?<button/,
  "the capability controls must not regress to inert buttons"
);
assert.match(
  script,
  /function capabilityConfigPayload\(\)[\s\S]*capabilityToggles\.reduce/,
  "the website must serialize capability state"
);
assert.match(
  script,
  /body: JSON\.stringify\(\{[\s\S]*workflowConfig,[\s\S]*capabilityConfig,[\s\S]*demoToggles,[\s\S]*sessionConfig/,
  "the demo call request must include capability state"
);
assert.match(
  script,
  /capabilityToggles\.forEach\(\(toggle\) => \{[\s\S]*toggle\.addEventListener\("change"/,
  "each capability control must respond to changes"
);
assert.match(
  script,
  /reservationRulesEnabled[\s\S]*return workflowEnabled && reservationRulesEnabled && nativeBookEnabled && configEnabled/,
  "the reservation-rules capability must update the visible greeting"
);
assert.match(
  styles,
  /\.quick-buttons input:checked \+ span[\s\S]*background: var\(--green\)/,
  "enabled capabilities must render green"
);
assert.match(html, /styles\.css\?v=demo-capabilities-v1/);
assert.match(html, /script\.js\?v=demo-capabilities-v1/);

console.log("Website demo capability controls regression passed.");
