const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const headerActions = document.querySelector(".header-actions");
const navLinks = Array.from(document.querySelectorAll(".site-nav a, .site-footer a[href^='#']"));
const callButton = document.querySelector("[data-call-modal]");
const modal = document.querySelector("[data-modal]");
const modalDialog = modal?.querySelector(".call-modal");
const modalClose = document.querySelector("[data-modal-close]");
const demoCallForm = document.querySelector("[data-demo-call-form]");
const demoPhoneInput = document.querySelector("[data-demo-phone]");
const demoHoneypot = document.querySelector("[data-demo-honeypot]");
const demoCallSubmit = document.querySelector("[data-demo-call-submit]");
const demoCallStatus = document.querySelector("[data-demo-call-status]");
const voiceSelect = document.querySelector("#voice-select");
const voicePicker = document.querySelector("[data-voice-picker]");
const voiceTrigger = document.querySelector("[data-voice-trigger]");
const voiceMenu = document.querySelector("[data-voice-menu]");
const voiceSearch = document.querySelector("[data-voice-search]");
const voiceFilterButtons = Array.from(document.querySelectorAll("[data-voice-filter]"));
const voiceList = document.querySelector("[data-voice-list]");
const selectedVoiceName = document.querySelector("[data-selected-voice]");
const selectedVoiceDetail = document.querySelector("[data-selected-voice-detail]");
const voicePreviewPopover = document.querySelector("[data-voice-preview]");
const previewName = document.querySelector("[data-preview-name]");
const previewGender = document.querySelector("[data-preview-gender]");
const previewTranscript = document.querySelector("[data-preview-transcript]");
const previewMeter = document.querySelector("[data-preview-meter]");
const locationInput = document.querySelector("#location-name");
const greetingTextarea = document.querySelector("#ai-greeting");
const greetingHighlight = document.querySelector("[data-greeting-highlight]");
const workflowToggles = Array.from(document.querySelectorAll("[data-workflow-toggle]"));
const sessionToggles = Array.from(document.querySelectorAll("[data-session-toggle]"));
const consolePreview = document.querySelector("[data-console-preview]");
const previewStatus = document.querySelector("[data-preview-status]");
const previewRows = document.querySelector("[data-preview-rows]");
const previewNoteTitle = document.querySelector("[data-preview-note-title]");
const previewNote = document.querySelector("[data-preview-note]");
const demoMenuCard = document.querySelector("[data-demo-menu-card]");
const demoMenuList = document.querySelector("[data-demo-menu-list]");
const demoMenuRefresh = document.querySelector("[data-menu-refresh]");
const demoMenuExpand = document.querySelector("[data-menu-expand]");
const liveWorkflowPanel = document.querySelector("[data-live-workflow-panel]");
const callProgress = document.querySelector("[data-call-progress]");
const configModules = document.querySelector("[data-config-modules]");
const configReservationsEnabled = document.querySelector("[data-config-reservations-enabled]");
const configReservationStatus = document.querySelector("[data-config-reservation-status]");
const configMinParty = document.querySelector("[data-config-min-party]");
const configMaxParty = document.querySelector("[data-config-max-party]");
const configQuestionsList = document.querySelector("[data-config-questions-list]");
const configHandoffList = document.querySelector("[data-config-handoff-list]");
const configKitchenEnabled = document.querySelector("[data-config-kitchen-enabled]");
const configKitchenTargets = document.querySelector("[data-config-kitchen-targets]");
const configReservationsSummary = document.querySelector("[data-config-reservations-summary]");
const configQuestionsSummary = document.querySelector("[data-config-questions-summary]");
const configHandoffSummary = document.querySelector("[data-config-handoff-summary]");
const configKitchenSummary = document.querySelector("[data-config-kitchen-summary]");

const productionDemoApiHost = String.fromCharCode(
  111, 98, 115, 99, 117, 114, 101, 45, 116, 97, 105, 103, 97, 45, 57, 52, 50, 50, 52, 45, 98, 54, 48,
  57, 99, 56, 100, 99, 56, 99, 100, 52, 46, 104, 101, 114, 111, 107, 117, 97, 112, 112, 46, 99, 111, 109
);
const demoApiBaseUrl = ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ? "http://127.0.0.1:8787"
  : `https://${productionDemoApiHost}`;

let syncedLocationName = locationInput?.value.trim() || "your restaurant";
let lastSyncedGreeting = greetingTextarea?.value || greetingTemplate(syncedLocationName);
let voiceRecords = [];
let voiceLoadState = "idle";
let voiceLoadPromise = null;
let activeVoiceFilter = "all";
let activePreviewVoiceId = null;
let activePreviewSessionId = 0;
let previewAudio = null;
let previewRevealTimer = null;
let previewStopTimer = null;
let previewRequest = null;
let lastVoicePreviewPointerType = "";
let demoMenuRecords = [];
let demoMenuLoadState = "idle";
let demoMenuExpanded = false;
let demoConfig = null;
let demoConfigLoadState = "idle";
let demoConfigLoadPromise = null;
let activeWorkflow = "orders";
let activeDemoCall = null;
let activeDemoState = null;
let demoStatePollTimer = null;
const previewAudioUrls = new Map();

const workflowPreviewContent = {
  orders: {
    status: "Ordering workflow",
    rows: [
      ["Workflow", "To-go order"],
      ["Payment", "Configured checkout"],
      ["Output", "Kitchen ticket"]
    ],
    title: "Demo menu",
    note:
      "Use the configured demo menu below when you place the call. Tavra will handle menu questions, modifiers, order readback, checkout simulation, and the submitted order record."
  },
  addedInfo: {
    status: "Custom answers",
    rows: [
      ["Questions", "Hours, events, parking"],
      ["Sources", "Configured demo info"],
      ["Output", "Specific answers"]
    ],
    title: "Try asking",
    note:
      "Ask about hours, directions, wait times, private events, gift cards, jobs, live music, or other configured business questions."
  },
  reservations: {
    status: "Reservation workflow",
    rows: [
      ["Workflow", "Native Tavra Book"],
      ["Rules", "Demo account settings"],
      ["Output", "Reservation record"]
    ],
    title: "Reservation mode",
    note:
      "Tavra uses the demo restaurant's reservation rules for this call. You can ask for a table, change time details, or test special requests."
  }
};

function setMobileNav(open) {
  if (!navToggle || !nav || !headerActions) return;
  nav.classList.toggle("open", open);
  headerActions.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
}

function closeModal() {
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  setDemoCallStatus("");
  callButton?.focus();
}

function openModal() {
  if (!modal || !modalDialog) return;
  ensureVoiceOptionsLoaded();
  ensureDemoConfigLoaded().catch(() => ensureDemoMenuLoaded());
  modal.hidden = false;
  document.body.classList.add("modal-open");
  window.setTimeout(() => demoPhoneInput?.focus() || modalDialog.focus(), 0);
}

function setDemoCallStatus(message, state = "neutral") {
  if (!demoCallStatus) return;
  demoCallStatus.textContent = message;
  demoCallStatus.dataset.state = state;
}

function escapeHTML(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function reservationsEnabledForGreeting() {
  const workflowEnabled = workflowToggles.some((toggle) => toggle.dataset.workflow === "reservations" && toggle.checked);
  const nativeBookEnabled = sessionToggles.some((toggle) => toggle.dataset.sessionToggle === "nativeBook" && toggle.checked);
  const configEnabled = configReservationsEnabled ? configReservationsEnabled.checked : true;
  return workflowEnabled && nativeBookEnabled && configEnabled;
}

function greetingTemplate(locationName) {
  const prompt = reservationsEnabledForGreeting()
    ? "Would you like to place a to-go order, make a reservation, or something else?"
    : "Would you like to place a to-go order, or something else?";
  return `Thank you for calling ${locationName}. ${prompt}`;
}

function renderGreetingHighlight() {
  if (!greetingTextarea || !greetingHighlight) return;

  const greeting = greetingTextarea.value;
  const locationName = locationInput?.value.trim() || "";

  if (locationName.length < 2) {
    greetingHighlight.textContent = greeting;
    return;
  }

  const match = greeting.match(new RegExp(escapeRegExp(locationName), "i"));

  if (!match || typeof match.index !== "number") {
    greetingHighlight.textContent = greeting;
    return;
  }

  const start = match.index;
  const end = start + match[0].length;
  const html = [
    escapeHTML(greeting.slice(0, start)),
    `<mark>${escapeHTML(match[0])}</mark>`,
    escapeHTML(greeting.slice(end))
  ].join("");
  greetingHighlight.innerHTML = html;
}

function enabledWorkflowKeys() {
  return workflowToggles.filter((toggle) => toggle.checked).map((toggle) => toggle.dataset.workflow).filter(Boolean);
}

function workflowConfigPayload() {
  return {
    orders: workflowToggles.some((toggle) => toggle.dataset.workflow === "orders" && toggle.checked),
    addedInfo: workflowToggles.some((toggle) => toggle.dataset.workflow === "addedInfo" && toggle.checked),
    reservations: workflowToggles.some((toggle) => toggle.dataset.workflow === "reservations" && toggle.checked)
  };
}

function demoTogglePayload() {
  return sessionToggles.reduce((payload, toggle) => {
    const key = toggle.dataset.sessionToggle;
    if (key) {
      payload[key] = toggle.checked;
    }
    return payload;
  }, {});
}

function numberFromInput(input, fallback) {
  const value = Number(input?.value);
  return Number.isFinite(value) ? value : fallback;
}

function configSourceLabel(sourceType, sourceConfigured) {
  const labels = {
    manual: "Manual",
    website_url: "Website URL",
    ical_feed: "iCal feed",
    google_calendar: "Calendar",
    uploaded_file: "Uploaded file",
    pos: "POS"
  };
  const label = labels[sourceType] || "Configured info";
  return sourceConfigured ? `${label} source` : label;
}

function configHandlingLabel(mode) {
  const labels = {
    answer_only: "Answer only",
    answer_then_route_if_needed: "Answer, then route",
    collect_message: "Take a note",
    route_immediately: "Route immediately"
  };
  return labels[mode] || "Configured handling";
}

function fallbackSessionConfig() {
  return {
    reservations: {
      reservationsEnabled: true,
      reservationMode: "native_tavra",
      fallbackBehavior: "collect_request",
      defaultReservationStatus: "ai_decides",
      minPartySize: 1,
      maxPartySize: 12
    },
    otherQuestions: [],
    handoffRoutes: [],
    kitchenPrinting: {
      enabled: true,
      targets: []
    }
  };
}

function activeSessionConfig() {
  return demoConfig?.sessionConfig || fallbackSessionConfig();
}

function defaultEnabledKitchenPrinting(kitchenPrinting) {
  const base = kitchenPrinting || { enabled: true, targets: [] };
  return {
    ...base,
    enabled: true,
    targets: Array.isArray(base.targets)
      ? base.targets.map((target) => ({ ...target, enabled: true }))
      : []
  };
}

function renderQuestionConfig(categories) {
  if (!configQuestionsList) return;

  if (!categories.length) {
    configQuestionsList.innerHTML = `<p class="config-empty">No custom answer categories are configured yet.</p>`;
    return;
  }

  configQuestionsList.replaceChildren(
    ...categories.map((category) => {
      const row = document.createElement("article");
      row.className = "config-row";
      row.dataset.questionKey = category.categoryKey;
      row.dataset.sourceType = category.sourceType || "manual";
      row.dataset.routingTargetType = category.routingTargetType || "none";

      const toggle = document.createElement("label");
      toggle.className = "config-check";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = category.enabled !== false;
      input.dataset.questionEnabled = category.categoryKey;
      const copy = document.createElement("span");
      const title = document.createElement("strong");
      const meta = document.createElement("small");
      title.textContent = category.displayName || category.categoryKey;
      meta.textContent = `${configSourceLabel(category.sourceType, category.sourceConfigured)} · ${configHandlingLabel(category.handlingMode)}`;
      copy.append(title, meta);
      toggle.append(input, copy);

      const select = document.createElement("select");
      select.dataset.questionMode = category.categoryKey;
      [
        ["answer_only", "Answer"],
        ["answer_then_route_if_needed", "Answer + route"],
        ["collect_message", "Take note"],
        ["route_immediately", "Route"]
      ].forEach(([value, label]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        select.append(option);
      });
      select.value = category.handlingMode || "answer_only";

      row.append(toggle, select);
      return row;
    })
  );
}

function renderHandoffConfig(routes) {
  if (!configHandoffList) return;

  if (!routes.length) {
    configHandoffList.innerHTML = `<p class="config-empty">No live handoff routes are configured yet.</p>`;
    return;
  }

  configHandoffList.replaceChildren(
    ...routes.map((route) => {
      const row = document.createElement("article");
      row.className = "config-row";
      row.dataset.handoffId = route.id;

      const toggle = document.createElement("label");
      toggle.className = "config-check";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = route.enabled !== false;
      input.dataset.handoffEnabled = route.id;
      const copy = document.createElement("span");
      const title = document.createElement("strong");
      const meta = document.createElement("small");
      title.textContent = route.label || "Handoff route";
      meta.textContent = route.description || "Configured transfer route";
      copy.append(title, meta);
      toggle.append(input, copy);

      const policy = document.createElement("select");
      policy.dataset.handoffPolicy = route.id;
      [
        ["all_matches", "All matches"],
        ["urgent_only", "Urgent only"],
        ["voicemail_only", "Message only"]
      ].forEach(([value, label]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        policy.append(option);
      });
      policy.value = route.liveTransferPolicy || "all_matches";

      row.append(toggle, policy);
      return row;
    })
  );
}

function renderKitchenConfig(kitchenPrinting) {
  if (configKitchenEnabled) {
    configKitchenEnabled.checked = kitchenPrinting.enabled !== false;
  }

  if (!configKitchenTargets) return;
  const targets = Array.isArray(kitchenPrinting.targets) ? kitchenPrinting.targets : [];
  if (!targets.length) {
    configKitchenTargets.innerHTML = `<p class="config-empty">No kitchen targets are configured yet.</p>`;
    return;
  }

  configKitchenTargets.replaceChildren(
    ...targets.map((target) => {
      const row = document.createElement("article");
      row.className = "config-row compact";
      row.dataset.kitchenTargetId = target.id;

      const toggle = document.createElement("label");
      toggle.className = "config-check";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = target.enabled !== false;
      input.dataset.kitchenTarget = target.id;
      const copy = document.createElement("span");
      const title = document.createElement("strong");
      const meta = document.createElement("small");
      title.textContent = target.label || "Kitchen target";
      meta.textContent = target.description || "Submitted order output";
      copy.append(title, meta);
      toggle.append(input, copy);
      row.append(toggle);
      return row;
    })
  );
}

function applyDemoConfigPayload(payload) {
  demoConfig = payload && typeof payload === "object" ? payload : null;
  const sessionConfig = activeSessionConfig();

  if (configReservationsEnabled) {
    configReservationsEnabled.checked = sessionConfig.reservations.reservationsEnabled !== false;
  }
  if (configReservationStatus) {
    configReservationStatus.value = sessionConfig.reservations.defaultReservationStatus || "requested";
  }
  if (configMinParty) {
    configMinParty.value = sessionConfig.reservations.minPartySize ?? 1;
  }
  if (configMaxParty) {
    configMaxParty.value = sessionConfig.reservations.maxPartySize ?? 12;
  }

  renderQuestionConfig(Array.isArray(sessionConfig.otherQuestions) ? sessionConfig.otherQuestions : []);
  renderHandoffConfig(Array.isArray(sessionConfig.handoffRoutes) ? sessionConfig.handoffRoutes : []);
  renderKitchenConfig(defaultEnabledKitchenPrinting(sessionConfig.kitchenPrinting));

  if (Array.isArray(payload?.menuItems)) {
    demoMenuRecords = payload.menuItems
      .filter((item) => item && typeof item.name === "string" && item.name.trim())
      .map((item) => ({
        name: item.name.trim(),
        category: typeof item.category === "string" && item.category.trim() ? item.category.trim() : null,
        priceCents: typeof item.priceCents === "number" ? item.priceCents : null,
        description: typeof item.description === "string" && item.description.trim() ? item.description.trim() : null
      }));
    demoMenuLoadState = demoMenuRecords.length > 0 ? "ready" : "error";
  }

  syncGreetingToLocation();
  renderConfigSummaries();
  renderWorkflowPreview();
}

function renderConfigSummaries() {
  const config = collectSessionConfigPayload();
  const enabledQuestions = config.otherQuestions.filter((category) => category.enabled).length;
  const enabledRoutes = config.handoffRoutes.filter((route) => route.enabled).length;
  const enabledTargets = config.kitchenPrinting.targets.filter((target) => target.enabled).length;

  if (configReservationsSummary) {
    configReservationsSummary.textContent = config.reservations.reservationsEnabled
      ? `${config.reservations.minPartySize}-${config.reservations.maxPartySize} guests`
      : "Off this call";
  }
  if (configQuestionsSummary) {
    configQuestionsSummary.textContent = enabledQuestions ? `${enabledQuestions} enabled` : "Off this call";
  }
  if (configHandoffSummary) {
    configHandoffSummary.textContent = enabledRoutes ? `${enabledRoutes} routes` : "No transfers";
  }
  if (configKitchenSummary) {
    configKitchenSummary.textContent = config.kitchenPrinting.enabled
      ? `${enabledTargets || "Default"} target${enabledTargets === 1 ? "" : "s"}`
      : "Off this call";
  }
}

function collectSessionConfigPayload() {
  const base = activeSessionConfig();

  return {
    reservations: {
      ...base.reservations,
      reservationsEnabled: configReservationsEnabled ? configReservationsEnabled.checked : base.reservations.reservationsEnabled,
      defaultReservationStatus: configReservationStatus?.value || base.reservations.defaultReservationStatus || "requested",
      minPartySize: numberFromInput(configMinParty, base.reservations.minPartySize ?? 1),
      maxPartySize: numberFromInput(configMaxParty, base.reservations.maxPartySize ?? 12)
    },
    otherQuestions: Array.from(document.querySelectorAll("[data-question-key]")).map((row) => {
      const categoryKey = row.dataset.questionKey;
      const baseCategory = base.otherQuestions.find((category) => category.categoryKey === categoryKey) || {};
      return {
        ...baseCategory,
        categoryKey,
        enabled: row.querySelector("[data-question-enabled]")?.checked !== false,
        handlingMode: row.querySelector("[data-question-mode]")?.value || baseCategory.handlingMode || "answer_only",
        sourceType: row.dataset.sourceType || baseCategory.sourceType || "manual",
        routingTargetType: row.dataset.routingTargetType || baseCategory.routingTargetType || "none"
      };
    }),
    handoffRoutes: Array.from(document.querySelectorAll("[data-handoff-id]")).map((row) => {
      const id = row.dataset.handoffId;
      const baseRoute = base.handoffRoutes.find((route) => route.id === id) || {};
      return {
        ...baseRoute,
        id,
        enabled: row.querySelector("[data-handoff-enabled]")?.checked !== false,
        liveTransferPolicy: row.querySelector("[data-handoff-policy]")?.value || baseRoute.liveTransferPolicy || "all_matches"
      };
    }),
    kitchenPrinting: {
      ...base.kitchenPrinting,
      enabled: configKitchenEnabled ? configKitchenEnabled.checked : base.kitchenPrinting.enabled,
      targets: Array.from(document.querySelectorAll("[data-kitchen-target-id]")).map((row) => {
        const id = row.dataset.kitchenTargetId;
        const baseTarget = base.kitchenPrinting.targets?.find((target) => target.id === id) || {};
        return {
          ...baseTarget,
          id,
          enabled: row.querySelector("[data-kitchen-target]")?.checked !== false
        };
      })
    }
  };
}

async function ensureDemoConfigLoaded() {
  if (demoConfigLoadState === "ready") {
    return demoConfig;
  }

  if (demoConfigLoadPromise) {
    return demoConfigLoadPromise;
  }

  demoConfigLoadState = "loading";
  demoConfigLoadPromise = fetch(`${demoApiBaseUrl}/demo/config`, { method: "GET" })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Demo config request failed with ${response.status}`);
      }
      const payload = await response.json();
      demoConfigLoadState = "ready";
      applyDemoConfigPayload(payload);
      return payload;
    })
    .catch((error) => {
      demoConfigLoadState = "error";
      if (configQuestionsList) {
        configQuestionsList.innerHTML = `<p class="config-empty">Demo configuration is unavailable. You can still use the default setup.</p>`;
      }
      throw error;
    })
    .finally(() => {
      demoConfigLoadPromise = null;
    });

  return demoConfigLoadPromise;
}

function setPreviewRows(rows) {
  if (!previewRows) return;

  previewRows.replaceChildren(
    ...rows.map(([label, value]) => {
      const item = document.createElement("li");
      const strong = document.createElement("strong");
      const span = document.createElement("span");
      strong.textContent = label;
      span.textContent = value;
      item.append(strong, span);
      return item;
    })
  );
}

function terminalDemoStatus(status) {
  return ["completed", "busy", "failed", "no-answer", "canceled"].includes(status);
}

function formatCents(cents) {
  return typeof cents === "number" && Number.isFinite(cents) ? `$${(cents / 100).toFixed(2)}` : "Open";
}

function formatReservationDate(value) {
  if (!value) return "Waiting";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

function formatReservationTime(value) {
  if (!value) return "Waiting";
  const [hourRaw, minuteRaw] = value.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return value;
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(date);
}

function renderStateRows(rows) {
  return rows
    .map(
      ([label, value]) => `
        <li>
          <strong>${escapeHTML(label)}</strong>
          <span>${escapeHTML(value || "Waiting")}</span>
        </li>
      `
    )
    .join("");
}

function renderTranscriptTail(state) {
  const tail = Array.isArray(state?.transcriptTail) ? state.transcriptTail.slice(-4) : [];
  if (!tail.length) return "";
  return `
    <div class="live-transcript">
      ${tail
        .map(
          (entry) => `
            <p>
              <span>${entry.role === "assistant" ? "Tavra" : "Caller"}</span>
              ${escapeHTML(entry.text || "")}
            </p>
          `
        )
        .join("")}
    </div>
  `;
}

function renderOrderLivePanel(state) {
  const order = state?.order || {};
  const items = Array.isArray(order.items) ? order.items : [];
  const suggestions = Array.isArray(state?.menuSuggestions) && state.menuSuggestions.length ? state.menuSuggestions : demoMenuRecords.slice(0, 8);

  return `
    <div class="live-panel-top">
      <p class="note-title">To-go order</p>
      <span>${escapeHTML(state?.statusText || "Building the order.")}</span>
    </div>
    <div class="live-order-grid">
      <div>
        <strong>Menu suggestions</strong>
        <div class="live-menu-suggestions">
          ${suggestions
            .slice(0, 6)
            .map((item) => `<span>${escapeHTML(item.name)} <small>${escapeHTML(formatCents(item.priceCents))}</small></span>`)
            .join("") || "<em>Menu loading</em>"}
        </div>
      </div>
      <div>
        <strong>Current order</strong>
        <ul class="live-state-list">
          ${
            items.length
              ? items.map((item) => `<li><strong>${item.quantity || 1}x</strong><span>${escapeHTML(item.displayName || item.name)}</span></li>`).join("")
              : "<li><strong>Items</strong><span>Waiting for caller</span></li>"
          }
          <li><strong>Checkout</strong><span>${order.paymentPending ? "Ready" : order.submitted ? "Approved" : "Not yet"}</span></li>
          <li><strong>Total</strong><span>${escapeHTML(formatCents(order.subtotalCents))}</span></li>
        </ul>
      </div>
    </div>
    ${renderTranscriptTail(state)}
  `;
}

function renderReservationLivePanel(state) {
  const reservation = state?.reservation || {};
  return `
    <div class="live-panel-top">
      <p class="note-title">Reservation card</p>
      <span>${escapeHTML(state?.statusText || "Collecting details.")}</span>
    </div>
    <ul class="live-state-list reservation-card">
      ${renderStateRows([
        ["Party", reservation.partySize ? `${reservation.partySize} guests` : "Waiting"],
        ["Date", formatReservationDate(reservation.requestedDateIso)],
        ["Time", formatReservationTime(reservation.requestedTime)],
        ["Guest", reservation.guestName || "Waiting"],
        ["Phone", reservation.callerPhoneNumber ? "Captured" : "Waiting"],
        ["Notes", reservation.notes || "None yet"],
        ["Status", reservation.submitted ? reservation.status || "Submitted" : "In progress"]
      ])}
    </ul>
    ${renderTranscriptTail(state)}
  `;
}

function renderOtherQuestionLivePanel(state) {
  const question = state?.otherQuestion || {};
  return `
    <div class="live-panel-top">
      <p class="note-title">Custom answer</p>
      <span>${escapeHTML(state?.statusText || "Answering the caller.")}</span>
    </div>
    <ul class="live-state-list">
      ${renderStateRows([
        ["Category", question.displayName || "Detecting"],
        ["Source", configSourceLabel(question.sourceType || "manual", true)],
        ["Handled", question.handled ? "Answer given" : "In progress"]
      ])}
    </ul>
    ${renderTranscriptTail(state)}
  `;
}

function renderHandoffLivePanel(state) {
  const handoff = state?.handoff || {};
  return `
    <div class="live-panel-top">
      <p class="note-title">Live handoff</p>
      <span>${escapeHTML(state?.statusText || "Routing the call.")}</span>
    </div>
    <ul class="live-state-list">
      ${renderStateRows([
        ["Route", handoff.routeLabel || "Configured route"],
        ["Status", handoff.status || "Requested"],
        ["Caller said", state?.lastCallerText || "Waiting"]
      ])}
    </ul>
    ${renderTranscriptTail(state)}
  `;
}

function renderWaitingLivePanel(state) {
  return `
    <div class="live-waiting">
      <div class="live-pulse" aria-hidden="true"></div>
      <p class="note-title">${terminalDemoStatus(activeDemoCall?.status) ? "Call ended" : "Listening"}</p>
      <p>${escapeHTML(state?.statusText || "Waiting for the caller's first answer.")}</p>
    </div>
    ${renderTranscriptTail(state || {})}
  `;
}

function renderLiveWorkflowPanel() {
  if (!liveWorkflowPanel) return;

  if (!activeDemoCall) {
    liveWorkflowPanel.hidden = true;
    liveWorkflowPanel.innerHTML = "";
    return;
  }

  const state = activeDemoState || {
    activeWorkflow: "waiting",
    statusText: "Waiting for the caller's first answer.",
    transcriptTail: []
  };

  const workflow = state.activeWorkflow || "waiting";
  liveWorkflowPanel.hidden = false;
  liveWorkflowPanel.dataset.workflow = workflow;

  if (workflow === "order") {
    liveWorkflowPanel.innerHTML = renderOrderLivePanel(state);
  } else if (workflow === "reservation") {
    liveWorkflowPanel.innerHTML = renderReservationLivePanel(state);
  } else if (workflow === "other_question") {
    liveWorkflowPanel.innerHTML = renderOtherQuestionLivePanel(state);
  } else if (workflow === "handoff") {
    liveWorkflowPanel.innerHTML = renderHandoffLivePanel(state);
  } else {
    liveWorkflowPanel.innerHTML = renderWaitingLivePanel(state);
  }

  window.requestAnimationFrame(() => {
    const transcript = liveWorkflowPanel.querySelector(".live-transcript");
    if (transcript) {
      transcript.scrollTop = transcript.scrollHeight;
    }
  });
}

function renderWorkflowPreview() {
  const enabledKeys = enabledWorkflowKeys();
  if (!enabledKeys.includes(activeWorkflow)) {
    activeWorkflow = enabledKeys[0] || "orders";
  }

  const content = workflowPreviewContent[activeWorkflow] || workflowPreviewContent.orders;
  consolePreview?.setAttribute("data-active-workflow", activeWorkflow);
  consolePreview?.classList.toggle("is-active-call", Boolean(activeDemoCall));
  if (previewStatus) {
    previewStatus.textContent = activeDemoCall ? activeDemoState?.statusText || "Call active" : content.status;
  }
  setPreviewRows(
    activeDemoCall
      ? [
          ["Status", activeDemoState?.activeWorkflow ? workflowLabel(activeDemoState.activeWorkflow) : "Listening"],
          ["Session", activeDemoCall.sessionId ? activeDemoCall.sessionId.slice(0, 8) : "Requested"],
          ["Call", activeDemoCall.status || "Requested"]
        ]
      : content.rows
  );
  if (previewNoteTitle) previewNoteTitle.textContent = activeDemoCall ? "Live console" : content.title;
  if (previewNote) {
    previewNote.textContent = activeDemoCall
      ? "The call has been placed. The workflow panel updates as the caller moves through ordering, reservations, custom answers, or handoff."
      : content.note;
  }
  if (demoMenuCard) {
    demoMenuCard.hidden = Boolean(activeDemoCall);
  }
  if (callProgress) {
    callProgress.hidden = true;
  }
  renderLiveWorkflowPanel();
  renderDemoMenu();
}

function workflowLabel(key) {
  if (key === "other_question") return "Custom answer";
  if (key === "handoff") return "Handoff";
  if (key === "waiting") return "Listening";
  if (key === "idle") return "Ready";
  if (key === "addedInfo") return "Added info";
  return key ? `${key.charAt(0).toUpperCase()}${key.slice(1)}` : "";
}

function formatPrice(cents) {
  return typeof cents === "number" && Number.isFinite(cents) ? `$${(cents / 100).toFixed(2)}` : "";
}

function menuRecordSubtitle(item) {
  const parts = [item.category, formatPrice(item.priceCents)].filter(Boolean);
  return parts.join(" · ") || "Configured menu item";
}

function renderDemoMenu() {
  if (!demoMenuList) return;

  if (activeWorkflow !== "orders") {
    demoMenuList.innerHTML = "";
    const helper = document.createElement("div");
    helper.className = "demo-menu-helper";
    if (activeWorkflow === "addedInfo") {
      helper.innerHTML = `
        <strong>Custom answer categories</strong>
        <span>Hours · Directions · Wait times · Allergies · Large parties · Private events · Catering · Gift cards · Loyalty · Lost and found · Complaints · Jobs · Events</span>
      `;
    } else {
      helper.innerHTML = `
        <strong>Reservation test prompts</strong>
        <span>Try: "I need a table for four tonight" or "Can I make a reservation for tomorrow at 7?"</span>
      `;
    }
    demoMenuList.append(helper);
    if (demoMenuExpand) demoMenuExpand.hidden = true;
    return;
  }

  if (demoMenuLoadState === "idle") {
    demoMenuList.innerHTML = `<p class="demo-menu-empty">Open the demo or tap Load menu to see configured items.</p>`;
    if (demoMenuExpand) demoMenuExpand.hidden = true;
    return;
  }

  if (demoMenuLoadState === "loading") {
    demoMenuList.innerHTML = `<p class="demo-menu-empty">Loading configured demo menu...</p>`;
    if (demoMenuExpand) demoMenuExpand.hidden = true;
    return;
  }

  if (demoMenuLoadState === "error") {
    demoMenuList.innerHTML = `<p class="demo-menu-empty">Menu preview unavailable. You can still place a demo call.</p>`;
    if (demoMenuExpand) demoMenuExpand.hidden = true;
    return;
  }

  const visibleItems = demoMenuRecords.slice(0, demoMenuExpanded ? 18 : 6);
  demoMenuList.replaceChildren(
    ...visibleItems.map((item) => {
      const row = document.createElement("article");
      const name = document.createElement("strong");
      const meta = document.createElement("span");
      name.textContent = item.name;
      meta.textContent = menuRecordSubtitle(item);
      row.append(name, meta);
      return row;
    })
  );

  if (demoMenuExpand) {
    demoMenuExpand.hidden = demoMenuRecords.length <= 6;
    demoMenuExpand.textContent = demoMenuExpanded ? "Show fewer items" : `View ${Math.min(18, demoMenuRecords.length)} menu items`;
  }
}

async function ensureDemoMenuLoaded() {
  if (demoMenuLoadState === "ready" || demoMenuLoadState === "loading") return;

  if (demoConfigLoadState !== "ready") {
    try {
      await ensureDemoConfigLoaded();
      return;
    } catch {
      // Fall through to the narrower menu endpoint if the full config is unavailable.
    }
  }

  demoMenuLoadState = "loading";
  renderDemoMenu();

  try {
    const response = await fetch(`${demoApiBaseUrl}/demo/menu`, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Demo menu request failed with ${response.status}`);
    }
    const payload = await response.json();
    const items = Array.isArray(payload.items) ? payload.items : [];
    demoMenuRecords = items
      .filter((item) => item && typeof item.name === "string" && item.name.trim())
      .map((item) => ({
        name: item.name.trim(),
        category: typeof item.category === "string" && item.category.trim() ? item.category.trim() : null,
        priceCents: typeof item.priceCents === "number" ? item.priceCents : null
      }));
    demoMenuLoadState = demoMenuRecords.length > 0 ? "ready" : "error";
  } catch {
    demoMenuLoadState = "error";
  }

  renderDemoMenu();
}

function syncGreetingToLocation() {
  if (!locationInput || !greetingTextarea) return;

  const nextLocationName = locationInput.value.trim() || "your restaurant";
  greetingTextarea.value = greetingTemplate(nextLocationName);
  syncedLocationName = nextLocationName;
  lastSyncedGreeting = greetingTextarea.value;
  renderGreetingHighlight();
}

function voiceLabel(record) {
  const description = typeof record.description === "string" ? record.description.trim() : "";
  const friendlyName = typeof record.friendlyName === "string" ? record.friendlyName.trim() : "";
  return description ? `${friendlyName} - ${description}` : friendlyName;
}

function voiceDetail(record) {
  const description = typeof record.description === "string" ? record.description.trim() : "";
  const gender = typeof record.gender === "string" ? record.gender.trim().toLowerCase() : "";
  const genderLabel = gender === "male" || gender === "female" ? gender : "";
  return [description, genderLabel].filter(Boolean).join(" · ");
}

function buildVoiceOption(record) {
  const option = document.createElement("option");
  const voiceId = typeof record.voiceId === "string" ? record.voiceId.trim() : "";
  const friendlyName = typeof record.friendlyName === "string" ? record.friendlyName.trim() : voiceId;

  option.value = voiceId;
  option.textContent = friendlyName || voiceId;
  option.dataset.voiceId = voiceId;
  option.dataset.voiceLabel = voiceLabel({ ...record, friendlyName }) || voiceId;

  if (record.objectId) {
    option.dataset.objectId = record.objectId;
  }

  if (record.gender) {
    option.dataset.gender = record.gender;
  }

  return option;
}

async function fetchTavraVoices() {
  const response = await fetch(`${demoApiBaseUrl}/demo/voices`, { method: "GET" });

  if (!response.ok) {
    throw new Error(`Voice catalog request failed with ${response.status}`);
  }

  const payload = await response.json();
  const results = Array.isArray(payload.voices) ? payload.voices : [];

  return results
    .filter((record) => typeof record.friendlyName === "string" && record.friendlyName.trim())
    .filter((record) => typeof record.voiceId === "string" && record.voiceId.trim())
    .map((record) => ({
      ...record,
      gender: typeof record.gender === "string" ? record.gender.trim().toLowerCase() : null,
      previewAudioUrl: typeof record.previewAudioUrl === "string" && record.previewAudioUrl.trim()
        ? record.previewAudioUrl.trim()
        : null,
      previewScript: typeof record.previewScript === "string" && record.previewScript.trim()
        ? record.previewScript.trim()
        : null
    }));
}

async function populateVoiceSelect() {
  if (!voiceSelect) return;

  voiceLoadState = "loading";
  voiceSelect.disabled = true;
  setVoicePlaceholder("Loading voice options...");
  setSelectedVoiceSummary(null);
  renderVoiceMenu();

  try {
    const voices = await fetchTavraVoices();

    if (voices.length === 0) {
      throw new Error("No online Tavra voices were returned.");
    }

    voiceRecords = voices;
    voiceSelect.replaceChildren(...voices.map(buildVoiceOption));
    const fiona = voices.find((record) => record.friendlyName.trim().toLowerCase() === "fiona");
    voiceSelect.value = fiona?.voiceId || voices[0]?.voiceId || "";
    voiceSelect.disabled = false;
    voiceLoadState = "ready";
    renderVoiceMenu();
    setSelectedVoiceSummary(selectedVoiceRecord());
  } catch {
    const option = document.createElement("option");
    option.textContent = "Voice options unavailable";
    option.value = "";

    voiceSelect.replaceChildren(option);
    voiceSelect.disabled = true;
    voiceLoadState = "error";
    voiceRecords = [];
    setSelectedVoiceSummary(null);
    renderVoiceMenu();
  }
}

function setVoicePlaceholder(text) {
  if (!voiceSelect) return;
  const option = document.createElement("option");
  option.textContent = text;
  option.value = "";
  voiceSelect.replaceChildren(option);
}

function ensureVoiceOptionsLoaded() {
  if (voiceLoadState === "ready") {
    return Promise.resolve(voiceRecords);
  }

  if (voiceLoadPromise) {
    return voiceLoadPromise;
  }

  voiceLoadPromise = populateVoiceSelect().finally(() => {
    voiceLoadPromise = null;
  });

  return voiceLoadPromise;
}

function selectedVoiceRecord() {
  if (!voiceSelect?.value) return null;
  return voiceRecords.find((record) => record.voiceId === voiceSelect.value) || null;
}

function setSelectedVoiceSummary(record) {
  if (!selectedVoiceName || !selectedVoiceDetail) return;

  if (!record) {
    if (voiceLoadState === "idle") {
      selectedVoiceName.textContent = "Choose a voice";
      selectedVoiceDetail.textContent = "Voice options load when you open the menu";
    } else if (voiceLoadState === "loading") {
      selectedVoiceName.textContent = "Loading voices...";
      selectedVoiceDetail.textContent = "Preparing voice menu";
    } else {
      selectedVoiceName.textContent = "Voice options unavailable";
      selectedVoiceDetail.textContent = "Try again shortly";
    }
    return;
  }

  selectedVoiceName.textContent = record.friendlyName;
  selectedVoiceDetail.textContent = voiceDetail(record) || "Restaurant-ready voice";
}

function setVoiceMenuOpen(open) {
  if (!voiceMenu || !voiceTrigger) return;
  voiceMenu.hidden = !open;
  voiceTrigger.setAttribute("aria-expanded", String(open));

  if (open) {
    window.setTimeout(() => voiceSearch?.focus(), 0);
  } else {
    stopVoicePreview();
  }
}

function filteredVoiceRecords() {
  const query = voiceSearch?.value.trim().toLowerCase() || "";

  return voiceRecords.filter((record) => {
    const gender = typeof record.gender === "string" ? record.gender.toLowerCase() : "";
    const matchesGender = activeVoiceFilter === "all" || gender === activeVoiceFilter;
    const searchable = `${record.friendlyName} ${record.description || ""}`.toLowerCase();
    const matchesQuery = !query || searchable.includes(query);
    return matchesGender && matchesQuery;
  });
}

function renderVoiceMenu() {
  if (!voiceList) return;

  voiceFilterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.voiceFilter === activeVoiceFilter);
  });

  const records = filteredVoiceRecords();
  voiceList.replaceChildren();

  if (records.length === 0) {
    const empty = document.createElement("p");
    empty.className = "voice-empty";
    empty.textContent = voiceLoadState === "idle" ? "Open the menu to load voice options." : "No voices match that filter.";
    voiceList.append(empty);
    return;
  }

  records.forEach((record) => {
    const row = document.createElement("div");
    row.className = "voice-option";
    row.setAttribute("role", "option");
    row.setAttribute("tabindex", "0");
    row.setAttribute("aria-selected", String(record.voiceId === voiceSelect?.value));
    row.dataset.voiceId = record.voiceId;

    const radio = document.createElement("span");
    radio.className = "voice-radio";
    radio.setAttribute("aria-hidden", "true");

    const copy = document.createElement("span");
    copy.className = "voice-copy";

    const name = document.createElement("strong");
    name.textContent = record.friendlyName;

    const detail = document.createElement("small");
    detail.textContent = voiceDetail(record) || "Restaurant-ready voice";

    copy.append(name, detail);

    const gender = document.createElement("span");
    gender.className = "voice-gender";
    gender.textContent = record.gender === "female" ? "♀" : record.gender === "male" ? "♂" : "•";
    gender.title = record.gender || "Voice";

    const preview = document.createElement("button");
    preview.type = "button";
    preview.className = "voice-preview-button";
    preview.setAttribute("aria-label", `Preview ${record.friendlyName}`);
    preview.dataset.previewVoice = record.voiceId;
    preview.innerHTML = `<span aria-hidden="true">▶</span>`;
    preview.addEventListener("pointerdown", (event) => {
      lastVoicePreviewPointerType = event.pointerType || "";
    });
    preview.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") startVoicePreview(record, preview);
    });
    preview.addEventListener("focus", () => {
      if (lastVoicePreviewPointerType !== "touch") startVoicePreview(record, preview);
    });
    preview.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "mouse") scheduleVoicePreviewStop();
    });
    preview.addEventListener("blur", scheduleVoicePreviewStop);
    preview.addEventListener("click", (event) => {
      event.stopPropagation();
      const isTouchTap = lastVoicePreviewPointerType === "touch"
        || window.matchMedia("(hover: none)").matches;
      const isCurrentVoice = activePreviewVoiceId === record.voiceId;

      if (isCurrentVoice && !isTouchTap) {
        stopVoicePreview();
      } else {
        startVoicePreview(record, preview);
      }
    });

    row.addEventListener("click", () => {
      if (!voiceSelect) return;
      voiceSelect.value = record.voiceId;
      setSelectedVoiceSummary(record);
      renderVoiceMenu();
      setVoiceMenuOpen(false);
    });
    row.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      row.click();
    });

    row.append(radio, copy, gender, preview);
    voiceList.append(row);
  });
}

function previewText() {
  const text = greetingTextarea?.value.trim() || "";
  return text || greetingTemplate(locationInput?.value.trim() || "Torch & Table");
}

function previewTranscriptText(record) {
  return record?.previewScript || previewText();
}

function setPreviewTranscript(text, ratio) {
  if (!previewTranscript || !previewMeter) return;

  const clamped = Math.max(0, Math.min(1, ratio));
  const visibleLength = Math.max(1, Math.ceil(text.length * clamped));
  previewTranscript.textContent = text.slice(0, visibleLength);
  previewMeter.style.width = `${Math.round(clamped * 100)}%`;
}

function isAbortLikeError(error) {
  return error?.name === "AbortError" || error instanceof DOMException && error.name === "AbortError";
}

function isActivePreviewSession(sessionId, voiceId) {
  return sessionId === activePreviewSessionId && activePreviewVoiceId === voiceId;
}

function stopVoicePreview() {
  clearVoicePreviewStopTimer();
  activePreviewSessionId += 1;

  if (previewRequest) {
    previewRequest.abort();
    previewRequest = null;
  }

  if (previewAudio) {
    previewAudio.pause();
    previewAudio.currentTime = 0;
    previewAudio = null;
  }

  if (previewRevealTimer) {
    window.clearInterval(previewRevealTimer);
    previewRevealTimer = null;
  }

  activePreviewVoiceId = null;
  document.querySelectorAll(".voice-preview-button.is-playing").forEach((button) => {
    button.classList.remove("is-playing");
    button.innerHTML = `<span aria-hidden="true">▶</span>`;
  });

  if (voicePreviewPopover) {
    voicePreviewPopover.hidden = true;
  }
}

function clearVoicePreviewStopTimer() {
  if (!previewStopTimer) return;
  window.clearTimeout(previewStopTimer);
  previewStopTimer = null;
}

function scheduleVoicePreviewStop() {
  clearVoicePreviewStopTimer();
  previewStopTimer = window.setTimeout(stopVoicePreview, 260);
}

async function fetchGeneratedPreviewUrl(record, text, sessionId) {
  const request = new AbortController();
  previewRequest = request;
  const response = await fetch(`${demoApiBaseUrl}/demo/voice/previews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      voiceId: record.voiceId,
      text
    }),
    signal: request.signal
  });
  if (previewRequest === request) {
    previewRequest = null;
  }

  if (!isActivePreviewSession(sessionId, record.voiceId)) {
    throw new DOMException("Stale voice preview request.", "AbortError");
  }

  if (!response.ok) {
    throw new Error(`Voice preview failed with ${response.status}`);
  }

  return URL.createObjectURL(await response.blob());
}

function playPreviewAudio(audioUrl, sessionId, voiceId) {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl);
    const cleanup = () => {
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("error", onError);
    };
    const rejectStale = () => {
      cleanup();
      audio.pause();
      reject(new DOMException("Stale voice preview playback.", "AbortError"));
    };
    const onCanPlay = async () => {
      cleanup();
      if (!isActivePreviewSession(sessionId, voiceId)) {
        rejectStale();
        return;
      }

      if (previewAudio && previewAudio !== audio) {
        previewAudio.pause();
        previewAudio.currentTime = 0;
      }

      previewAudio = audio;
      previewAudio.addEventListener("ended", () => {
        if (isActivePreviewSession(sessionId, voiceId)) stopVoicePreview();
      }, { once: true });
      try {
        await previewAudio.play();
        if (!isActivePreviewSession(sessionId, voiceId)) {
          rejectStale();
          return;
        }
        resolve(previewAudio);
      } catch (error) {
        reject(error);
      }
    };
    const onError = () => {
      cleanup();
      reject(new Error("Stored voice preview failed to load."));
    };

    audio.addEventListener("canplay", onCanPlay, { once: true });
    audio.addEventListener("error", onError, { once: true });
    audio.preload = "auto";
    audio.load();
  });
}

async function startVoicePreview(record, button) {
  if (!record?.voiceId) return;
  clearVoicePreviewStopTimer();
  if (activePreviewVoiceId === record.voiceId) {
    button.classList.add("is-playing");
    button.innerHTML = `<span aria-hidden="true">Ⅱ</span>`;
    if (voicePreviewPopover) voicePreviewPopover.hidden = false;
    return;
  }

  stopVoicePreview();
  const sessionId = ++activePreviewSessionId;
  activePreviewVoiceId = record.voiceId;
  button.classList.add("is-playing");
  button.innerHTML = `<span aria-hidden="true">Ⅱ</span>`;

  const fallbackText = previewText();
  const text = previewTranscriptText(record);
  if (previewName) previewName.textContent = record.friendlyName;
  if (previewGender) previewGender.textContent = record.gender || "";
  if (voicePreviewPopover) voicePreviewPopover.hidden = false;
  setPreviewTranscript(text, 0.08);

  try {
    const generatedCacheKey = `${record.voiceId}|${fallbackText}`;
    const candidateUrls = [];

    if (record.previewAudioUrl) {
      candidateUrls.push(record.previewAudioUrl);
    }

    let generatedUrl = previewAudioUrls.get(generatedCacheKey);
    if (generatedUrl) {
      candidateUrls.push(generatedUrl);
    }

    let playbackStarted = false;
    for (const audioUrl of candidateUrls) {
      try {
        await playPreviewAudio(audioUrl, sessionId, record.voiceId);
        if (!isActivePreviewSession(sessionId, record.voiceId)) return;
        playbackStarted = true;
        break;
      } catch (error) {
        if (isAbortLikeError(error) || !isActivePreviewSession(sessionId, record.voiceId)) {
          return;
        }

        if (previewAudio) {
          previewAudio.pause();
          previewAudio = null;
        }
      }
    }

    if (!playbackStarted) {
      generatedUrl = await fetchGeneratedPreviewUrl(record, fallbackText, sessionId);
      previewAudioUrls.set(generatedCacheKey, generatedUrl);
      await playPreviewAudio(generatedUrl, sessionId, record.voiceId);
    }

    if (!isActivePreviewSession(sessionId, record.voiceId)) return;
    previewRevealTimer = window.setInterval(() => {
      if (!previewAudio || !isActivePreviewSession(sessionId, record.voiceId)) return;
      const duration = Number.isFinite(previewAudio.duration) && previewAudio.duration > 0 ? previewAudio.duration : 4.5;
      setPreviewTranscript(text, previewAudio.currentTime / duration);
    }, 90);
  } catch (error) {
    if (isAbortLikeError(error) || !isActivePreviewSession(sessionId, record.voiceId)) {
      return;
    }

    if (!isAbortLikeError(error)) {
      if (previewTranscript) {
        previewTranscript.textContent = "Preview unavailable. Try another voice.";
      }
    }
    stopVoicePreview();
  }
}

setVoicePlaceholder("Voice options load on interaction");
setSelectedVoiceSummary(null);
renderVoiceMenu();
syncGreetingToLocation();
renderGreetingHighlight();
renderConfigSummaries();
renderWorkflowPreview();

function phoneDigits(value) {
  return value.replace(/\D/g, "");
}

function nationalPhoneDigits(value) {
  let digits = phoneDigits(value);
  const trimmedValue = value.trim();

  if ((trimmedValue.startsWith("+1") || digits.length > 10) && digits.startsWith("1")) {
    digits = digits.slice(1);
  }

  return digits;
}

function formatUSPhone(value) {
  const digits = nationalPhoneDigits(value).slice(0, 10);
  const area = digits.slice(0, 3);
  const prefix = digits.slice(3, 6);
  const line = digits.slice(6, 10);

  if (!digits) return "";
  if (digits.length <= 3) return `+1 (${area}`;
  if (digits.length <= 6) return `+1 (${area}) ${prefix}`;
  return `+1 (${area}) ${prefix}-${line}`;
}

function phoneToE164(value) {
  const digits = nationalPhoneDigits(value);
  return digits.length === 10 ? `+1${digits}` : null;
}

function selectedVoicePayload() {
  if (!voiceSelect || !voiceSelect.value) {
    return { voiceId: null, voiceLabel: null };
  }

  const selected = voiceSelect.selectedOptions[0];

  return {
    voiceId: voiceSelect.value,
    voiceLabel: selected?.dataset.voiceLabel?.trim() || selected?.textContent?.trim() || null
  };
}

function stopDemoStatePolling() {
  if (!demoStatePollTimer) return;
  window.clearTimeout(demoStatePollTimer);
  demoStatePollTimer = null;
}

function scheduleDemoStatePoll(sessionId, delay = 1400) {
  stopDemoStatePolling();
  demoStatePollTimer = window.setTimeout(() => {
    void pollDemoCallState(sessionId);
  }, delay);
}

async function pollDemoCallState(sessionId) {
  if (!sessionId || !activeDemoCall || activeDemoCall.sessionId !== sessionId) {
    return;
  }

  try {
    const response = await fetch(`${demoApiBaseUrl}/demo/calls/${encodeURIComponent(sessionId)}/state`, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Demo state request failed with ${response.status}`);
    }
    const payload = await response.json();
    if (!activeDemoCall || activeDemoCall.sessionId !== sessionId) {
      return;
    }
    activeDemoCall.status = typeof payload.status === "string" ? payload.status : activeDemoCall.status;
    activeDemoState = payload.uiState && typeof payload.uiState === "object" ? payload.uiState : activeDemoState;
    renderWorkflowPreview();

    if (!terminalDemoStatus(activeDemoCall.status)) {
      scheduleDemoStatePoll(sessionId, activeDemoState?.activeWorkflow === "waiting" ? 1200 : 1800);
    }
  } catch {
    if (activeDemoCall?.sessionId === sessionId && !terminalDemoStatus(activeDemoCall.status)) {
      scheduleDemoStatePoll(sessionId, 3500);
    }
  }
}

async function submitDemoCall(event) {
  event.preventDefault();

  if (!demoPhoneInput || !locationInput || !greetingTextarea) return;

  if (demoHoneypot?.value.trim()) {
    return;
  }

  const phoneNumber = phoneToE164(demoPhoneInput.value);
  const businessName = locationInput.value.trim();

  if (!phoneNumber) {
    setDemoCallStatus("Enter a complete phone number.", "error");
    return;
  }

  if (!businessName) {
    setDemoCallStatus("Add the restaurant name first.", "error");
    return;
  }

  demoCallSubmit?.setAttribute("disabled", "true");
  setDemoCallStatus("Preparing the demo call...", "loading");
  await ensureVoiceOptionsLoaded();
  try {
    await ensureDemoConfigLoaded();
  } catch {
    await ensureDemoMenuLoaded();
  }
  const voice = selectedVoicePayload();
  const workflowConfig = workflowConfigPayload();
  const demoToggles = demoTogglePayload();
  const sessionConfig = collectSessionConfigPayload();

  setDemoCallStatus("Placing the demo call...", "loading");

  try {
    const response = await fetch(`${demoApiBaseUrl}/demo/voice/calls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber,
        businessName,
        voiceId: voice.voiceId,
        voiceLabel: voice.voiceLabel,
        workflowConfig,
        demoToggles,
        sessionConfig
      })
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.error || `Demo call request failed with ${response.status}`);
    }

    activeDemoCall = {
      sessionId: typeof payload.sessionId === "string" ? payload.sessionId : null,
      callSid: typeof payload.callSid === "string" ? payload.callSid : null,
      status: typeof payload.status === "string" ? payload.status : "requested",
      workflowConfig
    };
    activeDemoState = {
      activeWorkflow: "waiting",
      statusText: "Waiting for the caller's first answer.",
      transcriptTail: []
    };
    renderWorkflowPreview();
    setDemoCallStatus("Call requested. Your phone should ring shortly.", "success");
    closeModal();
    if (activeDemoCall.sessionId) {
      scheduleDemoStatePoll(activeDemoCall.sessionId, 900);
    }
  } catch {
    setDemoCallStatus("The demo call could not be placed. Try again shortly.", "error");
  } finally {
    demoCallSubmit?.removeAttribute("disabled");
  }
}

demoPhoneInput?.addEventListener("input", () => {
  demoPhoneInput.value = formatUSPhone(demoPhoneInput.value);
});
demoPhoneInput?.addEventListener("blur", () => {
  demoPhoneInput.value = formatUSPhone(demoPhoneInput.value);
});

voiceTrigger?.addEventListener("click", async () => {
  await ensureVoiceOptionsLoaded();
  setVoiceMenuOpen(Boolean(voiceMenu?.hidden));
});
voiceTrigger?.addEventListener("focus", ensureVoiceOptionsLoaded);
document.querySelectorAll("a[href='#demo'], [data-scroll-target='demo']").forEach((link) => {
  link.addEventListener("click", ensureVoiceOptionsLoaded);
  link.addEventListener("click", () => ensureDemoConfigLoaded().catch(() => ensureDemoMenuLoaded()));
});
voiceSearch?.addEventListener("input", renderVoiceMenu);
voiceFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeVoiceFilter = button.dataset.voiceFilter || "all";
    renderVoiceMenu();
  });
});
workflowToggles.forEach((toggle) => {
  toggle.addEventListener("change", () => {
    if (enabledWorkflowKeys().length === 0) {
      toggle.checked = true;
    }
    activeWorkflow = toggle.dataset.workflow || activeWorkflow;
    activeDemoCall = null;
    activeDemoState = null;
    stopDemoStatePolling();
    syncGreetingToLocation();
    renderConfigSummaries();
    renderWorkflowPreview();
    if (activeWorkflow === "orders") {
      ensureDemoMenuLoaded();
    }
  });
  toggle.addEventListener("focus", () => {
    activeWorkflow = toggle.dataset.workflow || activeWorkflow;
    renderWorkflowPreview();
  });
});
sessionToggles.forEach((toggle) => {
  toggle.addEventListener("change", () => {
    activeDemoCall = null;
    activeDemoState = null;
    stopDemoStatePolling();
    syncGreetingToLocation();
    renderConfigSummaries();
    renderWorkflowPreview();
  });
});
configModules?.addEventListener("change", () => {
  activeDemoCall = null;
  activeDemoState = null;
  stopDemoStatePolling();
  syncGreetingToLocation();
  renderConfigSummaries();
  renderWorkflowPreview();
});
demoMenuRefresh?.addEventListener("click", ensureDemoMenuLoaded);
demoMenuExpand?.addEventListener("click", () => {
  demoMenuExpanded = !demoMenuExpanded;
  renderDemoMenu();
});
voicePreviewPopover?.addEventListener("mouseenter", clearVoicePreviewStopTimer);
voicePreviewPopover?.addEventListener("mouseleave", scheduleVoicePreviewStop);
voicePreviewPopover?.addEventListener("focusin", clearVoicePreviewStopTimer);
voicePreviewPopover?.addEventListener("focusout", scheduleVoicePreviewStop);
locationInput?.addEventListener("input", syncGreetingToLocation);
greetingTextarea?.addEventListener("input", renderGreetingHighlight);
greetingTextarea?.addEventListener("scroll", () => {
  if (!greetingHighlight || !greetingTextarea) return;
  greetingHighlight.scrollTop = greetingTextarea.scrollTop;
  greetingHighlight.scrollLeft = greetingTextarea.scrollLeft;
});

if (navToggle) {
  navToggle.addEventListener("click", () => {
    setMobileNav(!nav?.classList.contains("open"));
  });
}

document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href")?.slice(1);
    const target = targetId ? document.getElementById(targetId) : null;

    if (!target) return;
    event.preventDefault();
    setMobileNav(false);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", `#${targetId}`);
  });
});

callButton?.addEventListener("click", openModal);
modalClose?.addEventListener("click", closeModal);
demoCallForm?.addEventListener("submit", submitDemoCall);

modal?.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal && !modal.hidden) {
    closeModal();
  }

  if (event.key === "Escape" && voiceMenu && !voiceMenu.hidden) {
    setVoiceMenuOpen(false);
    voiceTrigger?.focus();
  }
});

document.addEventListener("click", (event) => {
  if (
    voicePicker &&
    voiceMenu &&
    !voiceMenu.hidden &&
    event.target instanceof Node &&
    !voicePicker.contains(event.target)
  ) {
    setVoiceMenuOpen(false);
  }

  if (!nav || !navToggle || !headerActions || !nav.classList.contains("open")) return;
  if (event.target instanceof Node && (nav.contains(event.target) || navToggle.contains(event.target) || headerActions.contains(event.target))) return;
  setMobileNav(false);
});

const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && observedSections.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll(".site-nav a").forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    {
      rootMargin: "-34% 0px -58% 0px",
      threshold: 0
    }
  );

  observedSections.forEach((section) => observer.observe(section));
}

const loadDemoConfigOnIdle = () => {
  ensureDemoConfigLoaded().catch(() => ensureDemoMenuLoaded());
};

if ("requestIdleCallback" in window) {
  window.requestIdleCallback(loadDemoConfigOnIdle, { timeout: 1200 });
} else {
  window.setTimeout(loadDemoConfigOnIdle, 350);
}
