import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const signupSource = fs.readFileSync(path.join(websiteRoot, "script.js"), "utf8");
const portalSource = fs.readFileSync(path.join(websiteRoot, "portal/portal.js"), "utf8");
const portalHtml = fs.readFileSync(path.join(websiteRoot, "portal/index.html"), "utf8");
const signupHtml = fs.readFileSync(path.join(websiteRoot, "signup/index.html"), "utf8");
const indexHtml = fs.readFileSync(path.join(websiteRoot, "index.html"), "utf8");

function storage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    }
  };
}

function sourceSlice(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  assert.notEqual(start, -1, `Missing source marker: ${startMarker}`);
  assert.notEqual(end, -1, `Missing source marker: ${endMarker}`);
  return source.slice(start, end);
}

function signupHelpers({ search, stored = {} }) {
  const sessionStorage = storage(stored);
  let replacedUrl = null;
  const context = {
    URLSearchParams,
    sessionStorage,
    document: { title: "Sign Up | Tavra" },
    window: {
      location: { search, pathname: "/signup/" },
      history: { replaceState(_state, _title, url) { replacedUrl = url; } }
    }
  };
  const helpers = sourceSlice(
    signupSource,
    "function normalizePurchaseKind",
    "function syncSignupAppDownload"
  );
  vm.runInNewContext(
    `const purchaseCheckoutSessionStorageKey = "tavraPurchaseCheckoutSessionId";
     const purchaseKindStorageKey = "tavraPurchaseKind";
     const legacyPilotCheckoutSessionStorageKey = "tavraPilotCheckoutSessionId";
     ${helpers}
     globalThis.purchaseApi = { pendingSignupPurchase, purchaseProductName };`,
    context
  );
  return { api: context.purchaseApi, sessionStorage, replacedUrl: () => replacedUrl };
}

{
  const flow = signupHelpers({ search: "?purchase=core_evaluation&session_id=cs_core_123" });
  const purchase = flow.api.pendingSignupPurchase();
  assert.equal(purchase.sessionId, "cs_core_123");
  assert.equal(purchase.kind, "core_evaluation");
  assert.equal(flow.api.purchaseProductName(purchase.kind), "Tavra Core");
  assert.equal(flow.sessionStorage.getItem("tavraPurchaseCheckoutSessionId"), "cs_core_123");
  assert.equal(flow.sessionStorage.getItem("tavraPurchaseKind"), "core_evaluation");
  assert.equal(flow.sessionStorage.getItem("tavraPilotCheckoutSessionId"), null);
  assert.equal(flow.replacedUrl(), "/signup/");
}

{
  const flow = signupHelpers({ search: "?purchase=core_evaluation&session_id=cs_kind_mismatch" });
  const clientPurchase = flow.api.pendingSignupPurchase();
  assert.equal(clientPurchase.kind, "core_evaluation");
  assert.equal(
    flow.api.purchaseProductName("pilot"),
    "Tavra Pilot",
    "A server-returned Pilot kind must override a mismatched Core URL for success copy"
  );
  assert.equal(
    flow.api.purchaseProductName(""),
    "",
    "Missing server product authority must not silently fall back to Pilot"
  );
}

{
  const flow = signupHelpers({ search: "?pilot_checkout=success&session_id=cs_pilot_123" });
  const purchase = flow.api.pendingSignupPurchase();
  assert.equal(purchase.sessionId, "cs_pilot_123");
  assert.equal(purchase.kind, "pilot");
  assert.equal(flow.sessionStorage.getItem("tavraPilotCheckoutSessionId"), "cs_pilot_123");
}

{
  const flow = signupHelpers({
    search: "",
    stored: { tavraPilotCheckoutSessionId: "cs_legacy_pilot" }
  });
  const purchase = flow.api.pendingSignupPurchase();
  assert.equal(purchase.sessionId, "cs_legacy_pilot");
  assert.equal(purchase.kind, "pilot");
  assert.equal(flow.sessionStorage.getItem("tavraPurchaseCheckoutSessionId"), "cs_legacy_pilot");
}

function portalHelpers({ search, stored = {}, hash = "" }) {
  const sessionStorage = storage(stored);
  let replacedUrl = null;
  const context = {
    URLSearchParams,
    sessionStorage,
    document: { title: "Tavra Portal" },
    window: {
      location: { search, pathname: "/portal/", hash },
      history: { replaceState(_state, _title, url) { replacedUrl = url; } }
    }
  };
  const helpers = sourceSlice(
    portalSource,
    "function normalizePendingPurchaseKind",
    "function adminOnboardingModulesStorageKey"
  );
  vm.runInNewContext(
    `const pendingPurchaseSessionKey = "tavraPurchaseCheckoutSessionId";
     const pendingPurchaseKindKey = "tavraPurchaseKind";
     const legacyPilotPurchaseSessionKey = "tavraPilotCheckoutSessionId";
     ${helpers}
     globalThis.purchaseApi = { capturePurchaseReturn, pendingPurchase, pendingPurchaseProductName };`,
    context
  );
  return { api: context.purchaseApi, sessionStorage, replacedUrl: () => replacedUrl };
}

{
  const flow = portalHelpers({
    search: "?purchase=core_evaluation&session_id=cs_core_portal&section=operations",
    hash: "#team"
  });
  flow.api.capturePurchaseReturn();
  const purchase = flow.api.pendingPurchase();
  assert.equal(purchase.sessionId, "cs_core_portal");
  assert.equal(purchase.kind, "core_evaluation");
  assert.equal(flow.replacedUrl(), "/portal/?section=operations#team");
}

{
  const flow = portalHelpers({
    search: "",
    stored: {
      tavraPurchaseCheckoutSessionId: "cs_kind_mismatch",
      tavraPurchaseKind: "core_evaluation"
    }
  });
  const clientPurchase = flow.api.pendingPurchase();
  assert.equal(clientPurchase.kind, "core_evaluation");
  assert.equal(
    flow.api.pendingPurchaseProductName("pilot"),
    "Tavra Pilot",
    "Portal success copy must use the server-returned kind instead of the stored client kind"
  );
  assert.equal(
    flow.api.pendingPurchaseProductName(""),
    "",
    "Portal success copy must fail closed when the server omits product authority"
  );
}

{
  let statusUpdate = null;
  const context = {
    URLSearchParams,
    contactStatus: {},
    setContactStatus(message, state) {
      statusUpdate = { message, state };
    },
    window: { location: { search: "?core_evaluation_checkout=cancel" } }
  };
  const helper = sourceSlice(
    signupSource,
    "function showCheckoutReturnStatus",
    "demoPhoneInput?.addEventListener"
  );
  vm.runInNewContext(`${helper}\nshowCheckoutReturnStatus();`, context);
  assert.deepEqual(statusUpdate, {
    message: "Tavra Core checkout was canceled. Your demo request is unchanged.",
    state: "neutral"
  });
}

const publicContactForm = sourceSlice(
  indexHtml,
  '<form class="contact-form" data-contact-form>',
  "</form>"
);
const publicContactPayload = sourceSlice(
  signupSource,
  "function contactPayload",
  "async function postContactEndpoint"
);
assert.doesNotMatch(publicContactForm, /name=["']stripeEmail["']/i);
assert.doesNotMatch(publicContactForm, /Stripe Email/i);
assert.doesNotMatch(publicContactPayload, /stripeEmail/i);
assert.match(indexHtml, /<h2 id="pricing-title">Tavra pricing shaped around your restaurant<\/h2>/);
assert.doesNotMatch(indexHtml, /<h2 id="pricing-title">[^<]*Pilot/i);
assert.doesNotMatch(indexHtml, /aria-label="Pilot benefits"/i);
assert.match(indexHtml, /<script src="script\.js\?v=core-evaluation-return-v1" defer><\/script>/);

assert.match(signupHtml, /name="purchaseCheckoutSessionId"[^>]+data-signup-purchase-session/);
assert.match(signupSource, /purchaseCheckoutSessionId,/);
assert.match(signupSource, /pilotCheckoutSessionId: createBusiness && purchaseKind === "pilot"/);
assert.match(signupSource, /Tavra Core purchase return — \$399\/month/);
assert.match(signupSource, /Tavra will verify the returned Checkout before applying regular Tavra Core/);
assert.doesNotMatch(signupSource, /Tavra Core checkout complete/);
const signupSubmitSource = sourceSlice(signupSource, "async function submitSignupForm", "async function submitContactForm");
assert.match(signupSubmitSource, /const fulfilledPurchaseKind = normalizePurchaseKind\(body\?\.purchaseKind\);/);
assert.doesNotMatch(signupSubmitSource, /purchaseProductName\(signupForm\.dataset\.purchaseKind\)/);
assert.match(portalSource, /purchaseCheckoutSessionId: purchase\.sessionId/);
assert.match(portalSource, /purchase\.kind === "pilot" \? \{ pilotCheckoutSessionId: purchase\.sessionId \}/);
assert.match(portalSource, /This return indicates Tavra Core at \$399\/month/);
assert.match(portalSource, /Tavra will verify the Checkout before applying it/);
assert.match(portalSource, /Verify and apply this paid Tavra purchase return to \$\{businessName\}/);
assert.doesNotMatch(portalSource, /Apply your paid \$\{productName\}/);
assert.match(portalSource, /different active Tavra subscription/);
assert.match(portalSource, /purchase_claim_exact_owner_required/);
assert.match(portalSource, /core_evaluation_claim_exact_business_owner_required/);
assert.match(portalSource, /A General Manager cannot claim it/);
const portalClaimSource = sourceSlice(portalSource, "async function claimPendingPurchase", "async function refreshMembership");
assert.match(portalClaimSource, /portalState\.membership\?\.role !== "owner" && portalState\.membership\?\.role !== "gm"/);
assert.doesNotMatch(portalClaimSource, /purchase\.kind === "core_evaluation" && portalState\.membership/);
assert.doesNotMatch(portalClaimSource, /pendingPurchaseProductName\(purchase\.kind\)/);
assert.doesNotMatch(portalClaimSource, /\$\{productName\}|\$\{productDetail\}/);
assert.match(portalClaimSource, /const claimedKind = normalizePendingPurchaseKind\(payload\?\.purchaseKind\);/);
assert.doesNotMatch(portalClaimSource, /normalizePendingPurchaseKind\(payload\?\.purchaseKind\) \|\| purchase\.kind/);
assert.match(portalHtml, /portal\.js\?v=20260718-core-evaluation-exact-owner-v2/);

console.log("Website purchase callback regression passed.");
