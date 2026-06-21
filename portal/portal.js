const loginScreen = document.querySelector("[data-login-screen]");
const portalApp = document.querySelector("[data-portal-app]");
const loginForm = document.querySelector("[data-login-form]");
const loginSubmit = document.querySelector("[data-login-submit]");
const loginStatus = document.querySelector("[data-login-status]");
const logoutButton = document.querySelector("[data-logout]");
const businessSummary = document.querySelector("[data-business-summary]");
const roleChip = document.querySelector("[data-role-chip]");
const pageTitle = document.querySelector("[data-page-title]");
const pageKicker = document.querySelector("[data-portal-kicker]");
const portalContent = document.querySelector("[data-portal-content]");
const sectionButtons = Array.from(document.querySelectorAll("[data-section]"));

const productionApiHost = String.fromCharCode(
  111, 98, 115, 99, 117, 114, 101, 45, 116, 97, 105, 103, 97, 45, 57, 52, 50, 50, 52, 45, 98, 54, 48,
  57, 99, 56, 100, 99, 56, 99, 100, 52, 46, 104, 101, 114, 111, 107, 117, 97, 112, 112, 46, 99, 111, 109
);
const apiBaseUrl = ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ? "http://127.0.0.1:8787"
  : `https://${productionApiHost}`;
const sessionKey = "tavra.portal.session.v1";
const adminOnboardingModulesStoragePrefix = "tavra.portal.adminOnboardingModules.v1";

const operationModules = [
  {
    key: "foodOrders",
    label: "Food Orders",
    icon: "🥤",
    status: "Order work",
    description:
      "Food Orders shows submitted and in-progress phone orders, payment status, kitchen output, and staff follow-up."
  },
  {
    key: "menu86",
    label: "86 Board",
    icon: "⚠",
    status: "Availability",
    description:
      "The 86 Board lets permitted team members mark unavailable ingredients or menu items and show the agent which items should not be sold."
  },
  {
    key: "callLogs",
    label: "Call Logs",
    icon: "☎",
    status: "Live transcripts",
    description:
      "Call Logs shows live and completed calls, transcripts, workflow outcomes, caller details, and the records Tavra created during the conversation."
  },
  {
    key: "voicemail",
    label: "Voicemail",
    icon: "〰",
    status: "Messages",
    description:
      "Voicemail will collect caller messages and related phone context when a restaurant chooses to route unanswered or after-hours calls into messages."
  },
  {
    key: "reservations",
    label: "Reservations",
    icon: "▦",
    status: "Book",
    description:
      "Reservations opens Tavra's native reservation book with timeline, calendar, add, check-in, no-show, and notes controls."
  },
  {
    key: "waitList",
    label: "Wait List",
    icon: "👥",
    status: "Queue",
    description:
      "Wait List will show current wait status, party context, and guest-facing timing details when that workflow is enabled for a restaurant."
  }
];

const foodOrderFilters = [
  {
    key: "active",
    title: "Active",
    emptyText: "Active food orders will appear here after Tavra takes them by phone.",
    className: "active"
  },
  {
    key: "needsAttention",
    title: "Needs Attention",
    emptyText: "No orders need attention right now.",
    className: "attention"
  },
  {
    key: "completed",
    title: "Completed",
    emptyText: "Completed orders will appear here.",
    className: "completed"
  },
  {
    key: "cancelled",
    title: "Cancelled",
    emptyText: "Cancelled orders will appear here.",
    className: "cancelled"
  }
];

const menu86Modes = [
  { key: "menuItem", title: "Menu Item", backendValue: "menu_item" },
  { key: "ingredient", title: "Ingredient", backendValue: "ingredient" }
];

const menu86DurationOptions = [
  { hours: 1, title: "1 hour" },
  { hours: 2, title: "2 hours" },
  { hours: 4, title: "4 hours" },
  { hours: 8, title: "8 hours" },
  { hours: 24, title: "Until tomorrow" },
  { hours: 0, title: "Until further notice" }
];

const adminOnlySections = new Set(["onboarding", "configure", "team"]);
const adminTimezoneOptions = ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"];
const adminBusinessHourTimeOptions = Array.from({ length: 48 }, (_, index) => {
  const minutes = index * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});
const portalWeekdayLabels = {
  sun: "Sunday",
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday"
};
const portalWeekdayOrder = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const reservationWeekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const posProviderLabels = {
  clover: "Clover",
  toast: "Toast",
  square: "Square"
};
const googleConversationRelayVoiceOptions = [
  {
    id: "google-journey-o",
    title: "Google Journey O",
    detail: "Default ConversationRelay voice for live calls.",
    provider: "Google",
    voice: "en-US-Journey-O"
  },
  {
    id: "google-chirp3-aoede",
    title: "Google Chirp3 Aoede",
    detail: "Female Google Chirp3-HD generative voice. Higher quality, but test for latency.",
    provider: "Google",
    voice: "en-US-Chirp3-HD-Aoede"
  },
  {
    id: "google-chirp3-kore",
    title: "Google Chirp3 Kore",
    detail: "Female Google Chirp3-HD generative voice. Higher quality, but test for latency.",
    provider: "Google",
    voice: "en-US-Chirp3-HD-Kore"
  }
];
const deepgramAuraPreviewOptions = [
  { id: "arcas", title: "Arcas", detail: "Natural, smooth American masculine voice. Good fit for customer service.", model: "aura-2-arcas-en" },
  { id: "orpheus", title: "Orpheus", detail: "Professional, trustworthy American masculine voice.", model: "aura-2-orpheus-en" },
  { id: "zeus", title: "Zeus", detail: "Deep, smooth American masculine voice for IVR-style use.", model: "aura-2-zeus-en" },
  { id: "pluto", title: "Pluto", detail: "Calm baritone American masculine voice.", model: "aura-2-pluto-en" },
  { id: "saturn", title: "Saturn", detail: "Confident baritone American masculine voice.", model: "aura-2-saturn-en" },
  { id: "apollo", title: "Apollo", detail: "Comfortable American masculine voice with a casual tone.", model: "aura-2-apollo-en" },
  { id: "thalia", title: "Thalia", detail: "Clear, energetic American feminine voice.", model: "aura-2-thalia-en" },
  { id: "helena", title: "Helena", detail: "Natural, friendly American feminine voice with a slightly raspy edge.", model: "aura-2-helena-en" }
];
const defaultSystemFallbacks = {
  localDeviceOfflineBehavior: "submit_to_pos_cloud",
  orderSubmissionFailureBehavior: "save_for_staff_followup",
  paymentFailureBehavior: "save_for_staff_followup",
  printerFailureBehavior: "track_separately",
  systemFallbackRouteId: "front_desk",
  notifyStaffOnSystemFallback: true,
  connectedSystemUnavailableMessage:
    "I have your order, but I can't send it through the restaurant system right now. The restaurant will confirm it shortly."
};

const waitListSourceModes = [
  { key: "automatic", title: "Automatic", subtitle: "Recommended: host quote, then reservation book" },
  { key: "host_override", title: "Host quote only", subtitle: "Most exact, but expires if staff do not update it" },
  { key: "reservation_book", title: "Reservation book", subtitle: "Uses Tavra reservations to infer pressure" },
  { key: "manual_only", title: "Manual text", subtitle: "Uses the configured category answer only" }
];

const waitListHostOptions = [
  { title: "No wait", state: "no_wait", minMinutes: 0, maxMinutes: 0 },
  { title: "5-10 min", state: "quoted", minMinutes: 5, maxMinutes: 10 },
  { title: "10-15 min", state: "quoted", minMinutes: 10, maxMinutes: 15 },
  { title: "15-20 min", state: "quoted", minMinutes: 15, maxMinutes: 20 },
  { title: "20-25 min", state: "quoted", minMinutes: 20, maxMinutes: 25 },
  { title: "25-30 min", state: "quoted", minMinutes: 25, maxMinutes: 30 },
  { title: "30-45 min", state: "quoted", minMinutes: 30, maxMinutes: 45 },
  { title: "45-60 min", state: "quoted", minMinutes: 45, maxMinutes: 60 },
  { title: "60+ min", state: "long_wait", minMinutes: 60, maxMinutes: null },
  { title: "No walk-ins", state: "not_accepting_walk_ins", minMinutes: null, maxMinutes: null }
];

const defaultReservationTimezone = "America/Chicago";
const defaultReservationSlotMinutes = 15;
const defaultReservationStartMinutes = 17 * 60;
const defaultReservationEndMinutes = 22 * 60;
const defaultReservationMaxCoversPerSlot = 24;
const defaultReservationMaxPartiesPerSlot = 6;
const defaultReservationMinPartySize = 1;
const defaultReservationMaxPartySize = 12;
const reservationActiveStatuses = new Set(["requested", "confirmed", "checked_in"]);
const reservationServiceDayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const reservationServiceLabels = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  service: "Service"
};

const sectionCopy = {
  onboarding: {
    title: "Onboarding",
    kicker: "Setup",
    body:
      "The web onboarding surface will guide restaurants through locations, phone setup, menu basics, voice selection, and first-call readiness.",
    bullets: ["Restaurant details", "Phone setup", "Menu readiness", "Launch checklist"]
  },
  configure: {
    title: "Configure",
    kicker: "Agent controls",
    body:
      "The web configure surface will expose restaurant-safe controls for workflows, answers, reservations, handoff routes, system fallbacks, and kitchen output.",
    bullets: ["Workflow settings", "Custom answers", "Handoff routes", "System fallback behavior"]
  },
  reservations: {
    title: "Reservations",
    kicker: "Native book",
    body:
      "The dedicated Reservations module will match Tavra's timeline-first reservation book, including status colors, capacity rows, time controls, and night overview.",
    bullets: ["Timeline view", "List view", "Table view", "Capacity overview"]
  },
  team: {
    title: "Team",
    kicker: "Access",
    body:
      "The Team module will manage members, roles, and read/write access for the operational modules each staff member is allowed to use.",
    bullets: ["Invite staff", "Set roles", "Assign module access", "Disable access"]
  },
  settings: {
    title: "Settings",
    kicker: "Account",
    body:
      "Settings will collect account-level preferences, location details, billing status, and profile-level controls.",
    bullets: ["Business profile", "Location settings", "Billing status", "Account preferences"]
  }
};

let portalState = {
  session: null,
  membership: null,
  business: null,
  adminSettings: null,
  adminTeamMembers: [],
  adminSettingsLoaded: false,
  adminSettingsLoading: false,
  adminSettingsError: "",
  adminProfileDraft: null,
  adminBusinessHoursDraft: null,
  adminMenuVisibilityDraft: null,
  adminMenuKnowledgeDraft: null,
  adminOnboardingOpenModules: {
    restaurantProfile: true,
    businessHours: true,
    menuKnowledge: false,
    status: true
  },
  adminMenuKnowledgeOpen: false,
  adminMenuOpenCategories: new Set(),
  adminMenuOpenItems: new Set(),
  adminSavingTarget: null,
  adminSaving: false,
  adminSaveMessage: "",
  adminSaveIsError: false,
  section: "operations",
  activeModule: "foodOrders",
  foodOrders: [],
  foodOrdersLoaded: false,
  foodOrdersLoading: false,
  foodOrdersError: "",
  foodOrderFilter: "active",
  expandedFoodOrderIds: new Set(),
  foodOrderUpdatingId: null,
  foodOrdersLiveQuery: {
    config: null,
    socket: null,
    requestId: 1,
    connecting: false,
    connected: false,
    reconnectTimer: null,
    refreshTimer: null,
    disabled: false
  },
  reservationsLiveQuery: {
    config: null,
    socket: null,
    requestId: 1,
    connecting: false,
    connected: false,
    reconnectTimer: null,
    refreshTimer: null,
    disabled: false
  },
  callLogsLiveQuery: {
    config: null,
    socket: null,
    requestId: 1,
    connecting: false,
    connected: false,
    reconnectTimer: null,
    refreshTimer: null,
    disabled: false
  },
  callLogs: [],
  callLogsLoaded: false,
  callLogsLoading: false,
  callLogsError: "",
  callLogsPollTimer: null,
  selectedCallLogId: null,
  callLogDetails: new Map(),
  callLogDetailLoadingId: null,
  callLogDetailError: "",
  voicemails: [],
  voicemailsLoaded: false,
  voicemailsLoading: false,
  voicemailsError: "",
  voicemailPlayingId: null,
  voicemailLoadingAudioId: null,
  voicemailAudio: null,
  voicemailAudioUrl: null,
  waitStatus: null,
  waitStatusLoaded: false,
  waitStatusLoading: false,
  waitStatusSaving: false,
  waitStatusMessage: "",
  waitStatusIsError: false,
  menu86Outages: [],
  menu86MenuItems: [],
  menu86Loaded: false,
  menu86Loading: false,
  menu86Error: "",
  menu86Mode: "menuItem",
  menu86IngredientName: "",
  menu86MenuSearchText: "",
  menu86SelectedMenuItemIds: new Set(),
  menu86Note: "",
  menu86DurationHours: 0,
  menu86Saving: false,
  menu86ResolvingId: null,
  reservations: [],
  reservationsLoaded: false,
  reservationsLoading: false,
  reservationLoadError: "",
  reservationConfig: null,
  reservationSelectedDateKey: null,
  reservationSelectedServiceKey: null,
  reservationCalendarMonthKey: null,
  reservationViewMode: "timeline",
  reservationFormOpen: false,
  reservationFormDateKey: null,
  reservationFormSaving: false,
  reservationFormError: "",
  reservationDetailId: null,
  reservationDetailEditing: false,
  reservationDetailEditDateKey: null,
  reservationDetailDraft: null,
  reservationDetailSaving: false,
  reservationDetailError: "",
  reservationCheckInPrompt: null
};

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setLoginStatus(message, isError = false) {
  if (!loginStatus) {
    return;
  }
  loginStatus.textContent = message;
  loginStatus.classList.toggle("error", isError);
}

function storeSession(session) {
  try {
    sessionStorage.setItem(sessionKey, JSON.stringify(session));
  } catch {
    // Some private browsing modes can reject session storage. The live session can still render.
  }
}

function readStoredSession() {
  try {
    const raw = sessionStorage.getItem(sessionKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearStoredSession() {
  try {
    sessionStorage.removeItem(sessionKey);
  } catch {
    // Ignore storage cleanup failures and keep the visible login state authoritative.
  }
}

function adminOnboardingModulesStorageKey() {
  const businessId = portalState.business?.objectId || portalState.adminSettings?.business?.objectId || "default";
  return `${adminOnboardingModulesStoragePrefix}.${businessId}`;
}

function readStoredAdminOnboardingOpenModules() {
  const defaults = defaultOnboardingOpenModules();
  try {
    const raw = localStorage.getItem(adminOnboardingModulesStorageKey());
    if (!raw) {
      return defaults;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return defaults;
    }
    return Object.fromEntries(
      Object.keys(defaults).map((key) => [key, typeof parsed[key] === "boolean" ? parsed[key] : defaults[key]])
    );
  } catch {
    return defaults;
  }
}

function storeAdminOnboardingOpenModules() {
  try {
    const modules = {
      ...defaultOnboardingOpenModules(),
      ...(portalState.adminOnboardingOpenModules || {})
    };
    localStorage.setItem(adminOnboardingModulesStorageKey(), JSON.stringify(modules));
  } catch {
    // Some browsers can reject local storage. The in-memory state still works for the current page.
  }
}

async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    ...(options.headers ?? {})
  };
  if (portalState.session?.sessionToken) {
    headers.Authorization = `Bearer ${portalState.session.sessionToken}`;
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    cache: "no-store",
    headers
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};
  if (!response.ok) {
    const error = new Error(payload?.error || "request_failed");
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}

async function apiBlobRequest(path, options = {}) {
  const headers = {
    "Cache-Control": "no-cache",
    ...(options.headers ?? {})
  };
  if (portalState.session?.sessionToken) {
    headers.Authorization = `Bearer ${portalState.session.sessionToken}`;
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    cache: "no-store",
    headers
  });
  if (!response.ok) {
    let message = "request_failed";
    try {
      const text = await response.text();
      const payload = text ? JSON.parse(text) : {};
      message = payload?.error || message;
    } catch {
      // Binary endpoints may not return JSON errors.
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return response.blob();
}

function foodOrdersLiveQueryState() {
  return portalState.foodOrdersLiveQuery;
}

function resetPortalFoodOrdersLiveQuery() {
  const live = foodOrdersLiveQueryState();
  if (live.reconnectTimer) {
    window.clearTimeout(live.reconnectTimer);
  }
  if (live.refreshTimer) {
    window.clearTimeout(live.refreshTimer);
  }
  if (live.socket) {
    try {
      live.socket.close(1000, "closing");
    } catch {
      // Socket cleanup is best-effort only.
    }
  }
  live.config = null;
  live.socket = null;
  live.requestId = 1;
  live.connecting = false;
  live.connected = false;
  live.reconnectTimer = null;
  live.refreshTimer = null;
  live.disabled = false;
}

function stopPortalFoodOrdersLiveQuery() {
  const live = foodOrdersLiveQueryState();
  if (live.reconnectTimer) {
    window.clearTimeout(live.reconnectTimer);
    live.reconnectTimer = null;
  }
  if (live.socket) {
    try {
      live.socket.close(1000, "leaving food orders");
    } catch {
      // Ignore browser-specific socket close failures.
    }
  }
  live.socket = null;
  live.connecting = false;
  live.connected = false;
}

async function startPortalFoodOrdersLiveQuery() {
  const live = foodOrdersLiveQueryState();
  if (
    live.disabled ||
    live.socket ||
    live.connecting ||
    !portalState.session?.sessionToken ||
    !modulePermission("foodOrders").read ||
    typeof WebSocket === "undefined"
  ) {
    return;
  }

  live.connecting = true;
  try {
    if (!live.config) {
      const payload = await apiRequest("/operations/live-query-config?className=FoodOrder", { method: "GET" });
      live.config = payload.liveQuery || null;
    }
    if (!live.config?.enabled || !live.config?.url) {
      live.disabled = true;
      return;
    }

    const socket = new WebSocket(live.config.url);
    live.socket = socket;
    socket.addEventListener("open", () => {
      const connectPayload = {
        op: "connect",
        applicationId: live.config.applicationId,
        sessionToken: portalState.session?.sessionToken
      };
      if (live.config.javascriptKey) {
        connectPayload.javascriptKey = live.config.javascriptKey;
        connectPayload.clientKey = live.config.javascriptKey;
      }
      socket.send(JSON.stringify(connectPayload));
    });
    socket.addEventListener("message", (event) => {
      handlePortalFoodOrdersLiveQueryMessage(event.data);
    });
    socket.addEventListener("close", () => {
      const shouldReconnect = live.socket === socket && portalState.section === "foodOrders" && portalState.session?.sessionToken;
      live.socket = null;
      live.connected = false;
      live.connecting = false;
      if (shouldReconnect) {
        schedulePortalFoodOrdersLiveQueryReconnect();
      }
    });
    socket.addEventListener("error", () => {
      try {
        socket.close();
      } catch {
        // Close failures are harmless; the browser will fire close when possible.
      }
    });
  } catch {
    live.disabled = true;
  } finally {
    live.connecting = false;
  }
}

function handlePortalFoodOrdersLiveQueryMessage(rawData) {
  let payload;
  try {
    payload = JSON.parse(String(rawData));
  } catch {
    return;
  }

  if (payload?.op === "connected") {
    const live = foodOrdersLiveQueryState();
    live.connected = true;
    subscribePortalFoodOrdersLiveQuery();
    return;
  }

  if (["create", "update", "enter", "leave", "delete"].includes(payload?.op)) {
    schedulePortalFoodOrdersLiveRefresh();
  }

  if (payload?.op === "error") {
    schedulePortalFoodOrdersLiveQueryReconnect();
  }
}

function subscribePortalFoodOrdersLiveQuery() {
  const live = foodOrdersLiveQueryState();
  if (!live.socket || !live.config?.businessId) {
    return;
  }
  const subscribePayload = {
    op: "subscribe",
    requestId: live.requestId++,
    query: {
      className: live.config.className || "FoodOrder",
      where: {
        $or: [
          {
            business: {
              __type: "Pointer",
              className: "Business",
              objectId: live.config.businessId
            }
          },
          { businessId: live.config.businessId }
        ]
      }
    }
  };
  live.socket.send(JSON.stringify(subscribePayload));
}

function schedulePortalFoodOrdersLiveQueryReconnect() {
  const live = foodOrdersLiveQueryState();
  if (live.reconnectTimer || live.disabled || portalState.section !== "foodOrders") {
    return;
  }
  stopPortalFoodOrdersLiveQuery();
  live.reconnectTimer = window.setTimeout(() => {
    live.reconnectTimer = null;
    void startPortalFoodOrdersLiveQuery();
  }, 2000);
}

function schedulePortalFoodOrdersLiveRefresh() {
  const live = foodOrdersLiveQueryState();
  if (live.refreshTimer) {
    window.clearTimeout(live.refreshTimer);
  }
  live.refreshTimer = window.setTimeout(() => {
    live.refreshTimer = null;
    void refreshPortalFoodOrdersFromLiveQuery();
  }, 350);
}

async function refreshPortalFoodOrdersFromLiveQuery() {
  if (!portalState.session?.sessionToken || portalState.foodOrdersLoading) {
    return;
  }
  try {
    const payload = await apiRequest("/operations/food-orders?limit=100", { method: "GET" });
    portalState.foodOrders = Array.isArray(payload.orders) ? payload.orders : [];
    portalState.foodOrdersLoaded = true;
    portalState.foodOrdersError = "";
    if (portalState.section === "foodOrders") {
      renderFoodOrdersInbox();
    }
  } catch {
    // Keep the current list visible; manual refresh remains the fallback.
  }
}

function reservationsLiveQueryState() {
  return portalState.reservationsLiveQuery;
}

function resetPortalReservationsLiveQuery() {
  const live = reservationsLiveQueryState();
  if (live.reconnectTimer) {
    window.clearTimeout(live.reconnectTimer);
  }
  if (live.refreshTimer) {
    window.clearTimeout(live.refreshTimer);
  }
  if (live.socket) {
    try {
      live.socket.close(1000, "closing");
    } catch {
      // Socket cleanup is best-effort only.
    }
  }
  live.config = null;
  live.socket = null;
  live.requestId = 1;
  live.connecting = false;
  live.connected = false;
  live.reconnectTimer = null;
  live.refreshTimer = null;
  live.disabled = false;
}

function stopPortalReservationsLiveQuery() {
  const live = reservationsLiveQueryState();
  if (live.reconnectTimer) {
    window.clearTimeout(live.reconnectTimer);
    live.reconnectTimer = null;
  }
  if (live.socket) {
    try {
      live.socket.close(1000, "leaving reservations");
    } catch {
      // Ignore browser-specific socket close failures.
    }
  }
  live.socket = null;
  live.connecting = false;
  live.connected = false;
}

async function startPortalReservationsLiveQuery() {
  const live = reservationsLiveQueryState();
  if (
    live.disabled ||
    live.socket ||
    live.connecting ||
    !portalState.session?.sessionToken ||
    !modulePermission("reservations").read ||
    typeof WebSocket === "undefined"
  ) {
    return;
  }

  live.connecting = true;
  try {
    if (!live.config) {
      const payload = await apiRequest("/operations/live-query-config?className=TavraReservation", { method: "GET" });
      live.config = payload.liveQuery || null;
    }
    if (!live.config?.enabled || !live.config?.url) {
      live.disabled = true;
      return;
    }

    const socket = new WebSocket(live.config.url);
    live.socket = socket;
    socket.addEventListener("open", () => {
      const connectPayload = {
        op: "connect",
        applicationId: live.config.applicationId,
        sessionToken: portalState.session?.sessionToken
      };
      if (live.config.javascriptKey) {
        connectPayload.javascriptKey = live.config.javascriptKey;
        connectPayload.clientKey = live.config.javascriptKey;
      }
      socket.send(JSON.stringify(connectPayload));
    });
    socket.addEventListener("message", (event) => {
      handlePortalReservationsLiveQueryMessage(event.data);
    });
    socket.addEventListener("close", () => {
      const shouldReconnect = live.socket === socket && portalState.section === "reservations" && portalState.session?.sessionToken;
      live.socket = null;
      live.connected = false;
      live.connecting = false;
      if (shouldReconnect) {
        schedulePortalReservationsLiveQueryReconnect();
      }
    });
    socket.addEventListener("error", () => {
      try {
        socket.close();
      } catch {
        // Close failures are harmless; the browser will fire close when possible.
      }
    });
  } catch {
    live.disabled = true;
  } finally {
    live.connecting = false;
  }
}

function handlePortalReservationsLiveQueryMessage(rawData) {
  let payload;
  try {
    payload = JSON.parse(String(rawData));
  } catch {
    return;
  }

  if (payload?.op === "connected") {
    const live = reservationsLiveQueryState();
    live.connected = true;
    subscribePortalReservationsLiveQuery();
    return;
  }

  if (["create", "update", "enter", "leave", "delete"].includes(payload?.op)) {
    schedulePortalReservationsLiveRefresh();
  }

  if (payload?.op === "error") {
    schedulePortalReservationsLiveQueryReconnect();
  }
}

function subscribePortalReservationsLiveQuery() {
  const live = reservationsLiveQueryState();
  if (!live.socket || !live.config?.businessId) {
    return;
  }
  const subscribePayload = {
    op: "subscribe",
    requestId: live.requestId++,
    query: {
      className: live.config.className || "TavraReservation",
      where: {
        $or: [
          {
            business: {
              __type: "Pointer",
              className: "Business",
              objectId: live.config.businessId
            }
          },
          { businessId: live.config.businessId }
        ]
      }
    }
  };
  live.socket.send(JSON.stringify(subscribePayload));
}

function schedulePortalReservationsLiveQueryReconnect() {
  const live = reservationsLiveQueryState();
  if (live.reconnectTimer || live.disabled || portalState.section !== "reservations") {
    return;
  }
  stopPortalReservationsLiveQuery();
  live.reconnectTimer = window.setTimeout(() => {
    live.reconnectTimer = null;
    void startPortalReservationsLiveQuery();
  }, 2000);
}

function schedulePortalReservationsLiveRefresh() {
  const live = reservationsLiveQueryState();
  if (live.refreshTimer) {
    window.clearTimeout(live.refreshTimer);
  }
  live.refreshTimer = window.setTimeout(() => {
    live.refreshTimer = null;
    void refreshPortalReservationsFromLiveQuery();
  }, 350);
}

async function refreshPortalReservationsFromLiveQuery() {
  if (!portalState.session?.sessionToken || portalState.reservationsLoading) {
    return;
  }
  try {
    const payload = await apiRequest("/operations/reservations?limit=200", { method: "GET" });
    portalState.reservations = Array.isArray(payload.reservations) ? payload.reservations : [];
    portalState.reservationConfig = payload.reservationConfig || portalState.reservationConfig;
    portalState.reservationsLoaded = true;
    portalState.reservationLoadError = "";
    if (portalState.section === "reservations") {
      renderReservationsBook();
    }
  } catch {
    // Keep the current book visible; manual refresh remains the fallback.
  }
}

function callLogsLiveQueryState() {
  return portalState.callLogsLiveQuery;
}

function resetPortalCallLogsLiveQuery() {
  const live = callLogsLiveQueryState();
  if (live.reconnectTimer) {
    window.clearTimeout(live.reconnectTimer);
  }
  if (live.refreshTimer) {
    window.clearTimeout(live.refreshTimer);
  }
  if (live.socket) {
    try {
      live.socket.close(1000, "closing");
    } catch {
      // Socket cleanup is best-effort only.
    }
  }
  live.config = null;
  live.socket = null;
  live.requestId = 1;
  live.connecting = false;
  live.connected = false;
  live.reconnectTimer = null;
  live.refreshTimer = null;
  live.disabled = false;
}

function stopPortalCallLogsLiveQuery() {
  const live = callLogsLiveQueryState();
  if (live.reconnectTimer) {
    window.clearTimeout(live.reconnectTimer);
    live.reconnectTimer = null;
  }
  if (live.socket) {
    try {
      live.socket.close(1000, "leaving call logs");
    } catch {
      // Ignore browser-specific socket close failures.
    }
  }
  live.socket = null;
  live.connecting = false;
  live.connected = false;
}

async function startPortalCallLogsLiveQuery() {
  const live = callLogsLiveQueryState();
  if (
    live.disabled ||
    live.socket ||
    live.connecting ||
    !portalState.session?.sessionToken ||
    !modulePermission("callLogs").read ||
    typeof WebSocket === "undefined"
  ) {
    return;
  }

  live.connecting = true;
  try {
    if (!live.config) {
      const payload = await apiRequest("/operations/live-query-config?className=CallLog", { method: "GET" });
      live.config = payload.liveQuery || null;
    }
    if (!live.config?.enabled || !live.config?.url) {
      live.disabled = true;
      return;
    }

    const socket = new WebSocket(live.config.url);
    live.socket = socket;
    socket.addEventListener("open", () => {
      const connectPayload = {
        op: "connect",
        applicationId: live.config.applicationId,
        sessionToken: portalState.session?.sessionToken
      };
      if (live.config.javascriptKey) {
        connectPayload.javascriptKey = live.config.javascriptKey;
        connectPayload.clientKey = live.config.javascriptKey;
      }
      socket.send(JSON.stringify(connectPayload));
    });
    socket.addEventListener("message", (event) => {
      handlePortalCallLogsLiveQueryMessage(event.data);
    });
    socket.addEventListener("close", () => {
      const shouldReconnect = live.socket === socket && portalState.section === "callLogs" && portalState.session?.sessionToken;
      live.socket = null;
      live.connected = false;
      live.connecting = false;
      if (shouldReconnect) {
        schedulePortalCallLogsLiveQueryReconnect();
      }
    });
    socket.addEventListener("error", () => {
      try {
        socket.close();
      } catch {
        // Close failures are harmless; the browser will fire close when possible.
      }
    });
  } catch {
    live.disabled = true;
  } finally {
    live.connecting = false;
  }
}

function handlePortalCallLogsLiveQueryMessage(rawData) {
  let payload;
  try {
    payload = JSON.parse(String(rawData));
  } catch {
    return;
  }

  if (payload?.op === "connected") {
    const live = callLogsLiveQueryState();
    live.connected = true;
    subscribePortalCallLogsLiveQuery();
    return;
  }

  if (["create", "update", "enter", "leave", "delete"].includes(payload?.op)) {
    schedulePortalCallLogsLiveRefresh();
  }

  if (payload?.op === "error") {
    schedulePortalCallLogsLiveQueryReconnect();
  }
}

function subscribePortalCallLogsLiveQuery() {
  const live = callLogsLiveQueryState();
  if (!live.socket || !live.config?.businessId) {
    return;
  }
  const subscribePayload = {
    op: "subscribe",
    requestId: live.requestId++,
    query: {
      className: live.config.className || "CallLog",
      where: {
        $or: [
          {
            business: {
              __type: "Pointer",
              className: "Business",
              objectId: live.config.businessId
            }
          },
          { businessId: live.config.businessId }
        ]
      }
    }
  };
  live.socket.send(JSON.stringify(subscribePayload));
}

function schedulePortalCallLogsLiveQueryReconnect() {
  const live = callLogsLiveQueryState();
  if (live.reconnectTimer || live.disabled || portalState.section !== "callLogs") {
    return;
  }
  stopPortalCallLogsLiveQuery();
  live.reconnectTimer = window.setTimeout(() => {
    live.reconnectTimer = null;
    void startPortalCallLogsLiveQuery();
  }, 2000);
}

function schedulePortalCallLogsLiveRefresh() {
  const live = callLogsLiveQueryState();
  if (live.refreshTimer) {
    window.clearTimeout(live.refreshTimer);
  }
  live.refreshTimer = window.setTimeout(() => {
    live.refreshTimer = null;
    void refreshPortalCallLogsFromLiveQuery();
  }, 350);
}

async function refreshPortalCallLogsFromLiveQuery() {
  if (!portalState.session?.sessionToken || portalState.callLogsLoading) {
    return;
  }
  try {
    const payload = await apiRequest("/operations/call-logs?limit=100", { method: "GET" });
    portalState.callLogs = Array.isArray(payload.calls) ? payload.calls : [];
    portalState.callLogsLoaded = true;
    portalState.callLogsError = "";
    const selectedId = portalState.selectedCallLogId;
    if (selectedId) {
      try {
        const detailPayload = await apiRequest(`/operations/call-logs/${encodeURIComponent(selectedId)}`, { method: "GET" });
        const detail = detailPayload.call || detailPayload;
        portalState.callLogDetails.set(selectedId, detail);
        portalState.callLogDetailError = "";
      } catch (error) {
        portalState.callLogDetailError = error instanceof Error ? error.message : String(error);
      }
    }
    if (portalState.section === "callLogs") {
      renderCallLogsInbox();
    }
  } catch {
    // Keep the current log visible; manual refresh remains the fallback.
  }
}

function startPortalCallLogsPolling() {
  if (portalState.callLogsPollTimer || portalState.section !== "callLogs") {
    return;
  }
  portalState.callLogsPollTimer = window.setInterval(() => {
    if (portalState.section !== "callLogs") {
      stopPortalCallLogsPolling();
      return;
    }
    void refreshPortalCallLogsFromLiveQuery();
  }, 10000);
}

function stopPortalCallLogsPolling() {
  if (portalState.callLogsPollTimer) {
    window.clearInterval(portalState.callLogsPollTimer);
    portalState.callLogsPollTimer = null;
  }
}

function parseReservationDateValue(value) {
  if (!value) {
    return null;
  }
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isFinite(parsed.getTime()) ? parsed : null;
  }
  if (typeof value === "object" && typeof value.iso === "string") {
    const parsed = new Date(value.iso);
    return Number.isFinite(parsed.getTime()) ? parsed : null;
  }
  return null;
}

function reservationStartDate(reservation) {
  return parseReservationDateValue(reservation.slotStartAt) ||
    parseReservationDateValue(reservation.requestedAt);
}

function reservationEndDate(reservation) {
  return parseReservationDateValue(reservation.slotEndAt);
}

function finiteNumber(value, fallback) {
  const number = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : Number.NaN;
  return Number.isFinite(number) ? number : fallback;
}

function clampNumber(value, fallback, min, max) {
  const number = finiteNumber(value, fallback);
  return Math.min(max, Math.max(min, number));
}

function timeStringToMinutes(value) {
  if (typeof value !== "string") {
    return null;
  }
  const match = value.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) {
    return null;
  }
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }
  return hour * 60 + minute;
}

function normalizeServiceHours(rawServiceHours) {
  if (!rawServiceHours || typeof rawServiceHours !== "object" || Array.isArray(rawServiceHours)) {
    return {};
  }
  return reservationServiceDayKeys.reduce((result, dayKey) => {
    const rawWindows = rawServiceHours[dayKey];
    if (!Array.isArray(rawWindows)) {
      return result;
    }
    const windows = rawWindows
      .map((window, index) => {
        const start = timeStringToMinutes(window?.start ?? window?.startTime);
        const end = timeStringToMinutes(window?.end ?? window?.endTime);
        if (start === null || end === null) {
          return null;
        }
        return { start, end: end <= start ? end + 1440 : end, sourceIndex: index };
      })
      .filter(Boolean);
    if (windows.length) {
      result[dayKey] = windows;
    }
    return result;
  }, {});
}

function reservationSettings() {
  const config = portalState.reservationConfig || {};
  const slotMinutes = clampNumber(config.reservationTimeSlotMinutes, defaultReservationSlotMinutes, 5, 120);
  const maxCoversFromHour = Number.isFinite(Number(config.maxCoversPerHour))
    ? Math.max(1, Math.ceil((Number(config.maxCoversPerHour) * slotMinutes) / 60))
    : null;
  const maxCoversPerSlot = clampNumber(
    config.maxCoversPerSlot ?? maxCoversFromHour,
    defaultReservationMaxCoversPerSlot,
    1,
    500
  );
  return {
    timezone: typeof config.timezone === "string" && config.timezone.trim() ? config.timezone.trim() : defaultReservationTimezone,
    slotMinutes,
    maxCoversPerSlot,
    maxPartiesPerSlot: clampNumber(config.maxPartiesPerSlot, defaultReservationMaxPartiesPerSlot, 1, 100),
    minPartySize: clampNumber(config.minPartySize, defaultReservationMinPartySize, 1, 500),
    maxPartySize: clampNumber(config.maxPartySize, defaultReservationMaxPartySize, 1, 500),
    serviceHours: normalizeServiceHours(config.serviceHours),
    closedDays: Array.isArray(config.closedDays)
      ? config.closedDays.map((day) => Number(day)).filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
      : [],
    reservationsEnabled: config.reservationsEnabled !== false,
    defaultReservationStatus: typeof config.defaultReservationStatus === "string" ? config.defaultReservationStatus : "requested"
  };
}

function datePartsInReservationTimezone(date, timezone = reservationSettings().timezone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const valueFor = (type) => parts.find((part) => part.type === type)?.value || "00";
  return {
    year: valueFor("year"),
    month: valueFor("month"),
    day: valueFor("day"),
    hour: Number(valueFor("hour")),
    minute: Number(valueFor("minute"))
  };
}

function reservationDateKey(date) {
  const parts = datePartsInReservationTimezone(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function reservationMinutesOfDay(date) {
  const parts = datePartsInReservationTimezone(date);
  return parts.hour * 60 + parts.minute;
}

function dateKeyForToday() {
  return reservationDateKey(new Date());
}

function offsetDateKey(dateKey, offsetDays) {
  const [year, month, day] = String(dateKey || dateKeyForToday()).split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + offsetDays, 12, 0, 0));
  return date.toISOString().slice(0, 10);
}

function formatReservationDateHeading(dateKey) {
  const [year, month, day] = String(dateKey || dateKeyForToday()).split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function formatReservationTime(minutes) {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(normalized / 60);
  const minute = normalized % 60;
  const meridiem = hours24 >= 12 ? "PM" : "AM";
  const hour12 = hours24 % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${meridiem}`;
}

function minutesToInputTime(minutes) {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(normalized / 60)).padStart(2, "0")}:${String(normalized % 60).padStart(2, "0")}`;
}

function dateKeyWeekday(dateKey) {
  const [year, month, day] = String(dateKey || dateKeyForToday()).split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).getUTCDay();
}

function splitServiceWindow(window, dayKey, index) {
  const segments = [
    { type: "breakfast", start: 5 * 60, end: 11 * 60 },
    { type: "lunch", start: 11 * 60, end: 16 * 60 },
    { type: "dinner", start: 16 * 60, end: 29 * 60 }
  ];
  const split = segments
    .map((segment) => {
      const start = Math.max(window.start, segment.start);
      const end = Math.min(window.end, segment.end);
      if (start >= end) {
        return null;
      }
      return {
        key: `${dayKey}-${segment.type}-${index}`,
        type: segment.type,
        label: reservationServiceLabels[segment.type],
        start,
        end
      };
    })
    .filter(Boolean);
  if (split.length) {
    return split;
  }
  return [{
    key: `${dayKey}-service-${index}`,
    type: "service",
    label: reservationServiceLabels.service,
    start: window.start,
    end: window.end
  }];
}

function serviceWindowsForDateKey(dateKey, settings = reservationSettings()) {
  const weekday = dateKeyWeekday(dateKey);
  if (settings.closedDays.includes(weekday)) {
    return [];
  }
  const dayKey = reservationServiceDayKeys[weekday];
  const rawWindows = settings.serviceHours[dayKey] || [];
  const windows = rawWindows.length
    ? rawWindows
    : [{ start: defaultReservationStartMinutes, end: defaultReservationEndMinutes, sourceIndex: 0 }];
  return windows.flatMap((window, index) => splitServiceWindow(window, dayKey, window.sourceIndex ?? index));
}

function chooseServiceWindow(windows) {
  if (!windows.length) {
    return null;
  }
  const selected = portalState.reservationSelectedServiceKey
    ? windows.find((window) => window.key === portalState.reservationSelectedServiceKey)
    : null;
  return selected || windows.find((window) => window.type === "dinner") || windows[0];
}

function reservationTimeOptionsForDate(dateKey) {
  const settings = reservationSettings();
  const windows = serviceWindowsForDateKey(dateKey, settings);
  const options = [];
  const seen = new Set();
  windows.forEach((window) => {
    for (let minute = window.start; minute < window.end; minute += settings.slotMinutes) {
      const value = minutesToInputTime(minute);
      if (!seen.has(value)) {
        seen.add(value);
        options.push({ value, label: `${formatReservationTime(minute)} · ${window.label}`, minute });
      }
    }
  });
  return options;
}

function zonedDateTimeToUtc(dateKey, timeValue, timezone = reservationSettings().timezone) {
  const [year, month, day] = String(dateKey).split("-").map(Number);
  const [hour, minute] = String(timeValue).split(":").map(Number);
  const desiredLocalMs = Date.UTC(year, month - 1, day, hour, minute, 0);
  let guess = desiredLocalMs;
  for (let index = 0; index < 3; index += 1) {
    const parts = datePartsInReservationTimezone(new Date(guess), timezone);
    const actualLocalMs = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), parts.hour, parts.minute, 0);
    guess += desiredLocalMs - actualLocalMs;
  }
  return new Date(guess);
}

function reservationStatusClass(status) {
  switch (status) {
    case "confirmed":
    case "checked_in":
      return "confirmed";
    case "declined":
    case "no_show":
      return "declined";
    case "cancelled":
    case "completed":
      return "cancelled";
    case "requested":
    default:
      return "requested";
  }
}

function reservationRawStatusClass(status) {
  return String(status || "requested").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-") || "requested";
}

function reservationStatusNote(reservation) {
  const status = reservation.status || "requested";
  if (status === "declined") {
    return "Declined";
  }
  if (status === "cancelled") {
    return "Cancelled";
  }
  if (status === "checked_in") {
    return "Checked in";
  }
  if (status === "no_show") {
    return "No-show";
  }
  if (status === "completed") {
    return "Completed";
  }
  return String(reservation.partySize || 1);
}

function reservationSlotPressureTone(percent) {
  if (percent >= 100) {
    return "full";
  }
  if (percent >= 80) {
    return "heavy";
  }
  if (percent >= 50) {
    return "steady";
  }
  return "light";
}

function chooseReservationDateKey(reservations) {
  const dated = reservations
    .map((reservation) => reservationStartDate(reservation))
    .filter(Boolean)
    .sort((a, b) => a.getTime() - b.getTime());
  const today = dateKeyForToday();
  if (dated.some((date) => reservationDateKey(date) === today)) {
    return today;
  }
  const now = new Date();
  const upcoming = dated.find((date) => date >= now);
  if (upcoming) {
    return reservationDateKey(upcoming);
  }
  return dated.length ? reservationDateKey(dated[dated.length - 1]) : today;
}

function reservationsForDateKey(dateKey) {
  return portalState.reservations
    .filter((reservation) => {
      const start = reservationStartDate(reservation);
      return start && reservationDateKey(start) === dateKey;
    })
    .sort((a, b) => {
      const aStart = reservationStartDate(a)?.getTime() || 0;
      const bStart = reservationStartDate(b)?.getTime() || 0;
      return aStart - bStart;
    });
}

function reservationsForSelectedDate() {
  const dateKey = portalState.reservationSelectedDateKey || chooseReservationDateKey(portalState.reservations);
  return reservationsForDateKey(dateKey);
}

function buildReservationTimelineModel() {
  const settings = reservationSettings();
  const selectedDateKey = portalState.reservationSelectedDateKey || chooseReservationDateKey(portalState.reservations);
  const serviceWindows = serviceWindowsForDateKey(selectedDateKey, settings);
  const selectedWindow = chooseServiceWindow(serviceWindows);
  if (selectedWindow && portalState.reservationSelectedServiceKey !== selectedWindow.key) {
    portalState.reservationSelectedServiceKey = selectedWindow.key;
  }
  const allDateReservations = reservationsForSelectedDate();
  const timedReservations = allDateReservations
    .map((reservation) => {
      const startDate = reservationStartDate(reservation);
      if (!startDate) {
        return null;
      }
      const endDate = reservationEndDate(reservation);
      const startMinutes = reservationMinutesOfDay(startDate);
      const endMinutes = endDate
        ? Math.max(startMinutes + settings.slotMinutes, reservationMinutesOfDay(endDate))
        : startMinutes + 45;
      return { reservation, startDate, startMinutes, endMinutes };
    })
    .filter(Boolean)
    .filter((item) => !selectedWindow || (item.startMinutes >= selectedWindow.start && item.startMinutes < selectedWindow.end))
    .sort((a, b) => a.startMinutes - b.startMinutes);

  const minReservationMinute = timedReservations.length
    ? Math.min(...timedReservations.map((item) => item.startMinutes))
    : selectedWindow?.start ?? defaultReservationStartMinutes;
  const maxReservationMinute = timedReservations.length
    ? Math.max(...timedReservations.map((item) => item.endMinutes))
    : selectedWindow?.end ?? defaultReservationEndMinutes;
  const startBoundary = selectedWindow?.start ?? defaultReservationStartMinutes;
  const endBoundary = selectedWindow?.end ?? defaultReservationEndMinutes;
  const startMinute = Math.min(startBoundary, Math.floor(minReservationMinute / settings.slotMinutes) * settings.slotMinutes);
  const endMinute = Math.max(endBoundary, Math.ceil(maxReservationMinute / settings.slotMinutes) * settings.slotMinutes);
  const slotLabels = [];
  for (let minute = startMinute; minute <= endMinute; minute += settings.slotMinutes) {
    slotLabels.push(formatReservationTime(minute));
  }

  const slotPressure = new Map();
  timedReservations.forEach((item) => {
    const reservation = item.reservation;
    if (!reservationActiveStatuses.has(reservation.status || "requested")) {
      return;
    }
    const slotIndex = Math.floor((item.startMinutes - startMinute) / settings.slotMinutes);
    const current = slotPressure.get(slotIndex) || { covers: 0, parties: 0 };
    current.covers += Number(reservation.partySize || 0);
    current.parties += 1;
    slotPressure.set(slotIndex, current);
  });

  const lanes = [];
  const events = timedReservations.map((item) => {
    const start = (item.startMinutes - startMinute) / settings.slotMinutes;
    const slotIndex = Math.floor(start);
    const pressure = slotPressure.get(slotIndex) || { covers: 0, parties: 0 };
    const coversPercent = settings.maxCoversPerSlot > 0 ? (pressure.covers / settings.maxCoversPerSlot) * 100 : 0;
    const partiesPercent = settings.maxPartiesPerSlot > 0 ? (pressure.parties / settings.maxPartiesPerSlot) * 100 : 0;
    const pressurePercent = Math.round(Math.max(coversPercent, partiesPercent));
    const span = Math.max(1.35, (item.endMinutes - item.startMinutes) / settings.slotMinutes);
    let row = lanes.findIndex((laneEnd) => laneEnd <= start);
    if (row === -1) {
      row = lanes.length;
      lanes.push(start + span);
    } else {
      lanes[row] = start + span;
    }
    const reservation = item.reservation;
    const className = reservationStatusClass(reservation.status);
    return {
      id: reservation.objectId || `${reservation.guestName}-${item.startDate.toISOString()}`,
      name: reservation.guestName || "Unknown guest",
      party: Number(reservation.partySize || 1),
      status: className,
      rawStatusClass: reservationRawStatusClass(reservation.status),
      rawStatus: reservation.status || "requested",
      pressureTone: reservationSlotPressureTone(pressurePercent),
      pressurePercent,
      reservation,
      start,
      span,
      row,
      note: reservationStatusNote(reservation),
      flags: reservationArrivalFlags(reservation)
    };
  });

  const visibleReservations = timedReservations.map((item) => item.reservation);
  const activeReservations = visibleReservations.filter((reservation) => reservationActiveStatuses.has(reservation.status || "requested"));
  const coversReserved = activeReservations.reduce((sum, reservation) => sum + Number(reservation.partySize || 0), 0);
  const hourStarts = [];
  for (let minute = startMinute; minute <= endMinute; minute += 60) {
    hourStarts.push(minute);
  }
  const hourlyCapacity = hourStarts.map((minute) => {
    const count = activeReservations.reduce((sum, reservation) => {
      const start = reservationStartDate(reservation);
      if (!start) {
        return sum;
      }
      const startMinutes = reservationMinutesOfDay(start);
      return startMinutes >= minute && startMinutes < minute + 60
        ? sum + Number(reservation.partySize || 0)
        : sum;
    }, 0);
    const percent = Math.min(100, Math.round((count / settings.maxCoversPerSlot) * 100));
    return {
      time: formatReservationTime(minute),
      count: `${count} / ${settings.maxCoversPerSlot}`,
      percent,
      tone: reservationOccupancyTone(percent)
    };
  });

  const totalCapacity = Math.max(settings.maxCoversPerSlot, slotLabels.length * settings.maxCoversPerSlot);
  const totalPercent = Math.min(100, Math.round((coversReserved / totalCapacity) * 100));
  const progressOffset = Math.round(220 - ((220 * totalPercent) / 100));
  const now = new Date();
  const showNow = reservationDateKey(now) === selectedDateKey;
  const nowSlot = (reservationMinutesOfDay(now) - startMinute) / settings.slotMinutes;
  return {
    selectedDateKey,
    selectedWindow,
    serviceWindows,
    settings,
    slotLabels,
    events,
    rowCount: Math.max(6, lanes.length || 1),
    reservationsCount: visibleReservations.length,
    allDateReservationsCount: allDateReservations.length,
    coversReserved,
    totalCapacity,
    totalPercent,
    progressOffset,
    hourlyCapacity,
    showNow: showNow && nowSlot >= 0 && nowSlot <= slotLabels.length,
    nowSlot,
    nowLabel: formatReservationTime(reservationMinutesOfDay(now))
  };
}

function reservationOccupancyTone(percent) {
  if (percent >= 95) {
    return "red";
  }
  if (percent >= 80) {
    return "orange";
  }
  if (percent >= 50) {
    return "yellow";
  }
  if (percent > 0) {
    return "green";
  }
  return "gray";
}

async function loadPortalReservations() {
  if (portalState.reservationsLoading) {
    return;
  }
  portalState.reservationsLoading = true;
  portalState.reservationLoadError = "";
  renderReservationsBook();
  try {
    const payload = await apiRequest("/operations/reservations?limit=200", { method: "GET" });
    portalState.reservations = Array.isArray(payload.reservations) ? payload.reservations : [];
    portalState.reservationConfig = payload.reservationConfig || portalState.reservationConfig;
    portalState.reservationsLoaded = true;
    if (!portalState.reservationSelectedDateKey) {
      portalState.reservationSelectedDateKey = chooseReservationDateKey(portalState.reservations);
    }
    if (!portalState.reservationCalendarMonthKey) {
      portalState.reservationCalendarMonthKey = portalState.reservationSelectedDateKey.slice(0, 7);
    }
    void startPortalReservationsLiveQuery();
  } catch (error) {
    portalState.reservationLoadError = error instanceof Error ? error.message : String(error);
  } finally {
    portalState.reservationsLoading = false;
    renderReservationsBook();
  }
}

async function loadPortalFoodOrders() {
  if (portalState.foodOrdersLoading) {
    return;
  }
  portalState.foodOrdersLoading = true;
  portalState.foodOrdersError = "";
  renderFoodOrdersInbox();
  try {
    const payload = await apiRequest("/operations/food-orders?limit=100", { method: "GET" });
    portalState.foodOrders = Array.isArray(payload.orders) ? payload.orders : [];
    portalState.foodOrdersLoaded = true;
    void startPortalFoodOrdersLiveQuery();
  } catch (error) {
    portalState.foodOrdersError = error instanceof Error ? error.message : String(error);
  } finally {
    portalState.foodOrdersLoading = false;
    renderFoodOrdersInbox();
  }
}

async function updatePortalFoodOrderStatus(orderId, status) {
  if (!orderId || !status || portalState.foodOrderUpdatingId) {
    return;
  }
  portalState.foodOrderUpdatingId = orderId;
  portalState.foodOrdersError = "";
  renderFoodOrdersInbox();
  try {
    const payload = await apiRequest(`/operations/food-orders/${encodeURIComponent(orderId)}/status`, {
      method: "PUT",
      body: JSON.stringify({ status })
    });
    if (payload.order) {
      portalState.foodOrders = portalState.foodOrders.map((order) => {
        const currentId = foodOrderId(order);
        return currentId === orderId ? payload.order : order;
      });
    }
  } catch (error) {
    portalState.foodOrdersError = error instanceof Error ? error.message : String(error);
  } finally {
    portalState.foodOrderUpdatingId = null;
    renderFoodOrdersInbox();
  }
}

async function loadPortalCallLogs() {
  if (portalState.callLogsLoading) {
    return;
  }
  portalState.callLogsLoading = true;
  portalState.callLogsError = "";
  renderCallLogsInbox();
  try {
    const payload = await apiRequest("/operations/call-logs?limit=100", { method: "GET" });
    portalState.callLogs = Array.isArray(payload.calls) ? payload.calls : [];
    portalState.callLogsLoaded = true;
    if (portalState.section === "callLogs") {
      void startPortalCallLogsLiveQuery();
    }
  } catch (error) {
    portalState.callLogsError = error instanceof Error ? error.message : String(error);
  } finally {
    portalState.callLogsLoading = false;
    renderCallLogsInbox();
  }
}

async function loadPortalCallLogDetail(callLogId) {
  if (!callLogId || portalState.callLogDetailLoadingId === callLogId) {
    return;
  }
  portalState.callLogDetailLoadingId = callLogId;
  portalState.callLogDetailError = "";
  renderCallLogsInbox();
  try {
    const payload = await apiRequest(`/operations/call-logs/${encodeURIComponent(callLogId)}`, { method: "GET" });
    const detail = payload.call || payload;
    portalState.callLogDetails.set(callLogId, detail);
  } catch (error) {
    portalState.callLogDetailError = error instanceof Error ? error.message : String(error);
  } finally {
    portalState.callLogDetailLoadingId = null;
    renderCallLogsInbox();
  }
}

async function loadPortalVoicemails() {
  if (portalState.voicemailsLoading) {
    return;
  }
  portalState.voicemailsLoading = true;
  portalState.voicemailsError = "";
  renderVoicemailInbox();
  try {
    const payload = await apiRequest("/operations/voicemails?limit=50", { method: "GET" });
    portalState.voicemails = Array.isArray(payload.voicemails) ? payload.voicemails : [];
    portalState.voicemailsLoaded = true;
  } catch (error) {
    portalState.voicemailsError = error instanceof Error ? error.message : String(error);
  } finally {
    portalState.voicemailsLoading = false;
    renderVoicemailInbox();
  }
}

async function playOrStopPortalVoicemail(voicemailId) {
  if (!voicemailId) {
    return;
  }
  if (portalState.voicemailPlayingId === voicemailId) {
    stopPortalVoicemail();
    renderVoicemailInbox();
    return;
  }

  stopPortalVoicemail();
  portalState.voicemailLoadingAudioId = voicemailId;
  portalState.voicemailsError = "";
  renderVoicemailInbox();

  try {
    const blob = await apiBlobRequest(`/operations/voicemails/${encodeURIComponent(voicemailId)}/audio`, { method: "GET" });
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    audio.addEventListener("ended", () => {
      if (portalState.voicemailPlayingId === voicemailId) {
        stopPortalVoicemail();
        renderVoicemailInbox();
      }
    });
    audio.addEventListener("error", () => {
      if (portalState.voicemailPlayingId === voicemailId || portalState.voicemailLoadingAudioId === voicemailId) {
        portalState.voicemailsError = "Playback failed.";
        stopPortalVoicemail();
        renderVoicemailInbox();
      }
    });
    portalState.voicemailAudio = audio;
    portalState.voicemailAudioUrl = audioUrl;
    portalState.voicemailPlayingId = voicemailId;
    portalState.voicemailLoadingAudioId = null;
    renderVoicemailInbox();
    await audio.play();
  } catch (error) {
    portalState.voicemailsError = `Playback failed: ${error instanceof Error ? error.message : String(error)}`;
    stopPortalVoicemail();
    renderVoicemailInbox();
  }
}

function stopPortalVoicemail() {
  if (portalState.voicemailAudio) {
    portalState.voicemailAudio.pause();
    portalState.voicemailAudio.currentTime = 0;
  }
  if (portalState.voicemailAudioUrl) {
    URL.revokeObjectURL(portalState.voicemailAudioUrl);
  }
  portalState.voicemailAudio = null;
  portalState.voicemailAudioUrl = null;
  portalState.voicemailPlayingId = null;
  portalState.voicemailLoadingAudioId = null;
}

async function loadPortalWaitStatus() {
  if (portalState.waitStatusLoading) {
    return;
  }
  portalState.waitStatusLoading = true;
  portalState.waitStatusMessage = "";
  portalState.waitStatusIsError = false;
  renderWaitListStatus();
  try {
    const payload = await apiRequest("/operations/wait-status", { method: "GET" });
    portalState.waitStatus = payload.waitStatus || defaultWaitStatus();
    portalState.waitStatusLoaded = true;
  } catch (error) {
    portalState.waitStatusMessage = `Could not load wait status: ${error instanceof Error ? error.message : String(error)}`;
    portalState.waitStatusIsError = true;
  } finally {
    portalState.waitStatusLoading = false;
    renderWaitListStatus();
  }
}

async function savePortalWaitStatus(draft) {
  if (portalState.waitStatusSaving) {
    return;
  }
  portalState.waitStatusSaving = true;
  portalState.waitStatusMessage = "";
  portalState.waitStatusIsError = false;
  renderWaitListStatus();
  try {
    const payload = await apiRequest("/operations/wait-status", {
      method: "PUT",
      body: JSON.stringify({ waitStatus: draft })
    });
    portalState.waitStatus = payload.waitStatus || draft;
    portalState.waitStatusLoaded = true;
    portalState.waitStatusMessage = "Wait status saved.";
    portalState.waitStatusIsError = false;
  } catch (error) {
    portalState.waitStatusMessage = `Could not save wait status: ${error instanceof Error ? error.message : String(error)}`;
    portalState.waitStatusIsError = true;
  } finally {
    portalState.waitStatusSaving = false;
    renderWaitListStatus();
  }
}

function savePortalWaitSourceMode(mode) {
  const draft = {
    ...defaultWaitStatus(),
    ...(portalState.waitStatus || {})
  };
  draft.sourceMode = mode;
  void savePortalWaitStatus(draft);
}

function setPortalHostWaitStatus(option) {
  const staleAfter = finiteNumber(portalState.waitStatus?.staleAfterMinutes, 30);
  const now = new Date();
  const draft = {
    ...defaultWaitStatus(),
    ...(portalState.waitStatus || {}),
    staleAfterMinutes: staleAfter,
    hostStatus: {
      state: option.state,
      minMinutes: option.minMinutes,
      maxMinutes: option.maxMinutes,
      note: null,
      updatedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + staleAfter * 60 * 1000).toISOString(),
      updatedBy: null
    }
  };
  void savePortalWaitStatus(draft);
}

function clearPortalHostWaitStatus() {
  const draft = {
    ...defaultWaitStatus(),
    ...(portalState.waitStatus || {}),
    hostStatus: null
  };
  void savePortalWaitStatus(draft);
}

async function loadPortalMenu86Board() {
  if (portalState.menu86Loading) {
    return;
  }
  portalState.menu86Loading = true;
  portalState.menu86Error = "";
  renderMenu86Board();
  try {
    const payload = await apiRequest("/operations/menu-86", { method: "GET" });
    portalState.menu86Outages = Array.isArray(payload.outages) ? payload.outages : [];
    portalState.menu86MenuItems = Array.isArray(payload.menuItems)
      ? payload.menuItems.slice().sort((left, right) => String(left.name || "").localeCompare(String(right.name || ""), undefined, { sensitivity: "base" }))
      : [];
    portalState.menu86Loaded = true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    portalState.menu86Error = message.includes("Cannot GET /operations/menu-86")
      ? "86 Board is not available from this backend yet. Restart or deploy the voice orchestrator with the latest code."
      : `86 Board load failed: ${message}`;
  } finally {
    portalState.menu86Loading = false;
    renderMenu86Board();
  }
}

async function createPortalMenu86Outage() {
  if (portalState.menu86Saving || !menu86CanCreate()) {
    portalState.menu86Error = portalState.menu86Mode === "ingredient"
      ? "Enter an ingredient that matches menu items."
      : "Select at least one menu item.";
    renderMenu86Board();
    return;
  }
  portalState.menu86Saving = true;
  portalState.menu86Error = "";
  renderMenu86Board();
  try {
    const mode = menu86ModeForKey(portalState.menu86Mode);
    const affectedPreview = menu86AffectedPreview();
    const label = portalState.menu86Mode === "ingredient"
      ? portalState.menu86IngredientName.trim()
      : affectedPreview.length === 1 ? affectedPreview[0].name : `${affectedPreview.length} menu items`;
    const menuItemIds = portalState.menu86Mode === "menuItem"
      ? affectedPreview.map((item) => item.id).filter(Boolean)
      : [];
    const expiresAtIso = Number(portalState.menu86DurationHours) > 0
      ? new Date(Date.now() + Number(portalState.menu86DurationHours) * 60 * 60 * 1000).toISOString()
      : null;
    const payload = await apiRequest("/operations/menu-86", {
      method: "POST",
      body: JSON.stringify({
        type: mode.backendValue,
        label,
        note: portalState.menu86Note.trim() || null,
        expiresAtIso,
        menuItemIds
      })
    });
    if (payload.outage) {
      portalState.menu86Outages = [payload.outage, ...portalState.menu86Outages.filter((outage) => menu86OutageId(outage) !== menu86OutageId(payload.outage))];
    }
    portalState.menu86IngredientName = "";
    portalState.menu86MenuSearchText = "";
    portalState.menu86SelectedMenuItemIds = new Set();
    portalState.menu86Note = "";
  } catch (error) {
    portalState.menu86Error = `Could not save 86: ${error instanceof Error ? error.message : String(error)}`;
  } finally {
    portalState.menu86Saving = false;
    renderMenu86Board();
  }
}

async function resolvePortalMenu86Outage(outageId) {
  if (!outageId || portalState.menu86ResolvingId) {
    return;
  }
  portalState.menu86ResolvingId = outageId;
  portalState.menu86Error = "";
  renderMenu86Board();
  try {
    await apiRequest(`/operations/menu-86/${encodeURIComponent(outageId)}`, { method: "DELETE" });
    portalState.menu86Outages = portalState.menu86Outages.filter((outage) => menu86OutageId(outage) !== outageId);
  } catch (error) {
    portalState.menu86Error = `Could not clear 86: ${error instanceof Error ? error.message : String(error)}`;
  } finally {
    portalState.menu86ResolvingId = null;
    renderMenu86Board();
  }
}

async function logIn(email, password) {
  const payload = await apiRequest("/operations/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  portalState.session = payload.session;
  portalState.membership = payload.membership;
  portalState.business = payload.business;
  if (!portalState.membership || portalState.membership.status !== "active") {
    throw new Error("no_active_portal_access");
  }
  storeSession(payload.session);
}

async function refreshMembership() {
  const payload = await apiRequest("/operations/me/membership", { method: "GET" });
  portalState.membership = payload.membership;
  portalState.business = payload.business;
}

function isFullAccessRole(role) {
  return role === "owner" || role === "gm" || role === "manager";
}

function isAdminRole(role) {
  return role === "owner" || role === "gm";
}

function canAccessAdminAreas() {
  const membership = portalState.membership;
  return membership?.status === "active" && isAdminRole(membership.role);
}

function modulePermission(moduleKey) {
  const membership = portalState.membership;
  if (!membership || membership.status !== "active") {
    return { read: false, write: false };
  }
  if (isFullAccessRole(membership.role)) {
    return { read: true, write: true };
  }
  const permission = membership.permissions?.[moduleKey];
  return {
    read: permission?.read === true || permission?.write === true,
    write: permission?.write === true
  };
}

function renderShell() {
  if (!loginScreen || !portalApp) {
    throw new Error("portal_shell_missing");
  }
  document.body.classList.add("portal-authenticated");
  loginScreen.hidden = true;
  loginScreen.setAttribute("aria-hidden", "true");
  portalApp.hidden = false;
  portalApp.removeAttribute("hidden");
  portalApp.removeAttribute("aria-hidden");
  portalApp.style.display = "grid";
  const businessName = portalState.business?.name || "Tavra restaurant";
  const role = portalState.membership?.role || "member";
  if (businessSummary) {
    businessSummary.textContent = `${businessName} · ${roleLabel(role)} access`;
  }
  if (roleChip) {
    roleChip.textContent = portalState.membership?.status === "active"
      ? `${roleLabel(role)} · active`
      : "No active access";
  }
  sectionButtons.forEach((button) => {
    const section = button.dataset.section || "";
    const adminOnly = adminOnlySections.has(section);
    button.hidden = adminOnly && !canAccessAdminAreas();
    button.disabled = adminOnly && !canAccessAdminAreas();
  });
  setActiveSection(requestedPortalSection() || portalState.section);
}

function requestedPortalSection() {
  const section = new URLSearchParams(window.location.search).get("section") || window.location.hash.replace(/^#/, "");
  return [
    "onboarding",
    "configure",
    "operations",
    "reservations",
    "foodOrders",
    "callLogs",
    "voicemail",
    "waitList",
    "menu86",
    "team",
    "settings"
  ].includes(section)
    ? section
    : null;
}

function roleLabel(role) {
  const labels = {
    owner: "Owner",
    gm: "GM",
    manager: "Manager",
    employee: "Team member"
  };
  return labels[role] || "Team member";
}

function setActiveSection(section) {
  if (adminOnlySections.has(section) && !canAccessAdminAreas()) {
    portalState.section = section;
    document.body.classList.toggle("portal-admin-page", false);
    sectionButtons.forEach((button) => {
      button.classList.toggle("active", false);
    });
    renderAdminAccessDenied(section);
    return;
  }
  if (portalState.section === "voicemail" && section !== "voicemail") {
    stopPortalVoicemail();
  }
  if (portalState.section === "foodOrders" && section !== "foodOrders") {
    stopPortalFoodOrdersLiveQuery();
  }
  if (portalState.section === "reservations" && section !== "reservations") {
    stopPortalReservationsLiveQuery();
  }
  if (portalState.section === "callLogs" && section !== "callLogs") {
    stopPortalCallLogsLiveQuery();
    stopPortalCallLogsPolling();
  }
  portalState.section = section;
  document.body.classList.toggle("portal-reservations-page", section === "reservations");
  document.body.classList.toggle("portal-food-orders-page", section === "foodOrders");
  document.body.classList.toggle("portal-call-logs-page", section === "callLogs");
  document.body.classList.toggle("portal-voicemail-page", section === "voicemail");
  document.body.classList.toggle("portal-wait-list-page", section === "waitList");
  document.body.classList.toggle("portal-menu86-page", section === "menu86");
  document.body.classList.toggle("portal-admin-page", section === "onboarding" || section === "configure");
  const sidebarSection = ["reservations", "foodOrders", "callLogs", "voicemail", "waitList", "menu86"].includes(section) ? "operations" : section;
  sectionButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.section === sidebarSection);
  });
  if (section === "onboarding") {
    renderOnboardingAdmin();
    if (!portalState.adminSettingsLoaded && !portalState.adminSettingsLoading) {
      void loadPortalAdminSettings();
    }
    return;
  }
  if (section === "configure") {
    renderConfigureAdmin();
    if (!portalState.adminSettingsLoaded && !portalState.adminSettingsLoading) {
      void loadPortalAdminSettings();
    }
    return;
  }
  if (section === "operations") {
    renderOperations();
    return;
  }
  if (section === "foodOrders") {
    renderFoodOrdersInbox();
    if (!portalState.foodOrdersLoaded && !portalState.foodOrdersLoading) {
      void loadPortalFoodOrders();
    } else {
      void startPortalFoodOrdersLiveQuery();
    }
    return;
  }
  if (section === "callLogs") {
    renderCallLogsInbox();
    startPortalCallLogsPolling();
    if (!portalState.callLogsLoaded && !portalState.callLogsLoading) {
      void loadPortalCallLogs();
    } else {
      void startPortalCallLogsLiveQuery();
    }
    return;
  }
  if (section === "voicemail") {
    renderVoicemailInbox();
    if (!portalState.voicemailsLoaded && !portalState.voicemailsLoading) {
      void loadPortalVoicemails();
    }
    return;
  }
  if (section === "waitList") {
    renderWaitListStatus();
    if (!portalState.waitStatusLoaded && !portalState.waitStatusLoading) {
      void loadPortalWaitStatus();
    }
    return;
  }
  if (section === "menu86") {
    renderMenu86Board();
    if (!portalState.menu86Loaded && !portalState.menu86Loading) {
      void loadPortalMenu86Board();
    }
    return;
  }
  if (section === "reservations") {
    renderReservationsBook();
    if (!portalState.reservationsLoaded && !portalState.reservationsLoading) {
      void loadPortalReservations();
    } else {
      void startPortalReservationsLiveQuery();
    }
    return;
  }
  renderPlaceholderSection(section);
}

function renderOperations() {
  if (!portalContent || !pageTitle || !pageKicker) {
    return;
  }
  pageTitle.textContent = "Operations";
  pageKicker.textContent = "Operations";
  const activeModule = operationModules.find((module) => module.key === portalState.activeModule) || operationModules[0];
  portalContent.innerHTML = `
    <div class="operations-layout">
      <div class="operations-grid">
        ${operationModules.map(renderOperationTile).join("")}
      </div>
      ${renderModuleDetail(activeModule)}
    </div>
  `;
  portalContent.querySelectorAll("[data-operation-module]").forEach((button) => {
    button.addEventListener("click", () => {
      const moduleKey = button.dataset.operationModule || "foodOrders";
      portalState.activeModule = moduleKey;
      const permission = modulePermission(moduleKey);
      if (permission.read && moduleKey === "foodOrders") {
        setActiveSection("foodOrders");
        return;
      }
      if (permission.read && moduleKey === "callLogs") {
        setActiveSection("callLogs");
        return;
      }
      if (permission.read && moduleKey === "voicemail") {
        setActiveSection("voicemail");
        return;
      }
      if (permission.read && moduleKey === "waitList") {
        setActiveSection("waitList");
        return;
      }
      if (permission.read && moduleKey === "menu86") {
        setActiveSection("menu86");
        return;
      }
      if (permission.read && moduleKey === "reservations") {
        setActiveSection("reservations");
        return;
      }
      renderOperations();
    });
  });
}

function renderOperationTile(module) {
  const permission = modulePermission(module.key);
  const active = portalState.activeModule === module.key;
  return `
    <button
      class="glass-tile ${permission.read ? "" : "locked"}"
      type="button"
      data-module="${module.key}"
      data-operation-module="${module.key}"
      aria-pressed="${active ? "true" : "false"}"
    >
      <span class="tile-meta">
        <span>${escapeHTML(module.status)}</span>
      </span>
      <span class="tile-icon" aria-hidden="true">${module.icon}</span>
      <strong>${escapeHTML(module.label)}</strong>
    </button>
  `;
}

function renderModuleDetail(module) {
  const permission = modulePermission(module.key);
  const accessCopy = permission.write
    ? "This account can read and update this module."
    : permission.read
      ? "This account can view this module but cannot make changes."
      : "This account does not currently have access to this module.";

  return `
    <article class="detail-panel">
      <p class="eyebrow blue">${escapeHTML(module.status)}</p>
      <h2>${escapeHTML(module.label)}</h2>
      <p>${escapeHTML(module.description)}</p>
      <p>${escapeHTML(accessCopy)}</p>
      <div class="permission-grid" aria-label="${escapeHTML(module.label)} permissions">
        <span class="permission-pill ${permission.read ? "on" : ""}">Read ${permission.read ? "on" : "off"}</span>
        <span class="permission-pill ${permission.write ? "on" : ""}">Write ${permission.write ? "on" : "off"}</span>
      </div>
      ${module.key === "reservations" ? renderReservationPreview() : ""}
    </article>
  `;
}

function renderReservationPreview() {
  const previewReservations = portalState.reservations
    .slice()
    .sort((a, b) => {
      const aStart = reservationStartDate(a)?.getTime() || 0;
      const bStart = reservationStartDate(b)?.getTime() || 0;
      return bStart - aStart;
    })
    .slice(0, 4);
  return `
    <div class="reservation-preview" aria-label="Reservations timeline preview">
      <div class="reservation-preview-bar">
        <span>Native book</span>
        <span>${portalState.reservationsLoaded ? `${portalState.reservations.length} loaded` : "Open Reservations to load"}</span>
      </div>
      ${previewReservations.length ? `
        <div class="reservation-timeline">
          <div class="reservation-row">
            ${previewReservations.map((reservation) => `
              <span class="reservation-chip ${escapeHTML(reservationStatusClass(reservation.status))}">
                ${escapeHTML(reservation.guestName || "Unknown guest")} · ${escapeHTML(reservationStatusNote(reservation))}
              </span>
            `).join("")}
          </div>
        </div>
      ` : `
        <div class="reservation-preview-empty">
          The full Reservations page loads live Tavra reservation records for this restaurant.
        </div>
      `}
    </div>
  `;
}

function renderReservationsBook() {
  if (!portalContent || !pageTitle || !pageKicker) {
    return;
  }
  pageTitle.textContent = "Reservations";
  pageKicker.textContent = "Operations";
  const model = buildReservationTimelineModel();
  const dateLabel = formatReservationDateHeading(model.selectedDateKey);
  const statusMessage = portalState.reservationLoadError
    ? `<div class="reservation-book-status error">Reservations failed to load: ${escapeHTML(portalState.reservationLoadError)}</div>`
    : portalState.reservationsLoading
      ? `<div class="reservation-book-status">Loading reservations from Tavra Operations...</div>`
      : model.allDateReservationsCount === 0
        ? `<div class="reservation-book-status">No reservations found for ${escapeHTML(dateLabel)}.</div>`
        : "";
  const canWriteReservations = modulePermission("reservations").write;
  portalContent.innerHTML = `
    <section class="reservation-book" aria-labelledby="reservation-book-title">
      <div class="reservation-workspace">
        <div class="reservation-book-top">
          <h1 id="reservation-book-title">Reservations</h1>
          <div class="reservation-top-actions">
            <button class="reservation-action dark" type="button" data-reservation-refresh>
              <span aria-hidden="true">◷</span>
              <span>Refresh</span>
            </button>
            <button class="reservation-action blue" type="button" data-reservation-add ${canWriteReservations ? "" : "disabled"}>
              <span aria-hidden="true">+</span>
              <span>Add reservation</span>
            </button>
          </div>
        </div>

        <div class="reservation-controls-row">
          <div class="reservation-view-switch" aria-label="Reservation view">
            <button class="${portalState.reservationViewMode === "timeline" ? "active" : ""}" type="button" data-reservation-view="timeline"><span aria-hidden="true">☷</span> Timeline</button>
            <button type="button"><span aria-hidden="true">☰</span> List</button>
            <button type="button"><span aria-hidden="true">▦</span> Table</button>
          </div>

          <div class="reservation-date-controls">
            <button class="date-step" type="button" aria-label="Previous day" data-reservation-date-step="-1">‹</button>
            <button class="date-pill" type="button" data-reservation-calendar>
              <span aria-hidden="true">▣</span>
              <span>${escapeHTML(dateLabel)}</span>
              <span aria-hidden="true">⌄</span>
            </button>
            <button class="today-pill" type="button" data-reservation-today>Today</button>
            <button class="date-step" type="button" aria-label="Next day" data-reservation-date-step="1">›</button>
          </div>

          <div class="reservation-status-legend" aria-label="Reservation status legend">
            ${renderReservationLegendItem("confirmed", "Confirmed")}
            ${renderReservationLegendItem("requested", "Requested")}
            ${renderReservationLegendItem("declined", "Declined")}
            ${renderReservationLegendItem("cancelled", "Cancelled")}
          </div>
        </div>

        ${renderServiceWindowPicker(model)}

        ${statusMessage}

        ${portalState.reservationViewMode === "calendar" ? renderReservationCalendar(model) : renderReservationTimeline(model, dateLabel)}

        <div class="reservation-bottom-row">
          <article class="reservation-night-card">
            <div>
              <h2>Night Overview</h2>
              <strong>${model.coversReserved} / ${model.totalCapacity}</strong>
              <span>Covers Reserved</span>
            </div>
            <div class="reservation-progress" style="--reservation-progress-offset: ${model.progressOffset};" aria-label="${model.totalPercent} percent of total capacity">
              <svg viewBox="0 0 90 90" aria-hidden="true">
                <circle cx="45" cy="45" r="35"></circle>
                <circle class="progress" cx="45" cy="45" r="35"></circle>
              </svg>
              <b>${model.totalPercent}%</b>
              <span>of total capacity</span>
            </div>
          </article>

          <article class="reservation-hour-card" aria-label="Hourly reservation capacity">
            ${model.hourlyCapacity.map(renderReservationHourCapacity).join("")}
          </article>

          <article class="reservation-legend-card">
            <h2>Legend</h2>
            <p><span aria-hidden="true">♧</span> Max ${model.settings.maxCoversPerSlot} covers / ${model.settings.slotMinutes} min</p>
            <p><span aria-hidden="true">♧</span> Max ${model.settings.maxPartiesPerSlot} parties / ${model.settings.slotMinutes} min</p>
          </article>
        </div>

        <p class="reservation-timezone">All times shown in ${escapeHTML(model.settings.timezone)}</p>
      </div>
      ${renderAddReservationModal(model)}
      ${renderReservationDetailModal(model)}
      ${renderReservationCheckInModal()}
    </section>
  `;
  wireReservationBookEvents(model);
}

function renderServiceWindowPicker(model) {
  if (model.serviceWindows.length <= 1) {
    return "";
  }
  return `
    <div class="reservation-service-switch" aria-label="Bookable service windows">
      ${model.serviceWindows.map((window) => `
        <button
          type="button"
          class="${window.key === model.selectedWindow?.key ? "active" : ""}"
          data-reservation-service="${escapeHTML(window.key)}"
        >
          ${escapeHTML(window.label)}
          <span>${escapeHTML(formatReservationTime(window.start))}–${escapeHTML(formatReservationTime(window.end))}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function renderReservationTimeline(model, dateLabel) {
  return `
    <div
      class="reservation-timeline-card"
      style="--timeline-slot-count: ${model.slotLabels.length}; --timeline-row-count: ${model.rowCount};"
      aria-label="Reservation timeline for ${escapeHTML(dateLabel)}"
    >
      <div class="reservation-head-row time-row">
        <div class="reservation-label-cell">Time</div>
        <div class="reservation-slot-head">
          ${model.slotLabels.map(renderReservationTimeSlot).join("")}
        </div>
      </div>
      <div class="reservation-head-row capacity-row">
        <div class="reservation-label-cell">Max Covers / Slot</div>
        <div class="reservation-capacity-cells">
          ${model.slotLabels.map(() => `<span>${model.settings.maxCoversPerSlot}</span>`).join("")}
        </div>
      </div>
      <div class="reservation-head-row capacity-row parties-row">
        <div class="reservation-label-cell">Max Parties / Slot</div>
        <div class="reservation-capacity-cells">
          ${model.slotLabels.map(() => `<span>${model.settings.maxPartiesPerSlot}</span>`).join("")}
        </div>
      </div>

      <div class="reservation-grid-area">
        ${model.showNow ? `
          <div class="reservation-now-line" style="--now: ${model.nowSlot};" aria-label="Current time ${escapeHTML(model.nowLabel)}">
            <span>${escapeHTML(model.nowLabel)}</span>
          </div>
        ` : ""}
        ${model.events.map(renderReservationEvent).join("")}
      </div>
    </div>
  `;
}

function renderReservationTimeSlot(label) {
  const [time, meridiem] = label.split(" ");
  return `
    <span>
      <strong>${escapeHTML(time)}</strong>
      <em>${escapeHTML(meridiem)}</em>
    </span>
  `;
}

function renderReservationLegendItem(status, label) {
  return `
    <span>
      <i class="legend-dot ${escapeHTML(status)}" aria-hidden="true"></i>
      ${escapeHTML(label)}
    </span>
  `;
}

function renderReservationEvent(event) {
  const nameSize = reservationNameFontSize(event.name);
  const flags = Array.isArray(event.flags) && event.flags.length
    ? `<em class="reservation-event-flags">${event.flags.slice(0, 3).map((flag) => `<b>${escapeHTML(flag)}</b>`).join("")}</em>`
    : "";
  return `
    <button
      type="button"
      class="reservation-event ${escapeHTML(event.status)} load-${escapeHTML(event.pressureTone)} state-${escapeHTML(event.rawStatusClass)} ${flags ? "has-arrival-notes" : ""}"
      style="--start: ${event.start}; --span: ${event.span}; --row: ${event.row}; --reservation-name-size: ${nameSize}px;"
      data-reservation-detail="${escapeHTML(event.id)}"
      aria-label="${escapeHTML(event.name)} ${escapeHTML(event.rawStatus)} reservation"
    >
      <strong>${escapeHTML(event.name)}</strong>
      <span>
        <i aria-hidden="true">♟</i>
        ${escapeHTML(event.note)}
      </span>
      ${flags}
    </button>
  `;
}

function renderReservationHourCapacity(item) {
  return `
    <div class="reservation-hour-item">
      <span>${escapeHTML(item.time)}</span>
      <strong>${escapeHTML(item.count)}</strong>
      <div class="reservation-mini-bar ${escapeHTML(item.tone)}">
        <i style="width: ${item.percent}%;"></i>
      </div>
      <em>${item.percent}%</em>
    </div>
  `;
}

function reservationNameFontSize(name) {
  const length = String(name || "").length;
  if (length <= 10) {
    return 16;
  }
  if (length <= 16) {
    return 15;
  }
  if (length <= 24) {
    return 13.5;
  }
  if (length <= 34) {
    return 12;
  }
  return 11;
}

function calendarMonthKeyForDateKey(dateKey) {
  return String(dateKey || dateKeyForToday()).slice(0, 7);
}

function offsetCalendarMonthKey(monthKey, offsetMonths) {
  const [year, month] = String(monthKey || calendarMonthKeyForDateKey(dateKeyForToday())).split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + offsetMonths, 1, 12, 0, 0));
  return date.toISOString().slice(0, 7);
}

function formatCalendarMonthHeading(monthKey) {
  const [year, month] = String(monthKey || calendarMonthKeyForDateKey(dateKeyForToday())).split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1, 12, 0, 0));
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "long",
    year: "numeric"
  }).format(date);
}

function reservationStatusCountsForDate(dateKey) {
  return reservationsForDateKey(dateKey).reduce((counts, reservation) => {
    const status = reservationStatusClass(reservation.status);
    counts[status] = (counts[status] || 0) + 1;
    counts.total += 1;
    counts.covers += Number(reservation.partySize || 0);
    return counts;
  }, { total: 0, covers: 0, confirmed: 0, requested: 0, declined: 0, cancelled: 0 });
}

function renderReservationCalendar(model) {
  const settings = model.settings;
  const monthKey = portalState.reservationCalendarMonthKey || calendarMonthKeyForDateKey(model.selectedDateKey);
  const [year, month] = monthKey.split("-").map(Number);
  const firstOfMonth = new Date(Date.UTC(year, month - 1, 1, 12, 0, 0));
  const gridStart = new Date(Date.UTC(year, month - 1, 1 - firstOfMonth.getUTCDay(), 12, 0, 0));
  const cells = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setUTCDate(gridStart.getUTCDate() + index);
    return date.toISOString().slice(0, 10);
  });
  return `
    <div class="reservation-calendar-card" aria-label="Reservation calendar">
      <div class="reservation-calendar-header">
        <button type="button" class="date-step" data-reservation-month-step="-1" aria-label="Previous month">‹</button>
        <h2>${escapeHTML(formatCalendarMonthHeading(monthKey))}</h2>
        <button type="button" class="date-step" data-reservation-month-step="1" aria-label="Next month">›</button>
      </div>
      <div class="reservation-calendar-weekdays">
        ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => `<span>${day}</span>`).join("")}
      </div>
      <div class="reservation-calendar-grid">
        ${cells.map((dateKey) => renderReservationCalendarDay(dateKey, monthKey, model.selectedDateKey, settings)).join("")}
      </div>
    </div>
  `;
}

function renderReservationCalendarDay(dateKey, monthKey, selectedDateKey, settings) {
  const counts = reservationStatusCountsForDate(dateKey);
  const serviceWindows = serviceWindowsForDateKey(dateKey, settings);
  const outside = calendarMonthKeyForDateKey(dateKey) !== monthKey;
  const selected = dateKey === selectedDateKey;
  const [, , day] = dateKey.split("-");
  const dots = ["confirmed", "requested", "declined", "cancelled"]
    .filter((status) => counts[status] > 0)
    .map((status) => `<i class="legend-dot ${status}" aria-label="${status} reservations"></i>`)
    .join("");
  return `
    <button
      type="button"
      class="reservation-calendar-day ${outside ? "outside" : ""} ${selected ? "selected" : ""} ${serviceWindows.length ? "" : "closed"}"
      data-reservation-calendar-day="${escapeHTML(dateKey)}"
      aria-label="${escapeHTML(formatReservationDateHeading(dateKey))}, ${counts.total} reservations"
    >
      <span class="day-number">${Number(day)}</span>
      <strong>${counts.total ? `${counts.total} res` : serviceWindows.length ? "Open" : "Closed"}</strong>
      <em>${counts.covers ? `${counts.covers} covers` : serviceWindows.map((window) => window.label).join(" / ")}</em>
      <span class="calendar-dots">${dots}</span>
    </button>
  `;
}

function findReservationById(reservationId) {
  return portalState.reservations.find((reservation) => reservation.objectId === reservationId) || null;
}

function formatReservationDateTime(reservation) {
  const start = reservationStartDate(reservation);
  if (!start) {
    return "No time set";
  }
  const dateKey = reservationDateKey(start);
  return `${formatReservationDateHeading(dateKey)} at ${formatReservationTime(reservationMinutesOfDay(start))}`;
}

function reservationArrivalNoteEntries(reservation) {
  return [
    reservation.allergies ? `Allergy: ${reservation.allergies}` : "",
    reservation.highChairRequest ? "Setup: High chair requested" : "",
    reservation.boosterSeatRequest ? "Setup: Booster seat requested" : "",
    reservation.specialRequests ? `Seating: ${reservation.specialRequests}` : "",
    reservation.occasion ? `Occasion: ${reservation.occasion}` : "",
    reservation.notes ? `Notes: ${reservation.notes}` : ""
  ]
    .map((value) => String(value || "").trim())
    .filter(Boolean);
}

function reservationArrivalNotesText(reservation) {
  return reservationArrivalNoteEntries(reservation).join("\n");
}

function reservationArrivalFlags(reservation) {
  return [
    reservation.allergies ? "Allergy" : "",
    reservation.highChairRequest || reservation.boosterSeatRequest ? "Setup" : "",
    reservation.specialRequests ? "Seating" : "",
    reservation.occasion ? "Occasion" : "",
    reservation.notes ? "Notes" : ""
  ].filter(Boolean);
}

function reservationNotesText(reservation) {
  const notes = [
    ...reservationArrivalNoteEntries(reservation),
    reservation.internalStaffNote ? `Staff note: ${reservation.internalStaffNote}` : ""
  ]
    .map((value) => String(value || "").trim())
    .filter(Boolean);
  return notes.length ? notes.join("\n") : "No notes on this reservation.";
}

function formatNorthAmericanPhone(value) {
  const digits = String(value || "").replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "").slice(0, 10);
  if (!digits) {
    return "";
  }
  if (digits.length <= 3) {
    return `(${digits}`;
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatNorthAmericanPhoneInput(value) {
  return formatNorthAmericanPhone(value);
}

function phoneForSubmit(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }
  return String(value || "").trim();
}

function reservationPhoneDisplay(reservation) {
  const value = reservation?.callbackNumber || reservation?.callerPhoneNumber || "";
  return formatNorthAmericanPhone(value) || String(value || "").trim() || "Not captured";
}

function reservationDateKeyForForm(reservation) {
  const start = reservationStartDate(reservation);
  return start ? reservationDateKey(start) : dateKeyForToday();
}

function reservationTimeValueForForm(reservation) {
  const start = reservationStartDate(reservation);
  return start ? minutesToInputTime(reservationMinutesOfDay(start)) : "";
}

function reservationEditDraftFromReservation(reservation) {
  return {
    guestName: reservation?.guestName || "",
    callerPhoneNumber: reservationPhoneDisplay(reservation) === "Not captured" ? "" : reservationPhoneDisplay(reservation),
    dateKey: reservationDateKeyForForm(reservation),
    timeValue: reservationTimeValueForForm(reservation),
    partySize: String(reservation?.partySize || 1),
    notes: reservation?.notes || ""
  };
}

function renderAddReservationModal(model) {
  if (!portalState.reservationFormOpen) {
    return "";
  }
  const settings = model.settings;
  const dateKey = portalState.reservationFormDateKey || model.selectedDateKey || dateKeyForToday();
  const timeOptions = reservationTimeOptionsForDate(dateKey);
  const defaultPartySize = Math.max(settings.minPartySize, Math.min(2, settings.maxPartySize));
  return `
    <div class="reservation-modal-backdrop" role="presentation">
      <form class="reservation-modal reservation-form-modal" data-reservation-create-form aria-label="Add reservation">
        <div class="reservation-modal-head">
          <div>
            <p class="eyebrow blue">Native book</p>
            <h2>Add reservation</h2>
          </div>
          <button type="button" class="reservation-modal-close" data-reservation-modal-close aria-label="Close">×</button>
        </div>
        <div class="reservation-form-grid">
          <label>
            <span>Reservation name</span>
            <input name="guestName" type="text" autocomplete="name" required>
          </label>
          <label>
            <span>Callback phone</span>
            <input name="callerPhoneNumber" type="tel" inputmode="tel" autocomplete="tel" data-reservation-phone required>
          </label>
          <label>
            <span>Date</span>
            <input name="dateKey" type="date" value="${escapeHTML(dateKey)}" data-reservation-form-date required>
          </label>
          <label>
            <span>Time</span>
            <select name="timeValue" required ${timeOptions.length ? "" : "disabled"}>
              ${timeOptions.length
                ? timeOptions.map((option) => `<option value="${escapeHTML(option.value)}">${escapeHTML(option.label)}</option>`).join("")
                : `<option value="">No bookable times</option>`}
            </select>
          </label>
          <label>
            <span>Party size</span>
            <input name="partySize" type="number" min="${settings.minPartySize}" max="${settings.maxPartySize}" value="${defaultPartySize}" required>
          </label>
          <label class="wide">
            <span>Notes</span>
            <textarea name="notes" rows="4" placeholder="Occasion, allergies, seating notes, special requests..."></textarea>
          </label>
        </div>
        ${portalState.reservationFormError ? `<p class="reservation-modal-error">${escapeHTML(portalState.reservationFormError)}</p>` : ""}
        <div class="reservation-modal-actions">
          <button type="button" class="reservation-action dark" data-reservation-modal-close>Cancel</button>
          <button type="submit" class="reservation-action blue" ${portalState.reservationFormSaving || !timeOptions.length ? "disabled" : ""}>
            ${portalState.reservationFormSaving ? "Adding..." : "Add reservation"}
          </button>
        </div>
      </form>
    </div>
  `;
}

function renderReservationDetailModal() {
  const reservation = portalState.reservationDetailId ? findReservationById(portalState.reservationDetailId) : null;
  if (!reservation) {
    return "";
  }
  const canWrite = modulePermission("reservations").write;
  const isEditing = canWrite && portalState.reservationDetailEditing;
  const draft = portalState.reservationDetailDraft || reservationEditDraftFromReservation(reservation);
  const editDateKey = draft.dateKey || portalState.reservationDetailEditDateKey || reservationDateKeyForForm(reservation);
  const editTimeValue = draft.timeValue || reservationTimeValueForForm(reservation);
  const editTimeOptions = reservationTimeOptionsForDate(editDateKey);
  return `
    <div class="reservation-modal-backdrop" role="presentation">
      <${isEditing ? "form" : "article"} class="reservation-modal reservation-detail-modal" ${isEditing ? "data-reservation-edit-form" : ""} aria-label="Reservation details">
        <div class="reservation-modal-head">
          <div>
            <p class="eyebrow blue">${escapeHTML(reservation.status || "requested")}</p>
            <h2>${escapeHTML(reservation.guestName || "Unknown guest")}</h2>
          </div>
          <button type="button" class="reservation-modal-close" data-reservation-detail-close aria-label="Close">×</button>
        </div>
        ${isEditing ? `
          <div class="reservation-form-grid">
            <label>
              <span>Reservation name</span>
              <input name="guestName" type="text" autocomplete="name" value="${escapeHTML(draft.guestName || "")}" data-reservation-edit-input required>
            </label>
            <label>
              <span>Callback phone</span>
              <input name="callerPhoneNumber" type="tel" inputmode="tel" autocomplete="tel" value="${escapeHTML(draft.callerPhoneNumber || "")}" data-reservation-phone data-reservation-edit-input required>
            </label>
            <label>
              <span>Date</span>
              <input name="dateKey" type="date" value="${escapeHTML(editDateKey)}" data-reservation-edit-date required>
            </label>
            <label>
              <span>Time</span>
              <select name="timeValue" data-reservation-edit-input required ${editTimeOptions.length ? "" : "disabled"}>
                ${editTimeOptions.length
                  ? editTimeOptions.map((option) => `<option value="${escapeHTML(option.value)}" ${option.value === editTimeValue ? "selected" : ""}>${escapeHTML(option.label)}</option>`).join("")
                  : `<option value="">No bookable times</option>`}
              </select>
            </label>
            <label>
              <span>Party size</span>
              <input name="partySize" type="number" min="${reservationSettings().minPartySize}" max="${reservationSettings().maxPartySize}" value="${escapeHTML(draft.partySize || 1)}" data-reservation-edit-input required>
            </label>
            <label class="wide">
              <span>Notes</span>
              <textarea name="notes" rows="5" placeholder="Occasion, allergies, seating notes, special requests..." data-reservation-edit-input>${escapeHTML(draft.notes || "")}</textarea>
            </label>
          </div>
        ` : `
          <div class="reservation-detail-grid">
            <p><span>When</span><strong>${escapeHTML(formatReservationDateTime(reservation))}</strong></p>
            <p><span>Party</span><strong>${escapeHTML(reservation.partySize || 1)} guests</strong></p>
            <p><span>Phone</span><strong>${escapeHTML(reservationPhoneDisplay(reservation))}</strong></p>
            <p><span>Source</span><strong>${escapeHTML(reservation.source || "Tavra")}</strong></p>
          </div>
          <div class="reservation-note-box">
            <span>Arrival notes</span>
            <p>${escapeHTML(reservationNotesText(reservation)).replaceAll("\n", "<br>")}</p>
          </div>
        `}
        ${portalState.reservationDetailError ? `<p class="reservation-modal-error">${escapeHTML(portalState.reservationDetailError)}</p>` : ""}
        <div class="reservation-modal-actions">
          ${isEditing ? `
            <button type="button" class="reservation-action dark" data-reservation-edit-cancel>Cancel</button>
            <button type="submit" class="reservation-action blue" ${portalState.reservationDetailSaving || !editTimeOptions.length ? "disabled" : ""}>
              ${portalState.reservationDetailSaving ? "Saving..." : "Save changes"}
            </button>
          ` : `
            <button type="button" class="reservation-action dark" data-reservation-detail-close>Close</button>
            <button type="button" class="reservation-action blue" data-reservation-edit ${canWrite && !portalState.reservationDetailSaving ? "" : "disabled"}>Edit</button>
            <button type="button" class="reservation-action green" data-reservation-status="checked_in" ${canWrite && !portalState.reservationDetailSaving ? "" : "disabled"}>Check in</button>
            <button type="button" class="reservation-action danger" data-reservation-status="no_show" ${canWrite && !portalState.reservationDetailSaving ? "" : "disabled"}>No-show</button>
          `}
        </div>
      </${isEditing ? "form" : "article"}>
    </div>
  `;
}

function renderReservationCheckInModal() {
  if (!portalState.reservationCheckInPrompt) {
    return "";
  }
  const prompt = portalState.reservationCheckInPrompt;
  return `
    <div class="reservation-modal-backdrop" role="presentation">
      <article class="reservation-modal reservation-note-modal" aria-label="Arrival notes">
        <div class="reservation-modal-head">
          <div>
            <p class="eyebrow blue">Arrival notes</p>
            <h2>${escapeHTML(prompt.guestName)}</h2>
          </div>
          <button type="button" class="reservation-modal-close" data-reservation-checkin-cancel aria-label="Close">×</button>
        </div>
        <div class="reservation-note-box large arrival">
          <span>Review before check-in</span>
          <p>${escapeHTML(prompt.notes).replaceAll("\n", "<br>")}</p>
        </div>
        <div class="reservation-modal-actions">
          <button type="button" class="reservation-action dark" data-reservation-checkin-cancel>Cancel</button>
          <button type="button" class="reservation-action green" data-reservation-checkin-confirm ${portalState.reservationDetailSaving ? "disabled" : ""}>
            ${portalState.reservationDetailSaving ? "Checking in..." : "Check in"}
          </button>
        </div>
      </article>
    </div>
  `;
}

function replaceReservation(reservation) {
  if (!reservation?.objectId) {
    return;
  }
  const index = portalState.reservations.findIndex((item) => item.objectId === reservation.objectId);
  if (index >= 0) {
    portalState.reservations.splice(index, 1, reservation);
  } else {
    portalState.reservations.push(reservation);
  }
}

function updateReservationEditDraftFromForm(form) {
  const formData = new FormData(form);
  portalState.reservationDetailDraft = {
    guestName: String(formData.get("guestName") || ""),
    callerPhoneNumber: String(formData.get("callerPhoneNumber") || ""),
    dateKey: String(formData.get("dateKey") || ""),
    timeValue: String(formData.get("timeValue") || ""),
    partySize: String(formData.get("partySize") || ""),
    notes: String(formData.get("notes") || "")
  };
}

async function createPortalReservation(form) {
  portalState.reservationFormSaving = true;
  portalState.reservationFormError = "";
  renderReservationsBook();
  const formData = new FormData(form);
  const guestName = String(formData.get("guestName") || "").trim();
  const callerPhoneNumber = phoneForSubmit(formData.get("callerPhoneNumber"));
  const dateKey = String(formData.get("dateKey") || "").trim();
  const timeValue = String(formData.get("timeValue") || "").trim();
  const partySize = Number(formData.get("partySize") || 0);
  const notes = String(formData.get("notes") || "").trim();
  try {
    if (!guestName || !callerPhoneNumber || !dateKey || !timeValue || !Number.isInteger(partySize)) {
      throw new Error("Fill in the reservation name, phone, date, time, and party size.");
    }
    const requestedAtIso = zonedDateTimeToUtc(dateKey, timeValue).toISOString();
    const payload = await apiRequest("/operations/reservations", {
      method: "POST",
      body: JSON.stringify({
        guestName,
        callerPhoneNumber,
        requestedAtIso,
        partySize,
        notes,
        rawCallerText: "Created manually in Tavra web portal.",
        createdBy: "owner_web_portal"
      })
    });
    replaceReservation(payload.reservation);
    portalState.reservationSelectedDateKey = dateKey;
    portalState.reservationSelectedServiceKey = null;
    portalState.reservationFormOpen = false;
    portalState.reservationFormDateKey = null;
  } catch (error) {
    portalState.reservationFormError = error instanceof Error ? error.message : String(error);
  } finally {
    portalState.reservationFormSaving = false;
    renderReservationsBook();
  }
}

async function updatePortalReservation(form) {
  const reservationId = portalState.reservationDetailId;
  if (!reservationId) {
    return;
  }
  portalState.reservationDetailSaving = true;
  portalState.reservationDetailError = "";
  renderReservationsBook();
  const formData = new FormData(form);
  const guestName = String(formData.get("guestName") || "").trim();
  const callerPhoneNumber = phoneForSubmit(formData.get("callerPhoneNumber"));
  const dateKey = String(formData.get("dateKey") || "").trim();
  const timeValue = String(formData.get("timeValue") || "").trim();
  const partySize = Number(formData.get("partySize") || 0);
  const notes = String(formData.get("notes") || "").trim();
  try {
    if (!guestName || !callerPhoneNumber || !dateKey || !timeValue || !Number.isInteger(partySize)) {
      throw new Error("Fill in the reservation name, phone, date, time, and party size.");
    }
    const requestedAtIso = zonedDateTimeToUtc(dateKey, timeValue).toISOString();
    const payload = await apiRequest(`/operations/reservations/${encodeURIComponent(reservationId)}`, {
      method: "PUT",
      body: JSON.stringify({
        guestName,
        callerPhoneNumber,
        requestedAtIso,
        partySize,
        notes
      })
    });
    replaceReservation(payload.reservation);
    portalState.reservationSelectedDateKey = dateKey;
    portalState.reservationSelectedServiceKey = null;
    portalState.reservationDetailEditing = false;
    portalState.reservationDetailEditDateKey = null;
    portalState.reservationDetailDraft = null;
  } catch (error) {
    portalState.reservationDetailError = error instanceof Error ? error.message : String(error);
  } finally {
    portalState.reservationDetailSaving = false;
    renderReservationsBook();
  }
}

async function updatePortalReservationStatus(status, options = {}) {
  const reservationId = portalState.reservationDetailId;
  if (!reservationId) {
    return;
  }
  const reservation = findReservationById(reservationId);
  const arrivalNotes = reservation ? reservationArrivalNotesText(reservation) : "";
  if (status === "checked_in" && arrivalNotes && !options.skipArrivalPrompt) {
    portalState.reservationCheckInPrompt = {
      reservationId,
      guestName: reservation?.guestName || "Guest",
      notes: arrivalNotes
    };
    portalState.reservationDetailError = "";
    renderReservationsBook();
    return;
  }
  portalState.reservationDetailSaving = true;
  portalState.reservationDetailError = "";
  renderReservationsBook();
  try {
    const payload = await apiRequest(`/operations/reservations/${encodeURIComponent(reservationId)}/status`, {
      method: "PUT",
      body: JSON.stringify({ status })
    });
    replaceReservation(payload.reservation);
    portalState.reservationCheckInPrompt = null;
    portalState.reservationDetailId = null;
  } catch (error) {
    portalState.reservationDetailError = error instanceof Error ? error.message : String(error);
  } finally {
    portalState.reservationDetailSaving = false;
    renderReservationsBook();
  }
}

function wireReservationBookEvents(model) {
  portalContent.querySelector("[data-reservation-refresh]")?.addEventListener("click", () => {
    void loadPortalReservations();
  });
  portalContent.querySelector("[data-reservation-add]")?.addEventListener("click", () => {
    portalState.reservationFormOpen = true;
    portalState.reservationFormDateKey = model.selectedDateKey;
    portalState.reservationFormError = "";
    renderReservationsBook();
  });
  portalContent.querySelectorAll("[data-reservation-date-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const offset = Number(button.dataset.reservationDateStep || 0);
      portalState.reservationSelectedDateKey = offsetDateKey(model.selectedDateKey, offset);
      portalState.reservationSelectedServiceKey = null;
      portalState.reservationViewMode = "timeline";
      renderReservationsBook();
    });
  });
  portalContent.querySelector("[data-reservation-calendar]")?.addEventListener("click", () => {
    portalState.reservationViewMode = portalState.reservationViewMode === "calendar" ? "timeline" : "calendar";
    portalState.reservationCalendarMonthKey = calendarMonthKeyForDateKey(model.selectedDateKey);
    renderReservationsBook();
  });
  portalContent.querySelector("[data-reservation-today]")?.addEventListener("click", () => {
    portalState.reservationSelectedDateKey = dateKeyForToday();
    portalState.reservationSelectedServiceKey = null;
    portalState.reservationViewMode = "timeline";
    renderReservationsBook();
  });
  portalContent.querySelectorAll("[data-reservation-view]").forEach((button) => {
    button.addEventListener("click", () => {
      portalState.reservationViewMode = button.dataset.reservationView || "timeline";
      renderReservationsBook();
    });
  });
  portalContent.querySelectorAll("[data-reservation-service]").forEach((button) => {
    button.addEventListener("click", () => {
      portalState.reservationSelectedServiceKey = button.dataset.reservationService || null;
      portalState.reservationViewMode = "timeline";
      renderReservationsBook();
    });
  });
  portalContent.querySelectorAll("[data-reservation-month-step]").forEach((button) => {
    button.addEventListener("click", () => {
      portalState.reservationCalendarMonthKey = offsetCalendarMonthKey(portalState.reservationCalendarMonthKey, Number(button.dataset.reservationMonthStep || 0));
      renderReservationsBook();
    });
  });
  portalContent.querySelectorAll("[data-reservation-calendar-day]").forEach((button) => {
    button.addEventListener("click", () => {
      portalState.reservationSelectedDateKey = button.dataset.reservationCalendarDay || dateKeyForToday();
      portalState.reservationSelectedServiceKey = null;
      portalState.reservationViewMode = "timeline";
      renderReservationsBook();
    });
  });
  portalContent.querySelectorAll("[data-reservation-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      portalState.reservationDetailId = button.dataset.reservationDetail || null;
      portalState.reservationDetailEditing = false;
      portalState.reservationDetailEditDateKey = null;
      portalState.reservationDetailDraft = null;
      portalState.reservationDetailError = "";
      renderReservationsBook();
    });
  });
  portalContent.querySelector("[data-reservation-create-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    void createPortalReservation(event.currentTarget);
  });
  portalContent.querySelector("[data-reservation-form-date]")?.addEventListener("change", (event) => {
    portalState.reservationFormDateKey = event.currentTarget.value || dateKeyForToday();
    renderReservationsBook();
  });
  portalContent.querySelector("[data-reservation-edit-date]")?.addEventListener("change", (event) => {
    const form = event.currentTarget.closest("form");
    if (form) {
      updateReservationEditDraftFromForm(form);
    }
    const dateKey = event.currentTarget.value || dateKeyForToday();
    const timeOptions = reservationTimeOptionsForDate(dateKey);
    portalState.reservationDetailEditDateKey = dateKey;
    portalState.reservationDetailDraft = {
      ...(portalState.reservationDetailDraft || {}),
      dateKey,
      timeValue: timeOptions.some((option) => option.value === portalState.reservationDetailDraft?.timeValue)
        ? portalState.reservationDetailDraft.timeValue
        : (timeOptions[0]?.value || "")
    };
    renderReservationsBook();
  });
  portalContent.querySelector("[data-reservation-phone]")?.addEventListener("input", (event) => {
    event.currentTarget.value = formatNorthAmericanPhoneInput(event.currentTarget.value);
  });
  portalContent.querySelectorAll("[data-reservation-edit-input]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const form = event.currentTarget.closest("form");
      if (form) {
        updateReservationEditDraftFromForm(form);
      }
    });
    input.addEventListener("change", (event) => {
      const form = event.currentTarget.closest("form");
      if (form) {
        updateReservationEditDraftFromForm(form);
      }
    });
  });
  portalContent.querySelector("[data-reservation-edit-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    void updatePortalReservation(event.currentTarget);
  });
  portalContent.querySelectorAll("[data-reservation-modal-close]").forEach((button) => {
    button.addEventListener("click", () => {
      portalState.reservationFormOpen = false;
      portalState.reservationFormError = "";
      renderReservationsBook();
    });
  });
  portalContent.querySelectorAll("[data-reservation-detail-close]").forEach((button) => {
    button.addEventListener("click", () => {
      portalState.reservationDetailId = null;
      portalState.reservationDetailEditing = false;
      portalState.reservationDetailEditDateKey = null;
      portalState.reservationDetailDraft = null;
      portalState.reservationDetailError = "";
      renderReservationsBook();
    });
  });
  portalContent.querySelector("[data-reservation-edit]")?.addEventListener("click", () => {
    const reservation = portalState.reservationDetailId ? findReservationById(portalState.reservationDetailId) : null;
    portalState.reservationDetailEditing = true;
    portalState.reservationDetailEditDateKey = reservation ? reservationDateKeyForForm(reservation) : dateKeyForToday();
    portalState.reservationDetailDraft = reservation ? reservationEditDraftFromReservation(reservation) : null;
    portalState.reservationDetailError = "";
    renderReservationsBook();
  });
  portalContent.querySelector("[data-reservation-edit-cancel]")?.addEventListener("click", () => {
    portalState.reservationDetailEditing = false;
    portalState.reservationDetailEditDateKey = null;
    portalState.reservationDetailDraft = null;
    portalState.reservationDetailError = "";
    renderReservationsBook();
  });
  portalContent.querySelectorAll("[data-reservation-status]").forEach((button) => {
    button.addEventListener("click", () => {
      void updatePortalReservationStatus(button.dataset.reservationStatus || "requested");
    });
  });
  portalContent.querySelectorAll("[data-reservation-checkin-cancel]").forEach((button) => {
    button.addEventListener("click", () => {
      portalState.reservationCheckInPrompt = null;
      portalState.reservationDetailError = "";
      renderReservationsBook();
    });
  });
  portalContent.querySelector("[data-reservation-checkin-confirm]")?.addEventListener("click", () => {
    const prompt = portalState.reservationCheckInPrompt;
    if (!prompt?.reservationId) {
      return;
    }
    portalState.reservationDetailId = prompt.reservationId;
    void updatePortalReservationStatus("checked_in", { skipArrivalPrompt: true });
  });
}

function renderFoodOrdersInbox() {
  if (!portalContent || !pageTitle || !pageKicker) {
    return;
  }
  pageTitle.textContent = "Food Orders";
  pageKicker.textContent = "Operations";

  const permission = modulePermission("foodOrders");
  if (!permission.read) {
    portalContent.innerHTML = `
      <section class="food-orders-page">
        <div class="food-orders-shell">
          <h1>Food Orders</h1>
          <article class="food-order-empty">This account does not currently have access to Food Orders.</article>
        </div>
      </section>
    `;
    return;
  }

  const activeFilter = foodOrderFilterForKey(portalState.foodOrderFilter);
  const filteredOrders = filteredFoodOrders(activeFilter.key);
  const statusMessage = portalState.foodOrdersError
    ? `<div class="food-order-status-message error">Food orders failed to load: ${escapeHTML(portalState.foodOrdersError)}</div>`
    : portalState.foodOrdersLoading && !portalState.foodOrdersLoaded
      ? `<div class="food-order-status-message">Loading food orders...</div>`
      : "";

  portalContent.innerHTML = `
    <section class="food-orders-page" aria-labelledby="food-orders-title">
      <div class="food-orders-shell">
        <div class="food-orders-top">
          <h1 id="food-orders-title">Food Orders</h1>
          <button class="food-order-refresh" type="button" data-food-order-refresh ${portalState.foodOrdersLoading ? "disabled" : ""}>
            <span aria-hidden="true">↻</span>
            <span>Refresh</span>
          </button>
        </div>

        <div class="food-order-metric-grid" aria-label="Food order filters">
          ${foodOrderFilters.map(renderFoodOrderMetric).join("")}
        </div>

        ${statusMessage}

        <div class="food-order-group">
          <h2>${escapeHTML(activeFilter.title)}</h2>
          ${filteredOrders.length
            ? filteredOrders.map((order) => renderFoodOrderCard(order, permission.write)).join("")
            : `<article class="food-order-empty">${escapeHTML(activeFilter.emptyText)}</article>`
          }
        </div>
      </div>
    </section>
  `;
  wireFoodOrdersEvents();
}

function renderFoodOrderMetric(filter) {
  const isSelected = portalState.foodOrderFilter === filter.key;
  const count = portalState.foodOrders.filter((order) => foodOrderMatchesFilter(order, filter.key)).length;
  return `
    <button
      class="food-order-metric ${filter.className} ${isSelected ? "selected" : ""}"
      type="button"
      data-food-order-filter="${escapeHTML(filter.key)}"
      aria-pressed="${isSelected ? "true" : "false"}"
    >
      <strong>${count}</strong>
      <span>${escapeHTML(filter.title)}</span>
    </button>
  `;
}

function renderFoodOrderCard(order, canWrite) {
  const orderId = foodOrderId(order);
  const expanded = portalState.expandedFoodOrderIds.has(orderId);
  const display = foodOrderStatusDisplay(order);
  const warnings = foodOrderWarnings(order);
  return `
    <article class="food-order-card ${display.kind === "needsAttention" ? "needs-attention" : ""}" data-food-order-card="${escapeHTML(orderId)}">
      <button class="food-order-card-main" type="button" data-food-order-toggle="${escapeHTML(orderId)}" aria-expanded="${expanded ? "true" : "false"}">
        <div class="food-order-card-head">
          <div>
            <strong>${escapeHTML(foodOrderPickupText(order))}</strong>
            <span>${escapeHTML(foodOrderCustomerLine(order))}</span>
          </div>
          <div class="food-order-card-actions">
            <span class="food-order-badge ${display.kind}">${escapeHTML(display.label)}</span>
            <span class="food-order-chevron" aria-hidden="true">${expanded ? "⌃" : "⌄"}</span>
          </div>
        </div>
        <div class="food-order-meta-row">
          <span>${escapeHTML(foodOrderItemCountText(order))}</span>
          ${foodOrderTotalText(order) ? `<span aria-hidden="true">·</span><span>${escapeHTML(foodOrderTotalText(order))}</span>` : ""}
        </div>
        ${foodOrderItemPreview(order) ? `<p class="food-order-preview">${escapeHTML(foodOrderItemPreview(order))}</p>` : ""}
        ${warnings.slice(0, 2).map((warning) => `<p class="food-order-warning">⚠ ${escapeHTML(warning)}</p>`).join("")}
      </button>
      ${expanded ? renderFoodOrderExpanded(order, canWrite) : ""}
    </article>
  `;
}

function renderFoodOrderExpanded(order, canWrite) {
  const items = foodOrderLineItems(order);
  const orderId = foodOrderId(order);
  const actions = foodOrderAvailableActions(order);
  const createdText = relativeFoodOrderTime(order.createdAt);
  const issue = order.kitchenPrint?.error || order.payment?.error || order.clover?.error || "";
  return `
    <div class="food-order-expanded">
      <div class="food-order-divider" aria-hidden="true"></div>

      <section>
        <h3>Line Items</h3>
        ${items.length ? items.map(renderFoodOrderLineItem).join("") : `<p class="food-order-muted">No line items recorded.</p>`}
      </section>

      ${String(order.orderSummaryText || "").trim() ? `
        <section>
          <h3>Order Notes</h3>
          <p class="food-order-muted">${escapeHTML(order.orderSummaryText)}</p>
        </section>
      ` : ""}

      <div class="food-order-detail-grid">
        ${renderFoodOrderDetail("Source", statusText(order.source || "voice_agent"))}
        ${createdText ? renderFoodOrderDetail("Created", createdText) : ""}
        ${order.payment?.status ? renderFoodOrderDetail("Payment", statusText(order.payment.status)) : ""}
        ${order.status !== "submission_followup_required" && (order.kitchenPrint?.status || order.kitchenPrint?.state)
          ? renderFoodOrderDetail("Printer", statusText(order.kitchenPrint.status || order.kitchenPrint.state))
          : ""
        }
        ${issue ? renderFoodOrderDetail("Issue", issue) : ""}
      </div>

      ${canWrite && actions.length ? `
        <section class="food-order-move-panel" aria-label="Move order">
          <h3>Move order</h3>
          <div class="food-order-action-row">
          ${actions.map((action) => `
            <button
              class="food-order-action ${action.kind || ""} ${action.role === "danger" ? "danger" : ""}"
              type="button"
              data-food-order-id="${escapeHTML(orderId)}"
              data-food-order-status="${escapeHTML(action.status)}"
              ${portalState.foodOrderUpdatingId === orderId ? "disabled" : ""}
            >
              ${escapeHTML(portalState.foodOrderUpdatingId === orderId ? "Updating..." : action.title)}
            </button>
          `).join("")}
          </div>
        </section>
      ` : ""}
    </div>
  `;
}

function renderFoodOrderLineItem(item) {
  const quantity = Math.max(1, finiteNumber(item.quantity, 1));
  const displayName = item.displayName || item.name || "Unknown item";
  const price = Number.isFinite(Number(item.unitPriceCents)) ? money(Number(item.unitPriceCents) * quantity) : "";
  const selectedModifiers = Array.isArray(item.selectedModifiers) ? item.selectedModifiers : [];
  const removedModifiers = Array.isArray(item.removedModifiers) ? item.removedModifiers : [];
  return `
    <div class="food-order-line-item">
      <div>
        <span>${quantity} ×</span>
        <strong>${escapeHTML(displayName)}</strong>
      </div>
      ${price ? `<em>${escapeHTML(price)}</em>` : ""}
      ${(selectedModifiers.length || removedModifiers.length) ? `
        <ul>
          ${selectedModifiers.map((modifier) => `<li>${escapeHTML(modifier.name || "Modifier")}</li>`).join("")}
          ${removedModifiers.map((modifier) => `<li>No ${escapeHTML(modifier.name || "modifier")}</li>`).join("")}
        </ul>
      ` : ""}
    </div>
  `;
}

function renderFoodOrderDetail(title, value) {
  return `
    <p>
      <span>${escapeHTML(title)}</span>
      <strong>${escapeHTML(value)}</strong>
    </p>
  `;
}

function wireFoodOrdersEvents() {
  portalContent.querySelector("[data-food-order-refresh]")?.addEventListener("click", () => {
    void loadPortalFoodOrders();
  });
  portalContent.querySelectorAll("[data-food-order-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      portalState.foodOrderFilter = button.dataset.foodOrderFilter || "active";
      renderFoodOrdersInbox();
    });
  });
  portalContent.querySelectorAll("[data-food-order-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const orderId = button.dataset.foodOrderToggle || "";
      if (portalState.expandedFoodOrderIds.has(orderId)) {
        portalState.expandedFoodOrderIds.delete(orderId);
      } else {
        portalState.expandedFoodOrderIds.add(orderId);
      }
      renderFoodOrdersInbox();
    });
  });
  portalContent.querySelectorAll("[data-food-order-status]").forEach((button) => {
    button.addEventListener("click", () => {
      void updatePortalFoodOrderStatus(button.dataset.foodOrderId || "", button.dataset.foodOrderStatus || "");
    });
  });
}

function foodOrderFilterForKey(key) {
  return foodOrderFilters.find((filter) => filter.key === key) || foodOrderFilters[0];
}

function filteredFoodOrders(filterKey) {
  return portalState.foodOrders
    .filter((order) => foodOrderMatchesFilter(order, filterKey))
    .sort(sortFoodOrders);
}

function foodOrderMatchesFilter(order, filterKey) {
  return foodOrderStatusDisplay(order).kind === filterKey;
}

function foodOrderStatusDisplay(order) {
  const raw = String(order.status || "needs_review");
  const printFailed = raw !== "submission_followup_required" &&
    (order.kitchenPrint?.status === "failed" || order.kitchenPrint?.state === "failed");
  const priceMissing = order.subtotalCents === null || order.subtotalCents === undefined;
  const isManualActiveStatus = raw === "confirmed";
  if (!isManualActiveStatus && (printFailed || priceMissing)) {
    return { kind: "needsAttention", label: "Needs Attention" };
  }
  if (["payment_pending", "payment_tokenized", "confirmed", "submitted", "sent_to_kitchen", "ready"].includes(raw)) {
    return { kind: "active", label: "Active" };
  }
  if (raw === "completed") {
    return { kind: "completed", label: "Completed" };
  }
  if (raw === "cancelled") {
    return { kind: "cancelled", label: "Cancelled" };
  }
  return { kind: "needsAttention", label: "Needs Attention" };
}

function foodOrderAvailableActions(order) {
  const kind = foodOrderStatusDisplay(order).kind;
  return [
    { title: "Active", status: "confirmed", kind: "active" },
    { title: "Needs Attention", status: "needs_review", kind: "needsAttention" },
    { title: "Completed", status: "completed", kind: "completed" },
    { title: "Cancelled", status: "cancelled", kind: "cancelled", role: "danger" }
  ].filter((action) => action.kind !== kind);
}

function sortFoodOrders(left, right) {
  const leftDate = parsePortalDate(left.submittedAt) || parsePortalDate(left.createdAt) || new Date(8640000000000000);
  const rightDate = parsePortalDate(right.submittedAt) || parsePortalDate(right.createdAt) || new Date(8640000000000000);
  return leftDate.getTime() - rightDate.getTime();
}

function foodOrderId(order) {
  return String(order.objectId || order.id || "");
}

function foodOrderLineItems(order) {
  return Array.isArray(order.orderItems) ? order.orderItems : [];
}

function foodOrderPickupText(order) {
  return order.submittedAt ? `Pickup ${clockTime(order.submittedAt)}` : "ASAP";
}

function foodOrderCustomerLine(order) {
  const name = String(order.callerName || "").trim();
  const phone = order.callerPhone ? formatNorthAmericanPhone(order.callerPhone) : "";
  return [name || null, phone || null].filter(Boolean).join(" · ") || "Unknown caller";
}

function foodOrderItemCountText(order) {
  const count = foodOrderLineItems(order).reduce((total, item) => total + Math.max(1, finiteNumber(item.quantity, 1)), 0);
  return count === 1 ? "1 item" : `${count} items`;
}

function foodOrderTotalText(order) {
  return Number.isFinite(Number(order.subtotalCents)) ? money(Number(order.subtotalCents)) : "";
}

function foodOrderItemPreview(order) {
  return foodOrderLineItems(order)
    .slice(0, 3)
    .map((item) => `${Math.max(1, finiteNumber(item.quantity, 1))} × ${item.displayName || item.name || "Unknown item"}`)
    .join(", ");
}

function foodOrderWarnings(order) {
  const warnings = [];
  switch (order.status) {
  case "draft":
    warnings.push("Caller hung up before confirmation");
    break;
  case "payment_failed":
    warnings.push("Payment failed");
    break;
  case "payment_followup_required":
    warnings.push("Payment follow-up required");
    break;
  case "submission_followup_required":
    warnings.push("Submission follow-up required");
    break;
  default:
    break;
  }
  if (order.status !== "submission_followup_required" && (order.kitchenPrint?.status === "failed" || order.kitchenPrint?.state === "failed")) {
    warnings.push("Kitchen print failed");
  }
  if (order.subtotalCents === null || order.subtotalCents === undefined) {
    warnings.push("Price unavailable");
  }
  return warnings;
}

function renderCallLogsInbox() {
  if (!portalContent || !pageTitle || !pageKicker) {
    return;
  }
  pageTitle.textContent = "Call Logs";
  pageKicker.textContent = "Operations";

  const permission = modulePermission("callLogs");
  if (!permission.read) {
    portalContent.innerHTML = `
      <section class="call-logs-page">
        <div class="call-logs-shell">
          <h1>Call Logs</h1>
          <article class="call-log-empty">This account does not currently have access to Call Logs.</article>
        </div>
      </section>
    `;
    return;
  }

  const selectedId = portalState.selectedCallLogId;
  const selectedDetail = selectedId ? portalState.callLogDetails.get(selectedId) : null;
  const selectedSummary = selectedId ? portalState.callLogs.find((call) => callLogId(call) === selectedId) : null;

  portalContent.innerHTML = `
    <section class="call-logs-page" aria-labelledby="call-logs-title">
      <div class="call-logs-shell">
        <div class="call-logs-top">
          <div>
            <h1 id="call-logs-title">Call Logs</h1>
            <p>Live and completed phone work, caller details, workflow outcomes, and full transcripts.</p>
          </div>
          <button class="call-log-refresh" type="button" data-call-log-refresh ${portalState.callLogsLoading ? "disabled" : ""}>
            <span aria-hidden="true">↻</span>
            <span>Refresh</span>
          </button>
        </div>

        ${portalState.callLogsError ? `<div class="call-log-status error">Call logs failed to load: ${escapeHTML(portalState.callLogsError)}</div>` : ""}

        <div class="call-logs-layout">
          <aside class="call-log-list" aria-label="Calls">
            ${portalState.callLogsLoading && !portalState.callLogsLoaded ? `<article class="call-log-empty">Loading call logs...</article>` : ""}
            ${sortedCallLogs().length
              ? sortedCallLogs().map(renderCallLogPreview).join("")
              : !portalState.callLogsLoading ? `<article class="call-log-empty">No call logs yet.</article>` : ""
            }
          </aside>
          <main class="call-log-detail-panel" aria-label="Call detail">
            ${selectedId
              ? renderCallLogDetail(selectedId, selectedDetail, selectedSummary)
              : renderCallLogNoSelection()
            }
          </main>
        </div>
      </div>
    </section>
  `;
  wireCallLogsEvents();
}

function renderCallLogPreview(call) {
  const id = callLogId(call);
  const selected = portalState.selectedCallLogId === id;
  const amount = Number.isFinite(Number(call.orderAmountCents)) ? money(Number(call.orderAmountCents)) : "";
  const live = isFreshLiveCall(call);
  return `
    <button class="call-log-row ${selected ? "selected" : ""} ${live ? "live" : ""}" type="button" data-call-log-select="${escapeHTML(id)}">
      <span class="call-log-row-main">
        <strong>
          ${live ? `<span class="call-log-live-dot" aria-hidden="true"></span>` : ""}
          ${escapeHTML(call.reason || "General call")}
        </strong>
        <em>${escapeHTML(call.fromNumber ? formatNorthAmericanPhone(call.fromNumber) : "Unknown caller")}</em>
      </span>
      <span class="call-log-row-metrics">
        <span class="call-log-metric blue">◷ ${escapeHTML(durationText(call.durationSeconds))}</span>
        <span class="call-log-metric ${live ? "green" : "mint"}">☎ ${escapeHTML(statusText(call.status || "unknown"))}</span>
        ${call.hasOrder ? `<span class="call-log-metric orange">▣ Order${amount ? ` · ${escapeHTML(amount)}` : ""}</span>` : ""}
      </span>
      <span class="call-log-row-foot">
        <span>${escapeHTML(call.transcriptTurnCount || 0)} turns</span>
        <span>${escapeHTML(relativePortalTime(call.startedAt))}</span>
      </span>
    </button>
  `;
}

function renderCallLogNoSelection() {
  return `
    <article class="call-log-no-selection">
      <span aria-hidden="true">☎</span>
      <h2>Select a call</h2>
      <p>Open a call log to inspect caller context, workflow status, order output, and the full transcript.</p>
    </article>
  `;
}

function renderCallLogDetail(callLogId, detail, summary) {
  const loading = portalState.callLogDetailLoadingId === callLogId;
  if (loading && !detail) {
    return `<article class="call-log-empty">Loading transcript...</article>`;
  }
  if (portalState.callLogDetailError && !detail) {
    return `<article class="call-log-empty error">Call detail failed to load: ${escapeHTML(portalState.callLogDetailError)}</article>`;
  }

  const source = detail || summary || {};
  const callSummary = detail?.summary || detail || summary || {};
  const transcript = Array.isArray(detail?.transcript) ? detail.transcript : [];
  const order = detail?.order || {};
  const callerPhone = detail?.callerPhone || order.callerPhone || callSummary.fromNumber;
  const orderItems = callLogOrderItems(detail);
  const live = isFreshLiveCall(callSummary);
  return `
    <article class="call-log-detail-card">
      <div class="call-log-detail-head">
        <button class="call-log-back" type="button" data-call-log-back>‹ Calls</button>
        <div>
          <p class="call-log-kicker">Call Detail</p>
          <h2>${escapeHTML(callSummary.reason || source.reason || "General call")}</h2>
          <span>${escapeHTML(relativePortalTime(callSummary.startedAt || source.startedAt))}</span>
        </div>
      </div>

      ${portalState.callLogDetailError ? `<div class="call-log-status error">${escapeHTML(portalState.callLogDetailError)}</div>` : ""}

      ${live ? `
        <section class="call-log-live-banner">
          <span class="call-log-live-dot" aria-hidden="true"></span>
          <div>
            <strong>Live call</strong>
            <p>Transcript updates as Tavra captures each turn.</p>
          </div>
        </section>
      ` : ""}

      <section class="call-log-section">
        <h3>Call</h3>
        <div class="call-log-detail-grid">
          ${renderCallLogDetailMetric("Caller", callerPhone ? formatNorthAmericanPhone(callerPhone) : "Unknown")}
          ${renderCallLogDetailMetric("Duration", durationText(callSummary.durationSeconds))}
          ${renderCallLogDetailMetric("Status", statusText(callSummary.status || "unknown"))}
          ${Number.isFinite(Number(callSummary.orderAmountCents)) ? renderCallLogDetailMetric("Order Amount", money(Number(callSummary.orderAmountCents))) : ""}
          ${callSummary.orderStatus ? renderCallLogDetailMetric("Order Status", statusText(callSummary.orderStatus)) : ""}
          ${detail?.paymentStatus || order.payment?.status ? renderCallLogDetailMetric("Payment", statusText(detail?.paymentStatus || order.payment.status)) : ""}
          ${detail?.kitchenPrintStatus || order.kitchenPrint?.status || order.kitchenPrint?.state ? renderCallLogDetailMetric("Kitchen Print", statusText(detail?.kitchenPrintStatus || order.kitchenPrint?.status || order.kitchenPrint?.state)) : ""}
          ${detail?.kitchenPrintDetail ? renderCallLogDetailMetric("Print Detail", detail.kitchenPrintDetail) : ""}
        </div>
      </section>

      ${(callSummary.hasOrder || orderItems.length || detail?.orderSummaryText || order.orderSummaryText) ? `
        <section class="call-log-section">
          <h3>Order</h3>
          ${String(detail?.orderSummaryText || order.orderSummaryText || "").trim()
            ? `<p class="call-log-order-summary">${escapeHTML(detail?.orderSummaryText || order.orderSummaryText)}</p>`
            : ""
          }
          ${orderItems.length ? `
            <ul class="call-log-order-items">
              ${orderItems.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
            </ul>
          ` : ""}
        </section>
      ` : ""}

      <section class="call-log-section">
        <h3>Transcript</h3>
        ${transcript.length
          ? `<div class="call-log-transcript">${transcript.map(renderCallLogTranscriptTurn).join("")}</div>`
          : `<p class="call-log-muted">${loading ? "Loading transcript..." : "No transcript turns were captured."}</p>`
        }
      </section>
    </article>
  `;
}

function renderCallLogDetailMetric(title, value) {
  return `
    <p>
      <span>${escapeHTML(title)}</span>
      <strong>${escapeHTML(value)}</strong>
    </p>
  `;
}

function renderCallLogTranscriptTurn(turn, index) {
  const isCaller = turn.role === "user";
  return `
    <article class="call-log-turn ${isCaller ? "caller" : "agent"}">
      <div>
        <strong>${isCaller ? "Caller" : "Agent"}</strong>
        ${turn.at ? `<span>${escapeHTML(clockTime(turn.at))}</span>` : ""}
      </div>
      <p>${escapeHTML(turn.text || "")}</p>
      ${turn.actionType ? `<em>${escapeHTML(statusText(turn.actionType))}</em>` : ""}
    </article>
  `;
}

function wireCallLogsEvents() {
  portalContent.querySelector("[data-call-log-refresh]")?.addEventListener("click", () => {
    void loadPortalCallLogs();
  });
  portalContent.querySelectorAll("[data-call-log-select]").forEach((button) => {
    button.addEventListener("click", () => {
      const callLogId = button.dataset.callLogSelect || "";
      portalState.selectedCallLogId = callLogId;
      renderCallLogsInbox();
      if (callLogId && !portalState.callLogDetails.has(callLogId)) {
        void loadPortalCallLogDetail(callLogId);
      }
    });
  });
  portalContent.querySelector("[data-call-log-back]")?.addEventListener("click", () => {
    portalState.selectedCallLogId = null;
    portalState.callLogDetailError = "";
    renderCallLogsInbox();
  });
}

function sortedCallLogs() {
  return portalState.callLogs.slice().sort((left, right) => {
    const leftDate = parsePortalDate(left.startedAt || left.createdAt)?.getTime() || 0;
    const rightDate = parsePortalDate(right.startedAt || right.createdAt)?.getTime() || 0;
    return rightDate - leftDate;
  });
}

function callLogId(call) {
  return String(call?.objectId || call?.id || "");
}

function callLogOrderItems(detail) {
  if (!detail) {
    return [];
  }
  if (Array.isArray(detail.orderItems)) {
    return detail.orderItems.map((item) => String(item || "")).filter(Boolean);
  }
  const items = Array.isArray(detail.order?.orderItems) ? detail.order.orderItems : [];
  return items.map((item) => {
    const quantity = Math.max(1, finiteNumber(item.quantity, 1));
    const name = item.displayName || item.name || "Unknown item";
    return `${quantity}x ${name}`;
  });
}

function renderVoicemailInbox() {
  if (!portalContent || !pageTitle || !pageKicker) {
    return;
  }
  pageTitle.textContent = "Voicemail";
  pageKicker.textContent = "Operations";

  const permission = modulePermission("voicemail");
  if (!permission.read) {
    portalContent.innerHTML = `
      <section class="voicemail-page">
        <div class="voicemail-shell">
          <h1>Voicemail</h1>
          <article class="voicemail-empty">This account does not currently have access to Voicemail.</article>
        </div>
      </section>
    `;
    return;
  }

  portalContent.innerHTML = `
    <section class="voicemail-page" aria-labelledby="voicemail-title">
      <div class="voicemail-shell">
        <div class="voicemail-top">
          <h1 id="voicemail-title">Voicemail</h1>
          <button class="voicemail-refresh" type="button" data-voicemail-refresh ${portalState.voicemailsLoading ? "disabled" : ""}>
            <span aria-hidden="true">↻</span>
            <span>Refresh</span>
          </button>
        </div>
        ${portalState.voicemailsError ? `<div class="voicemail-status error">${escapeHTML(portalState.voicemailsError)}</div>` : ""}
        <div class="voicemail-list">
          ${portalState.voicemailsLoading && !portalState.voicemailsLoaded ? `<article class="voicemail-empty">Loading voicemail...</article>` : ""}
          ${sortedVoicemails().length
            ? sortedVoicemails().map(renderVoicemailPreviewRow).join("")
            : !portalState.voicemailsLoading ? `<article class="voicemail-empty">No voicemail yet.</article>` : ""
          }
        </div>
      </div>
    </section>
  `;
  wireVoicemailEvents();
}

function renderVoicemailPreviewRow(voicemail) {
  const id = voicemailId(voicemail);
  const isPlaying = portalState.voicemailPlayingId === id;
  const isLoading = portalState.voicemailLoadingAudioId === id;
  const recordedAt = voicemail.voicemailRecordedAt || voicemail.startedAt;
  return `
    <article class="voicemail-row">
      <button class="voicemail-play" type="button" data-voicemail-play="${escapeHTML(id)}" aria-label="${isPlaying ? "Pause voicemail" : "Play voicemail"}">
        <span aria-hidden="true">${isLoading ? "…" : isPlaying ? "⏸" : "▶"}</span>
      </button>
      <div class="voicemail-row-body">
        <div class="voicemail-row-head">
          <strong>${escapeHTML(voicemail.fromNumber ? formatNorthAmericanPhone(voicemail.fromNumber) : "Unknown caller")}</strong>
          <span>${escapeHTML(relativePortalTime(recordedAt))}</span>
        </div>
        <p>${escapeHTML(voicemail.reason || "Voicemail")}</p>
        <div class="voicemail-meta">
          <span>〰 ${escapeHTML(durationText(voicemail.voicemailDurationSeconds))}</span>
          ${voicemail.routeLabel ? `<span>↱ ${escapeHTML(voicemail.routeLabel)}</span>` : ""}
        </div>
      </div>
    </article>
  `;
}

function wireVoicemailEvents() {
  portalContent.querySelector("[data-voicemail-refresh]")?.addEventListener("click", () => {
    void loadPortalVoicemails();
  });
  portalContent.querySelectorAll("[data-voicemail-play]").forEach((button) => {
    button.addEventListener("click", () => {
      void playOrStopPortalVoicemail(button.dataset.voicemailPlay || "");
    });
  });
}

function sortedVoicemails() {
  return portalState.voicemails.slice().sort((left, right) => {
    const leftDate = parsePortalDate(left.voicemailRecordedAt || left.startedAt || left.createdAt)?.getTime() || 0;
    const rightDate = parsePortalDate(right.voicemailRecordedAt || right.startedAt || right.createdAt)?.getTime() || 0;
    return rightDate - leftDate;
  });
}

function voicemailId(voicemail) {
  return String(voicemail?.objectId || voicemail?.id || "");
}

function renderWaitListStatus() {
  if (!portalContent || !pageTitle || !pageKicker) {
    return;
  }
  pageTitle.textContent = "Wait List";
  pageKicker.textContent = "Operations";

  const permission = modulePermission("waitList");
  if (!permission.read) {
    portalContent.innerHTML = `
      <section class="wait-list-page">
        <div class="wait-list-shell">
          <h1>Wait List</h1>
          <article class="wait-list-empty">This account does not currently have access to Wait List.</article>
        </div>
      </section>
    `;
    return;
  }

  const status = portalState.waitStatus || defaultWaitStatus();
  portalContent.innerHTML = `
    <section class="wait-list-page" aria-labelledby="wait-list-title">
      <div class="wait-list-shell">
        <div class="wait-list-top">
          <div>
            <h1 id="wait-list-title">Wait List</h1>
            <p>Set a fresh host quote, or let Tavra answer from the reservation book when no fresh quote is available.</p>
          </div>
          <button class="wait-list-refresh" type="button" data-wait-list-refresh ${portalState.waitStatusLoading ? "disabled" : ""}>
            <span aria-hidden="true">↻</span>
            <span>Refresh</span>
          </button>
        </div>

        ${portalState.waitStatusLoading && !portalState.waitStatusLoaded ? `<article class="wait-list-empty">Loading wait status...</article>` : ""}
        ${portalState.waitStatusMessage ? `
          <div class="wait-list-status ${portalState.waitStatusIsError ? "error" : ""}">
            ${escapeHTML(portalState.waitStatusMessage)}
          </div>
        ` : ""}

        ${renderWaitListSourceModeSection(status, permission.write)}
        ${renderWaitListHostStatusSection(status, permission.write)}
        ${renderWaitListReservationEstimateSection(status)}
      </div>
    </section>
  `;
  wireWaitListEvents();
}

function renderWaitListSourceModeSection(status, canWrite) {
  return `
    <article class="wait-list-card">
      <h2>Agent Source</h2>
      <p>Accuracy order: fresh host quote first, then reservation book estimate, then manually configured category text.</p>
      <div class="wait-list-grid">
        ${waitListSourceModes.map((mode) => `
          <button
            class="wait-list-option ${status.sourceMode === mode.key ? "selected" : ""}"
            type="button"
            data-wait-source="${escapeHTML(mode.key)}"
            ${canWrite && !portalState.waitStatusSaving ? "" : "disabled"}
          >
            <strong>${escapeHTML(mode.title)}</strong>
            <span>${escapeHTML(mode.subtitle)}</span>
          </button>
        `).join("")}
      </div>
    </article>
  `;
}

function renderWaitListHostStatusSection(status, canWrite) {
  const freshness = waitListFreshness(status);
  return `
    <article class="wait-list-card">
      <div class="wait-list-card-head">
        <h2>Host Quote</h2>
        <div>
          <strong class="${freshness.isFresh ? "fresh" : "expired"}">${escapeHTML(freshness.label)}</strong>
          ${freshness.lastUpdated ? `<span>${escapeHTML(freshness.lastUpdated)}</span>` : ""}
        </div>
      </div>
      <p>${escapeHTML(waitListHostStatusText(status))}</p>
      <div class="wait-list-grid">
        ${waitListHostOptions.map((option, index) => `
          <button
            class="wait-list-option compact ${waitListHostOptionSelected(status, option) ? "selected" : ""}"
            type="button"
            data-wait-host-option="${index}"
            ${canWrite && !portalState.waitStatusSaving ? "" : "disabled"}
          >
            <strong>${escapeHTML(option.title)}</strong>
          </button>
        `).join("")}
      </div>
      <button
        class="wait-list-clear"
        type="button"
        data-wait-clear-host
        ${canWrite && !portalState.waitStatusSaving && status.hostStatus ? "" : "disabled"}
      >
        ⓧ Clear host quote
      </button>
    </article>
  `;
}

function renderWaitListReservationEstimateSection(status) {
  return `
    <article class="wait-list-card">
      <h2>Reservation Book Estimate</h2>
      <p>${escapeHTML(waitListReservationEstimateText(status))}</p>
    </article>
  `;
}

function wireWaitListEvents() {
  portalContent.querySelector("[data-wait-list-refresh]")?.addEventListener("click", () => {
    void loadPortalWaitStatus();
  });
  portalContent.querySelectorAll("[data-wait-source]").forEach((button) => {
    button.addEventListener("click", () => {
      savePortalWaitSourceMode(button.dataset.waitSource || "automatic");
    });
  });
  portalContent.querySelectorAll("[data-wait-host-option]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.waitHostOption);
      const option = waitListHostOptions[index];
      if (option) {
        setPortalHostWaitStatus(option);
      }
    });
  });
  portalContent.querySelector("[data-wait-clear-host]")?.addEventListener("click", clearPortalHostWaitStatus);
}

function defaultWaitStatus() {
  return {
    sourceMode: "automatic",
    staleAfterMinutes: 30,
    hostStatus: null,
    reservationEstimate: null,
    updatedAt: null
  };
}

function waitListFreshness(status) {
  const hostStatus = status?.hostStatus;
  if (!hostStatus?.updatedAt) {
    return { label: "Not set", isFresh: false, lastUpdated: "" };
  }
  const updatedAt = parsePortalDate(hostStatus.updatedAt);
  const expiresAt = parsePortalDate(hostStatus.expiresAt);
  const fallbackExpiresAt = updatedAt
    ? new Date(updatedAt.getTime() + finiteNumber(status?.staleAfterMinutes, 30) * 60 * 1000)
    : null;
  const effectiveExpiresAt = expiresAt || fallbackExpiresAt;
  const isFresh = effectiveExpiresAt ? Date.now() <= effectiveExpiresAt.getTime() : false;
  return {
    label: isFresh ? "Fresh" : "Expired",
    isFresh,
    lastUpdated: updatedAt ? `Updated ${relativePortalTime(updatedAt.toISOString())}` : ""
  };
}

function waitListHostStatusText(status) {
  const hostStatus = status?.hostStatus;
  if (!hostStatus) {
    return "No host quote is set. In Automatic mode, Tavra will fall back to the reservation book estimate.";
  }
  let base = "No precise quote.";
  if (hostStatus.state === "no_wait") {
    base = "Currently no wait.";
  } else if (hostStatus.state === "quoted") {
    const min = finiteNumber(hostStatus.minMinutes, null);
    const max = finiteNumber(hostStatus.maxMinutes, null);
    if (min !== null && max !== null && min !== max) {
      base = `Currently ${min}-${max} minutes.`;
    } else if (max !== null || min !== null) {
      base = `Currently about ${max ?? min} minutes.`;
    } else {
      base = "A wait quote is set.";
    }
  } else if (hostStatus.state === "long_wait") {
    base = "Currently a long wait.";
  } else if (hostStatus.state === "not_accepting_walk_ins") {
    base = "Currently not accepting walk-ins.";
  }
  return [base, hostStatus.note].filter(Boolean).join(" ");
}

function waitListHostOptionSelected(status, option) {
  const hostStatus = status?.hostStatus;
  if (!hostStatus || hostStatus.state !== option.state) {
    return false;
  }
  if (option.state !== "quoted") {
    return true;
  }
  return Number(hostStatus.minMinutes) === Number(option.minMinutes) &&
    Number(hostStatus.maxMinutes) === Number(option.maxMinutes);
}

function waitListReservationEstimateText(status) {
  const estimate = status?.reservationEstimate;
  if (!estimate) {
    return "No reservation pressure estimate is available yet. This appears when Tavra can read the native reservation book.";
  }
  const level = statusText(estimate.level || "unknown").toLowerCase();
  return `Current estimate: ${level}. Next ${finiteNumber(estimate.windowMinutes, 0)} minutes: ${finiteNumber(estimate.activeReservations, 0)} reservations, ${finiteNumber(estimate.activeCovers, 0)} covers.`;
}

function money(cents) {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

function parsePortalDate(value) {
  return parseReservationDateValue(value);
}

function clockTime(value) {
  const date = parsePortalDate(value);
  if (!date) {
    return "";
  }
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(date);
}

function durationText(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value < 0) {
    return "Unknown";
  }
  const wholeSeconds = Math.round(value);
  const minutes = Math.floor(wholeSeconds / 60);
  const remainingSeconds = wholeSeconds % 60;
  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }
  return `${minutes}m ${remainingSeconds}s`;
}

function relativeFoodOrderTime(value) {
  return relativePortalTime(value);
}

function relativePortalTime(value) {
  const date = parsePortalDate(value);
  if (!date) {
    return "";
  }
  const diffMs = Date.now() - date.getTime();
  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;
  if (Math.abs(diffMs) < minuteMs) {
    return "Just now";
  }
  if (Math.abs(diffMs) < hourMs) {
    const minutes = Math.round(diffMs / minuteMs);
    return `${Math.abs(minutes)} minute${Math.abs(minutes) === 1 ? "" : "s"} ${minutes >= 0 ? "ago" : "from now"}`;
  }
  if (Math.abs(diffMs) < dayMs) {
    const hours = Math.round(diffMs / hourMs);
    return `${Math.abs(hours)} hour${Math.abs(hours) === 1 ? "" : "s"} ${hours >= 0 ? "ago" : "from now"}`;
  }
  const days = Math.round(diffMs / dayMs);
  return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ${days >= 0 ? "ago" : "from now"}`;
}

function statusText(raw) {
  return String(raw || "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeCallStatus(raw) {
  const normalized = String(raw || "").trim().toLowerCase().replace(/\s+/g, "_");
  return normalized === "in-progress" ? "in_progress" : normalized;
}

function parsePortalDateMs(value) {
  if (!value) {
    return NaN;
  }
  const timestamp = Date.parse(String(value));
  return Number.isFinite(timestamp) ? timestamp : NaN;
}

function isFreshLiveCall(call) {
  if (!call || normalizeCallStatus(call.status) !== "in_progress" || call.endedAt) {
    return false;
  }
  const freshnessMs = Math.max(
    parsePortalDateMs(call.transcriptUpdatedAt),
    parsePortalDateMs(call.updatedAt),
    parsePortalDateMs(call.startedAt)
  );
  if (!Number.isFinite(freshnessMs)) {
    return false;
  }
  return Date.now() - freshnessMs <= 15 * 60 * 1000;
}

function renderMenu86Board() {
  if (!portalContent || !pageTitle || !pageKicker) {
    return;
  }
  pageTitle.textContent = "86 Board";
  pageKicker.textContent = "Operations";

  const permission = modulePermission("menu86");
  if (!permission.read) {
    portalContent.innerHTML = `
      <section class="menu86-page">
        <div class="menu86-shell">
          <h1>86 Board</h1>
          <article class="menu86-empty">This account does not currently have access to the 86 Board.</article>
        </div>
      </section>
    `;
    return;
  }

  portalContent.innerHTML = `
    <section class="menu86-page" aria-labelledby="menu86-title">
      <div class="menu86-shell">
        <div class="menu86-top">
          <h1 id="menu86-title">86 Board</h1>
          <button class="menu86-refresh" type="button" data-menu86-refresh ${portalState.menu86Loading ? "disabled" : ""}>
            <span aria-hidden="true">↻</span>
            <span>Refresh</span>
          </button>
        </div>
        ${renderMenu86ActiveOutages(permission.write)}
        ${renderMenu86Editor(permission.write)}
        ${portalState.menu86Error ? `<div class="menu86-error">${escapeHTML(portalState.menu86Error)}</div>` : ""}
      </div>
    </section>
  `;
  wireMenu86Events();
}

function renderMenu86ActiveOutages(canWrite) {
  const activeOutages = menu86ActiveOutages();
  return `
    <section class="menu86-active" aria-label="Active 86 items">
      <div class="menu86-section-head">
        <h2>Active now</h2>
        <span>${portalState.menu86Loading ? "Loading" : activeOutages.length}</span>
      </div>
      ${activeOutages.length ? activeOutages.map((outage) => renderMenu86OutageCard(outage, canWrite)).join("") : `
        <article class="menu86-empty">Nothing is 86'ed right now.</article>
      `}
    </section>
  `;
}

function renderMenu86OutageCard(outage, canWrite) {
  const outageId = menu86OutageId(outage);
  const affectedItems = Array.isArray(outage.affectedMenuItems) ? outage.affectedMenuItems : [];
  const affectedCount = Array.isArray(outage.affectedMenuItemIds) ? outage.affectedMenuItemIds.length : affectedItems.length;
  const isResolving = portalState.menu86ResolvingId === outageId;
  return `
    <article class="menu86-outage-card">
      <div class="menu86-outage-head">
        <strong>${escapeHTML(outage.label || "Unavailable")}</strong>
        <span>${escapeHTML(outage.type === "menu_item" ? "Menu item" : "Ingredient")}</span>
      </div>
      <p>${affectedCount} affected item${affectedCount === 1 ? "" : "s"}</p>
      ${affectedItems.length ? `<p class="menu86-outage-items">${escapeHTML(affectedItems.slice(0, 6).map((item) => item.name).join(", "))}</p>` : ""}
      ${outage.note ? `<p class="menu86-outage-note">${escapeHTML(outage.note)}</p>` : ""}
      ${canWrite ? `
        <button class="menu86-clear" type="button" data-menu86-resolve="${escapeHTML(outageId)}" ${isResolving ? "disabled" : ""}>
          ${escapeHTML(isResolving ? "Clearing..." : "Clear 86")}
        </button>
      ` : ""}
    </article>
  `;
}

function renderMenu86Editor(canWrite) {
  return `
    <section class="menu86-editor" aria-label="Add an 86">
      <div class="menu86-section-head">
        <h2>Add an 86</h2>
        <span class="${canWrite ? "write" : ""}">${canWrite ? "Writable" : "Read only"}</span>
      </div>

      <div class="menu86-mode-switch" role="group" aria-label="86 type">
        ${menu86Modes.map((mode) => `
          <button
            class="${portalState.menu86Mode === mode.key ? "active" : ""}"
            type="button"
            data-menu86-mode="${escapeHTML(mode.key)}"
            ${canWrite ? "" : "disabled"}
          >
            ${escapeHTML(mode.title)}
          </button>
        `).join("")}
      </div>

      ${portalState.menu86Mode === "ingredient" ? renderMenu86IngredientInput(canWrite) : renderMenu86MenuItemSelector(canWrite)}
      ${renderMenu86AffectedPreview()}

      <label class="menu86-label">
        <span>Duration</span>
        <select data-menu86-duration ${canWrite ? "" : "disabled"}>
          ${menu86DurationOptions.map((option) => `
            <option value="${option.hours}" ${Number(portalState.menu86DurationHours) === option.hours ? "selected" : ""}>
              ${escapeHTML(option.title)}
            </option>
          `).join("")}
        </select>
      </label>

      <label class="menu86-label">
        <span>Staff note</span>
        <textarea data-menu86-note rows="3" placeholder="Optional staff note" ${canWrite ? "" : "disabled"}>${escapeHTML(portalState.menu86Note)}</textarea>
      </label>

      <button class="menu86-submit" type="button" data-menu86-create ${canWrite && menu86CanCreate() ? "" : "disabled"}>
        ${portalState.menu86Saving ? "Saving..." : "⚠ Mark Unavailable"}
      </button>
    </section>
  `;
}

function renderMenu86IngredientInput(canWrite) {
  return `
    <label class="menu86-label">
      <span>Ingredient or modifier</span>
      <input
        data-menu86-ingredient
        type="text"
        value="${escapeHTML(portalState.menu86IngredientName)}"
        placeholder="Ingredient or modifier, like salmon or cilantro"
        ${canWrite ? "" : "disabled"}
      >
    </label>
  `;
}

function renderMenu86MenuItemSelector(canWrite) {
  const items = menu86FilteredMenuItems().slice(0, 30);
  return `
    <label class="menu86-label">
      <span>Search menu items</span>
      <input
        data-menu86-menu-search
        type="text"
        value="${escapeHTML(portalState.menu86MenuSearchText)}"
        placeholder="Search menu items"
        ${canWrite ? "" : "disabled"}
      >
    </label>
    <div class="menu86-menu-picker">
      ${items.length ? items.map((item) => renderMenu86MenuPickerRow(item, canWrite)).join("") : `<p>No menu items matched.</p>`}
    </div>
  `;
}

function renderMenu86MenuPickerRow(item, canWrite) {
  const selected = portalState.menu86SelectedMenuItemIds.has(item.id);
  return `
    <button class="menu86-menu-row ${selected ? "selected" : ""}" type="button" data-menu86-menu-item="${escapeHTML(item.id)}" ${canWrite ? "" : "disabled"}>
      <span aria-hidden="true">${selected ? "☑" : "☐"}</span>
      <span>
        <strong>${escapeHTML(item.name || "Unnamed item")}</strong>
        <em>${escapeHTML(menu86MenuItemSubtitle(item))}</em>
      </span>
    </button>
  `;
}

function renderMenu86AffectedPreview() {
  const affectedPreview = menu86AffectedPreview();
  return `
    <div class="menu86-affected">
      <h3>Affected dishes</h3>
      ${affectedPreview.length ? `
        ${affectedPreview.slice(0, 12).map((item) => `
          <div class="menu86-affected-row">
            <span>
              <strong>${escapeHTML(item.name || "Unnamed item")}</strong>
              ${item.category ? `<em>${escapeHTML(item.category)}</em>` : ""}
            </span>
            <b>${escapeHTML(moneyOrBlank(item.priceCents))}</b>
          </div>
        `).join("")}
        ${affectedPreview.length > 12 ? `<p class="menu86-more">+ ${affectedPreview.length - 12} more</p>` : ""}
      ` : `<p>${escapeHTML(menu86AffectedEmptyText())}</p>`}
    </div>
  `;
}

function wireMenu86Events() {
  portalContent.querySelector("[data-menu86-refresh]")?.addEventListener("click", () => {
    void loadPortalMenu86Board();
  });
  portalContent.querySelectorAll("[data-menu86-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      portalState.menu86Mode = button.dataset.menu86Mode || "menuItem";
      renderMenu86Board();
    });
  });
  portalContent.querySelector("[data-menu86-ingredient]")?.addEventListener("input", (event) => {
    portalState.menu86IngredientName = event.currentTarget.value;
    renderMenu86Board();
    focusMenu86TextInput("[data-menu86-ingredient]");
  });
  portalContent.querySelector("[data-menu86-menu-search]")?.addEventListener("input", (event) => {
    portalState.menu86MenuSearchText = event.currentTarget.value;
    renderMenu86Board();
    focusMenu86TextInput("[data-menu86-menu-search]");
  });
  portalContent.querySelectorAll("[data-menu86-menu-item]").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.menu86MenuItem || "";
      if (portalState.menu86SelectedMenuItemIds.has(itemId)) {
        portalState.menu86SelectedMenuItemIds.delete(itemId);
      } else {
        portalState.menu86SelectedMenuItemIds.add(itemId);
      }
      renderMenu86Board();
    });
  });
  portalContent.querySelector("[data-menu86-duration]")?.addEventListener("change", (event) => {
    portalState.menu86DurationHours = Number(event.currentTarget.value);
  });
  portalContent.querySelector("[data-menu86-note]")?.addEventListener("input", (event) => {
    portalState.menu86Note = event.currentTarget.value;
  });
  portalContent.querySelector("[data-menu86-create]")?.addEventListener("click", () => {
    void createPortalMenu86Outage();
  });
  portalContent.querySelectorAll("[data-menu86-resolve]").forEach((button) => {
    button.addEventListener("click", () => {
      void resolvePortalMenu86Outage(button.dataset.menu86Resolve || "");
    });
  });
}

function focusMenu86TextInput(selector) {
  requestAnimationFrame(() => {
    const input = portalContent.querySelector(selector);
    if (!(input instanceof HTMLInputElement)) {
      return;
    }
    input.focus();
    const end = input.value.length;
    input.setSelectionRange(end, end);
  });
}

function menu86ModeForKey(key) {
  return menu86Modes.find((mode) => mode.key === key) || menu86Modes[0];
}

function menu86OutageId(outage) {
  return String(outage.objectId || outage.id || "");
}

function menu86ActiveOutages() {
  return portalState.menu86Outages.filter((outage) => outage.status === "active");
}

function menu86CanCreate() {
  if (portalState.menu86Saving) {
    return false;
  }
  if (portalState.menu86Mode === "ingredient") {
    return portalState.menu86IngredientName.trim().length > 0 && menu86AffectedPreview().length > 0;
  }
  return portalState.menu86SelectedMenuItemIds.size > 0;
}

function menu86FilteredMenuItems() {
  const query = menu86Normalized(portalState.menu86MenuSearchText);
  if (!query) {
    return portalState.menu86MenuItems;
  }
  return portalState.menu86MenuItems.filter((item) => {
    const haystack = menu86Normalized([item.name, item.category, item.description, item.matchText].filter(Boolean).join(" "));
    return haystack.includes(query);
  });
}

function menu86AffectedPreview() {
  if (portalState.menu86Mode === "menuItem") {
    return portalState.menu86MenuItems.filter((item) => portalState.menu86SelectedMenuItemIds.has(item.id));
  }
  const tokens = menu86SearchTokens(portalState.menu86IngredientName);
  if (!tokens.length) {
    return [];
  }
  return portalState.menu86MenuItems.filter((item) => {
    const haystack = menu86Normalized([item.name, item.category, item.description, item.matchText].filter(Boolean).join(" "));
    const haystackTokens = new Set(haystack.split(" ").filter(Boolean));
    const normalizedIngredient = menu86Normalized(portalState.menu86IngredientName);
    return haystack.includes(normalizedIngredient) || tokens.every((token) => haystackTokens.has(token));
  });
}

function menu86AffectedEmptyText() {
  if (portalState.menu86Mode === "menuItem") {
    return "Select menu items to mark unavailable.";
  }
  if (!portalState.menu86MenuItems.length) {
    return "Menu data has not loaded yet.";
  }
  if (portalState.menu86IngredientName.trim()) {
    return "No affected dishes matched. Try an ingredient, modifier, or menu item phrase.";
  }
  return "Enter an ingredient to preview matching dishes.";
}

function menu86Normalized(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function menu86SearchTokens(value) {
  const stopWords = new Set(["and", "the", "with", "without", "side", "sides", "extra", "add", "added", "fresh", "choice"]);
  return menu86Normalized(value)
    .split(" ")
    .filter((token) => token && !stopWords.has(token));
}

function menu86MenuItemSubtitle(item) {
  return [item.category, moneyOrBlank(item.priceCents)].filter(Boolean).join(" • ");
}

function moneyOrBlank(cents) {
  return Number.isFinite(Number(cents)) ? money(Number(cents)) : "";
}

async function loadPortalAdminSettings() {
  if (portalState.adminSettingsLoading || !canAccessAdminAreas()) {
    return;
  }
  portalState.adminSettingsLoading = true;
  portalState.adminSettingsError = "";
  rerenderActiveAdminSection();
  try {
    const payload = await apiRequest("/operations/admin/settings", { method: "GET" });
    applyPortalAdminSettingsPayload(payload);
    portalState.adminSettingsLoaded = true;
    portalState.adminSettingsError = "";
  } catch (error) {
    portalState.adminSettingsError = error?.status === 403
      ? "This account does not have Owner or GM access."
      : "Could not load restaurant configuration.";
  } finally {
    portalState.adminSettingsLoading = false;
    rerenderActiveAdminSection();
  }
}

function applyPortalAdminSettingsPayload(payload) {
  const settings = payload?.settings || null;
  portalState.adminSettings = settings;
  portalState.adminTeamMembers = Array.isArray(payload?.teamMembers) ? payload.teamMembers : portalState.adminTeamMembers;
  portalState.adminProfileDraft = profileDraftFromSettings(settings);
  portalState.adminBusinessHoursDraft = businessHoursDraftFromSettings(settings);
  portalState.adminMenuVisibilityDraft = menuVisibilityDraftFromSettings(settings);
  portalState.adminMenuKnowledgeDraft = menuKnowledgeDraftFromSettings(settings);
  portalState.adminOnboardingOpenModules = readStoredAdminOnboardingOpenModules();
  portalState.adminMenuKnowledgeOpen = portalState.adminOnboardingOpenModules.menuKnowledge === true;
  pruneAdminMenuDisclosureState(settings);
}

function rerenderActiveAdminSection() {
  if (portalState.section === "onboarding") {
    renderOnboardingAdmin();
  } else if (portalState.section === "configure") {
    renderConfigureAdmin();
  }
}

function adminSettingsSnapshot() {
  return portalState.adminSettings || null;
}

function adminConfig() {
  return adminSettingsSnapshot()?.callFlowConfig?.config || {};
}

function profileDraftFromSettings(settings) {
  const business = settings?.business || {};
  return {
    name: business.name || "",
    timezone: business.timezone || "America/Chicago",
    twilioNumberE164: business.twilioNumberE164 || "",
    phoneNumberE164: business.phoneNumberE164 || ""
  };
}

function businessHoursDraftFromSettings(settings) {
  const hours = settings?.profile?.hours || {};
  return {
    source: "manual",
    timezone: hours.timezone || settings?.business?.timezone || "America/Chicago",
    days: businessHoursDays(hours).map((day) => ({
      day: day.day,
      isOpen: day.isOpen,
      windows: (Array.isArray(day.windows) && day.windows.length ? day.windows : [{ start: "09:00", end: "17:00" }])
        .map((window) => ({
          start: normalizedAdminTime(window?.start) || "09:00",
          end: normalizedAdminTime(window?.end) || "17:00"
        }))
    })),
    lastSyncedAt: null
  };
}

function ensureAdminDrafts() {
  const settings = adminSettingsSnapshot();
  if (!portalState.adminProfileDraft) {
    portalState.adminProfileDraft = profileDraftFromSettings(settings);
  }
  if (!portalState.adminBusinessHoursDraft) {
    portalState.adminBusinessHoursDraft = businessHoursDraftFromSettings(settings);
  }
  if (!portalState.adminMenuVisibilityDraft) {
    portalState.adminMenuVisibilityDraft = menuVisibilityDraftFromSettings(settings);
  }
  if (!portalState.adminMenuKnowledgeDraft) {
    portalState.adminMenuKnowledgeDraft = menuKnowledgeDraftFromSettings(settings);
  }
}

function menuVisibilityDraftFromSettings(settings) {
  const draft = {};
  const menuItems = Array.isArray(settings?.profile?.menuItems) ? settings.profile.menuItems : [];
  menuItems.forEach((item) => {
    if (typeof item?.id === "string" && item.id.trim()) {
      draft[item.id.trim()] = item.hiddenFromAgent === true;
    }
  });
  return draft;
}

function menuKnowledgeDraftFromSettings(settings) {
  const draft = { items: {} };
  const menuItems = Array.isArray(settings?.profile?.menuItems) ? settings.profile.menuItems : [];
  menuItems.forEach((item) => {
    const itemId = typeof item?.id === "string" ? item.id.trim() : "";
    if (!itemId) {
      return;
    }
    draft.items[itemId] = menuKnowledgeItemDraftFromItem(item);
  });
  return draft;
}

function menuKnowledgeItemDraftFromItem(item) {
  const modifierGroups = {};
  (Array.isArray(item?.modifierGroups) ? item.modifierGroups : []).forEach((group) => {
    const groupId = typeof group?.id === "string" ? group.id.trim() : "";
    if (!groupId) {
      return;
    }
    modifierGroups[groupId] = modifierPresentationDraftFromGroup(group);
  });
  return {
    id: typeof item?.id === "string" ? item.id.trim() : "",
    description: typeof item?.description === "string" ? item.description : "",
    aliasesText: Array.isArray(item?.aliases) ? item.aliases.join(", ") : "",
    hiddenFromAgent: item?.hiddenFromAgent === true,
    modifierGroups
  };
}

function modifierPresentationDraftFromGroup(group) {
  const presentation = group?.presentation || {};
  const optionDisplayNames = {};
  const rawOptionDisplayNames = presentation.optionDisplayNames || {};
  if (typeof rawOptionDisplayNames === "object" && rawOptionDisplayNames !== null) {
    Object.entries(rawOptionDisplayNames).forEach(([optionId, displayName]) => {
      if (typeof displayName === "string") {
        optionDisplayNames[optionId] = displayName;
      }
    });
  }
  return {
    displayName: typeof presentation.displayName === "string" ? presentation.displayName : "",
    askBehavior: normalizedModifierAskBehavior(presentation.askBehavior),
    questionTemplate: typeof presentation.questionTemplate === "string" ? presentation.questionTemplate : "",
    confirmationTemplate: typeof presentation.confirmationTemplate === "string" ? presentation.confirmationTemplate : "",
    readbackTemplate: typeof presentation.readbackTemplate === "string" ? presentation.readbackTemplate : "",
    optionDisplayNames
  };
}

function ensureMenuKnowledgeItemDraft(item) {
  ensureAdminDrafts();
  if (!portalState.adminMenuKnowledgeDraft?.items) {
    portalState.adminMenuKnowledgeDraft = menuKnowledgeDraftFromSettings(adminSettingsSnapshot());
  }
  const itemId = typeof item?.id === "string" ? item.id.trim() : "";
  if (!itemId) {
    return menuKnowledgeItemDraftFromItem(item);
  }
  if (!portalState.adminMenuKnowledgeDraft.items[itemId]) {
    portalState.adminMenuKnowledgeDraft.items[itemId] = menuKnowledgeItemDraftFromItem(item);
  }
  return portalState.adminMenuKnowledgeDraft.items[itemId];
}

function ensureMenuKnowledgeModifierDraft(item, group) {
  const itemDraft = ensureMenuKnowledgeItemDraft(item);
  const groupId = typeof group?.id === "string" ? group.id.trim() : "";
  if (!groupId) {
    return modifierPresentationDraftFromGroup(group);
  }
  if (!itemDraft.modifierGroups[groupId]) {
    itemDraft.modifierGroups[groupId] = modifierPresentationDraftFromGroup(group);
  }
  return itemDraft.modifierGroups[groupId];
}

function currentAdminMenuItems() {
  const profile = adminSettingsSnapshot()?.profile || {};
  return Array.isArray(profile.menuItems) ? profile.menuItems : [];
}

function menuItemHiddenForAgent(item) {
  const id = typeof item?.id === "string" ? item.id.trim() : "";
  const draft = portalState.adminMenuVisibilityDraft || {};
  if (id && Object.prototype.hasOwnProperty.call(draft, id)) {
    return draft[id] === true;
  }
  return item?.hiddenFromAgent === true;
}

function pruneAdminMenuDisclosureState(settings) {
  const menuItems = Array.isArray(settings?.profile?.menuItems) ? settings.profile.menuItems : [];
  const categoryTitles = new Set(menuItems.map((item) => item?.category || "Uncategorized"));
  const itemIds = new Set(
    menuItems
      .map((item) => (typeof item?.id === "string" ? item.id.trim() : ""))
      .filter(Boolean)
  );
  portalState.adminMenuOpenCategories = new Set(
    Array.from(portalState.adminMenuOpenCategories || []).filter((title) => categoryTitles.has(title))
  );
  portalState.adminMenuOpenItems = new Set(
    Array.from(portalState.adminMenuOpenItems || []).filter((id) => itemIds.has(id))
  );
}

function defaultOnboardingOpenModules() {
  return {
    restaurantProfile: true,
    businessHours: true,
    menuKnowledge: false,
    status: true
  };
}

function setOnboardingModuleOpen(moduleKey, isOpen) {
  portalState.adminOnboardingOpenModules = {
    ...defaultOnboardingOpenModules(),
    ...(portalState.adminOnboardingOpenModules || {}),
    [moduleKey]: isOpen === true
  };
  if (moduleKey === "menuKnowledge") {
    portalState.adminMenuKnowledgeOpen = isOpen === true;
  }
  storeAdminOnboardingOpenModules();
}

function isOnboardingModuleOpen(moduleKey) {
  const modules = {
    ...defaultOnboardingOpenModules(),
    ...(portalState.adminOnboardingOpenModules || {})
  };
  return modules[moduleKey] === true;
}

function syncAdminOnboardingModuleStateFromDom() {
  const next = {
    ...defaultOnboardingOpenModules(),
    ...(portalState.adminOnboardingOpenModules || {})
  };
  portalContent?.querySelectorAll("[data-admin-onboarding-module]").forEach((details) => {
    if (!(details instanceof HTMLDetailsElement)) {
      return;
    }
    const moduleKey = details.dataset.adminOnboardingModule || "";
    if (!moduleKey) {
      return;
    }
    next[moduleKey] = details.open;
  });
  portalState.adminOnboardingOpenModules = next;
  portalState.adminMenuKnowledgeOpen = next.menuKnowledge === true;
  storeAdminOnboardingOpenModules();
}

function syncAdminMenuDisclosureStateFromDom() {
  const menuDetails = portalContent?.querySelector("[data-admin-menu-knowledge-details]");
  if (menuDetails instanceof HTMLDetailsElement) {
    portalState.adminMenuKnowledgeOpen = menuDetails.open;
  }

  const openCategories = new Set();
  portalContent?.querySelectorAll("[data-admin-menu-category-details]").forEach((details) => {
    if (!(details instanceof HTMLDetailsElement) || !details.open) {
      return;
    }
    const categoryTitle = details.dataset.adminMenuCategoryDetails || "";
    if (categoryTitle) {
      openCategories.add(categoryTitle);
    }
  });
  portalState.adminMenuOpenCategories = openCategories;

  const openItems = new Set();
  portalContent?.querySelectorAll("[data-admin-menu-item-details]").forEach((details) => {
    if (!(details instanceof HTMLDetailsElement) || !details.open) {
      return;
    }
    const itemId = details.dataset.adminMenuItemDetails || "";
    if (itemId) {
      openItems.add(itemId);
    }
  });
  portalState.adminMenuOpenItems = openItems;
}

function findAdminMenuCategoryDetails(categoryTitle) {
  return Array.from(portalContent?.querySelectorAll("[data-admin-menu-category-details]") || [])
    .find((details) => details instanceof HTMLDetailsElement && details.dataset.adminMenuCategoryDetails === categoryTitle) || null;
}

function findAdminMenuItemDetails(itemId) {
  return Array.from(portalContent?.querySelectorAll("[data-admin-menu-item-details]") || [])
    .find((details) => details instanceof HTMLDetailsElement && details.dataset.adminMenuItemDetails === itemId) || null;
}

function updateAgentVisibilityButtonElement(button, hiddenFromAgent, label) {
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }
  button.classList.toggle("hidden", hiddenFromAgent === true);
  button.setAttribute("aria-label", label);
  button.setAttribute("title", label);
}

function clearAdminSaveStatusElement(target) {
  portalContent?.querySelector(`[data-admin-save-status="${target}"]`)?.remove();
}

function refreshMenuKnowledgeVisibilityDom() {
  const groups = groupMenuItemsByCategory(currentAdminMenuItems());
  groups.forEach((group) => {
    const categoryDetails = findAdminMenuCategoryDetails(group.title);
    if (categoryDetails instanceof HTMLDetailsElement) {
      const categoryHidden = group.visibleCount === 0;
      const categoryStatus = categoryDetails.querySelector("[data-admin-menu-category-count]");
      if (categoryStatus) {
        categoryStatus.textContent = `${group.visibleCount}/${group.items.length} visible`;
      }
      updateAgentVisibilityButtonElement(
        categoryDetails.querySelector("[data-admin-menu-category-visibility]"),
        categoryHidden,
        categoryHidden ? `Show ${group.title} to the agent` : `Hide ${group.title} from the agent`
      );
    }

    group.items.forEach((item) => {
      const itemId = typeof item.id === "string" ? item.id.trim() : "";
      const itemDetails = itemId ? findAdminMenuItemDetails(itemId) : null;
      if (!(itemDetails instanceof HTMLDetailsElement)) {
        return;
      }
      const hiddenFromAgent = menuItemHiddenForAgent(item);
      const itemStatus = itemDetails.querySelector("[data-admin-menu-item-state]");
      if (itemStatus) {
        itemStatus.textContent = hiddenFromAgent ? "Hidden" : "Visible";
      }
      updateAgentVisibilityButtonElement(
        itemDetails.querySelector("[data-admin-menu-item-visibility]"),
        hiddenFromAgent,
        hiddenFromAgent ? `Show ${item.name || "menu item"} to the agent` : `Hide ${item.name || "menu item"} from the agent`
      );
    });
  });
}

function normalizedAdminTime(value) {
  const text = String(value || "");
  const match = text.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    return null;
  }
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function adminSaveStatusMarkup(target) {
  if (!portalState.adminSaveMessage || portalState.adminSavingTarget !== target) {
    return "";
  }
  return `<p class="ios-save-status ${portalState.adminSaveIsError ? "error" : "ok"}" data-admin-save-status="${escapeHTML(target)}">${escapeHTML(portalState.adminSaveMessage)}</p>`;
}

function setAdminSaveStatus(target, message, isError = false) {
  portalState.adminSavingTarget = target;
  portalState.adminSaveMessage = message;
  portalState.adminSaveIsError = isError;
}

function clearAdminSaveStatus() {
  portalState.adminSaveMessage = "";
  portalState.adminSaveIsError = false;
}

async function savePortalAdminProfile() {
  syncAdminProfileDraftFromDom();
  const draft = portalState.adminProfileDraft || {};
  if (!String(draft.name || "").trim()) {
    setAdminSaveStatus("profile", "Restaurant name is required.", true);
    renderOnboardingAdmin();
    return;
  }
  portalState.adminSavingTarget = "profile";
  portalState.adminSaving = true;
  portalState.adminSaveMessage = "Saving restaurant profile...";
  portalState.adminSaveIsError = false;
  renderOnboardingAdmin();
  try {
    const payload = await apiRequest("/operations/admin/profile", {
      method: "PUT",
      body: JSON.stringify(draft)
    });
    applyPortalAdminSettingsPayload(payload);
    portalState.adminSettingsLoaded = true;
    setAdminSaveStatus("profile", "Saved restaurant profile.");
  } catch (error) {
    setAdminSaveStatus("profile", adminSaveErrorMessage(error), true);
  } finally {
    portalState.adminSaving = false;
    renderOnboardingAdmin();
  }
}

async function savePortalAdminBusinessHours() {
  syncAdminBusinessHoursDraftFromDom();
  portalState.adminSavingTarget = "businessHours";
  portalState.adminSaving = true;
  portalState.adminSaveMessage = "Saving business hours...";
  portalState.adminSaveIsError = false;
  renderOnboardingAdmin();
  try {
    const payload = await apiRequest("/operations/admin/business-hours", {
      method: "PUT",
      body: JSON.stringify(portalState.adminBusinessHoursDraft || {})
    });
    applyPortalAdminSettingsPayload(payload);
    portalState.adminSettingsLoaded = true;
    setAdminSaveStatus("businessHours", "Saved business hours.");
  } catch (error) {
    setAdminSaveStatus("businessHours", adminSaveErrorMessage(error), true);
  } finally {
    portalState.adminSaving = false;
    renderOnboardingAdmin();
  }
}

async function savePortalAdminMenuKnowledge() {
  syncAdminProfileDraftFromDom();
  syncAdminBusinessHoursDraftFromDom();
  syncAdminOnboardingModuleStateFromDom();
  syncAdminMenuDisclosureStateFromDom();
  syncAdminMenuKnowledgeDraftFromDom();
  ensureAdminDrafts();
  const menuItems = currentAdminMenuItems()
    .filter((item) => typeof item?.id === "string" && item.id.trim())
    .map((item) => ({
      id: item.id.trim(),
      description: menuKnowledgeDraftForItem(item).description || "",
      aliases: parseMenuKnowledgeAliases(menuKnowledgeDraftForItem(item).aliasesText),
      hiddenFromAgent: menuItemHiddenForAgent(item)
    }));
  const modifierGroups = currentAdminMenuItems()
    .flatMap((item) => {
      const itemId = typeof item?.id === "string" ? item.id.trim() : "";
      if (!itemId) {
        return [];
      }
      return (Array.isArray(item.modifierGroups) ? item.modifierGroups : [])
        .filter((group) => typeof group?.id === "string" && group.id.trim())
        .map((group) => {
          const draft = menuKnowledgeDraftForModifierGroup(item, group);
          return {
            itemId,
            groupId: group.id.trim(),
            presentation: {
              displayName: draft.displayName || "",
              askBehavior: normalizedModifierAskBehavior(draft.askBehavior),
              questionTemplate: draft.questionTemplate || "",
              confirmationTemplate: draft.confirmationTemplate || "",
              readbackTemplate: draft.readbackTemplate || "",
              optionDisplayNames: cleanModifierOptionDisplayNames(draft.optionDisplayNames || {})
            }
          };
        });
    });

  if (!menuItems.length) {
    setAdminSaveStatus("menuKnowledge", "No menu items are available to save.", true);
    renderOnboardingAdmin();
    return;
  }

  portalState.adminSavingTarget = "menuKnowledge";
  portalState.adminSaving = true;
  portalState.adminSaveMessage = "Saving menu knowledge...";
  portalState.adminSaveIsError = false;
  renderOnboardingAdmin();
  try {
    const payload = await apiRequest("/operations/admin/menu-knowledge", {
      method: "PUT",
      body: JSON.stringify({ items: menuItems, modifierGroups })
    });
    applyPortalAdminSettingsPayload(payload);
    portalState.adminSettingsLoaded = true;
    setAdminSaveStatus("menuKnowledge", "Saved menu knowledge.");
  } catch (error) {
    setAdminSaveStatus("menuKnowledge", adminSaveErrorMessage(error), true);
  } finally {
    portalState.adminSaving = false;
    renderOnboardingAdmin();
  }
}

function adminSaveErrorMessage(error) {
  const message = error instanceof Error ? error.message : String(error || "");
  const labels = {
    restaurant_name_required: "Restaurant name is required.",
    twilioNumberE164_invalid: "Agent number must be a valid phone number.",
    phoneNumberE164_invalid: "Business phone must be a valid phone number.",
    business_hours_invalid_windows: "Business hours must end after they start.",
    menu_knowledge_updates_required: "Choose at least one menu knowledge change.",
    menu_visibility_updates_required: "Choose at least one menu visibility change.",
    menu_items_not_found: "The synced menu changed. Reload and try again."
  };
  return labels[message] || "Save failed. Check the fields and try again.";
}

function syncAdminProfileDraftFromDom() {
  const form = portalContent?.querySelector("[data-admin-profile-form]");
  if (!(form instanceof HTMLFormElement)) {
    return;
  }
  const formData = new FormData(form);
  portalState.adminProfileDraft = {
    name: String(formData.get("name") || "").trim(),
    timezone: String(formData.get("timezone") || "America/Chicago"),
    twilioNumberE164: String(formData.get("twilioNumberE164") || "").trim(),
    phoneNumberE164: String(formData.get("phoneNumberE164") || "").trim()
  };
}

function syncAdminBusinessHoursDraftFromDom() {
  const form = portalContent?.querySelector("[data-admin-hours-form]");
  if (!(form instanceof HTMLFormElement) || !portalState.adminBusinessHoursDraft) {
    return;
  }
  const formData = new FormData(form);
  portalState.adminBusinessHoursDraft = {
    ...portalState.adminBusinessHoursDraft,
    days: portalState.adminBusinessHoursDraft.days.map((day, dayIndex) => {
      const isOpen = formData.get(`day-${dayIndex}-isOpen`) === "open";
      const windows = day.windows.map((window, windowIndex) => ({
        start: normalizedAdminTime(formData.get(`day-${dayIndex}-window-${windowIndex}-start`)) || window.start,
        end: normalizedAdminTime(formData.get(`day-${dayIndex}-window-${windowIndex}-end`)) || window.end
      }));
      return {
        ...day,
        isOpen,
        windows: windows.length ? windows : [{ start: "09:00", end: "17:00" }]
      };
    })
  };
}

function syncAdminMenuKnowledgeDraftFromDom() {
  ensureAdminDrafts();
  const draft = portalState.adminMenuKnowledgeDraft;
  if (!draft?.items) {
    return;
  }

  portalContent?.querySelectorAll("[data-admin-menu-item-id][data-admin-menu-item-field]").forEach((field) => {
    const itemId = field.dataset.adminMenuItemId || "";
    const fieldName = field.dataset.adminMenuItemField || "";
    const item = currentAdminMenuItems().find((candidate) => candidate?.id === itemId);
    if (!itemId || !item) {
      return;
    }
    const itemDraft = ensureMenuKnowledgeItemDraft(item);
    const value = field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement ? field.value : "";
    if (fieldName === "description") {
      itemDraft.description = value;
    } else if (fieldName === "aliases") {
      itemDraft.aliasesText = value;
    }
  });

  portalContent?.querySelectorAll("[data-admin-modifier-field][data-admin-modifier-item-id][data-admin-modifier-group-id]").forEach((field) => {
    const itemId = field.dataset.adminModifierItemId || "";
    const groupId = field.dataset.adminModifierGroupId || "";
    const fieldName = field.dataset.adminModifierField || "";
    const item = currentAdminMenuItems().find((candidate) => candidate?.id === itemId);
    const group = (Array.isArray(item?.modifierGroups) ? item.modifierGroups : []).find((candidate) => candidate?.id === groupId);
    if (!item || !group) {
      return;
    }
    const groupDraft = ensureMenuKnowledgeModifierDraft(item, group);
    const value = field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement
      ? field.value
      : "";
    if (fieldName === "displayName") {
      groupDraft.displayName = value;
    } else if (fieldName === "askBehavior") {
      groupDraft.askBehavior = normalizedModifierAskBehavior(value);
    } else if (fieldName === "questionTemplate") {
      groupDraft.questionTemplate = value;
    } else if (fieldName === "confirmationTemplate") {
      groupDraft.confirmationTemplate = value;
    } else if (fieldName === "readbackTemplate") {
      groupDraft.readbackTemplate = value;
    } else if (fieldName === "optionDisplayName") {
      const optionId = field.dataset.adminModifierOptionId || "";
      if (optionId) {
        groupDraft.optionDisplayNames[optionId] = value;
      }
    }
  });
}

function menuKnowledgeDraftForItem(item) {
  return ensureMenuKnowledgeItemDraft(item);
}

function menuKnowledgeDraftForModifierGroup(item, group) {
  return ensureMenuKnowledgeModifierDraft(item, group);
}

function parseMenuKnowledgeAliases(value) {
  const seen = new Set();
  const aliases = [];
  String(value || "")
    .split(/[,;\n]+/)
    .map((alias) => alias.trim())
    .filter(Boolean)
    .forEach((alias) => {
      const key = alias.toLowerCase();
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
      aliases.push(alias);
    });
  return aliases;
}

function cleanModifierOptionDisplayNames(optionDisplayNames) {
  const cleaned = {};
  if (typeof optionDisplayNames !== "object" || optionDisplayNames === null) {
    return cleaned;
  }
  Object.entries(optionDisplayNames).forEach(([optionId, displayName]) => {
    const text = String(displayName || "").trim();
    if (optionId && text) {
      cleaned[optionId] = text;
    }
  });
  return cleaned;
}

function refreshModifierAskBehaviorPreview(select) {
  const askBehavior = normalizedModifierAskBehavior(select.value);
  const editor = select.closest(".menu-modifier-editor");
  if (!editor) {
    return;
  }
  const help = editor.querySelector("[data-admin-modifier-help]");
  if (help) {
    help.textContent = modifierDefaultHandlingHelpText(askBehavior);
  }
  const askExample = editor.querySelector("[data-admin-modifier-ask-example]");
  if (askExample instanceof HTMLElement) {
    askExample.hidden = askBehavior === "apply_default_silently";
  }
}

function addBusinessHourWindow(dayIndex) {
  syncAdminBusinessHoursDraftFromDom();
  const draft = portalState.adminBusinessHoursDraft;
  const day = draft?.days?.[dayIndex];
  if (!day) {
    return;
  }
  day.isOpen = true;
  day.windows.push({ start: "09:00", end: "17:00" });
  clearAdminSaveStatus();
  renderOnboardingAdmin();
}

function removeBusinessHourWindow(dayIndex, windowIndex) {
  syncAdminBusinessHoursDraftFromDom();
  const draft = portalState.adminBusinessHoursDraft;
  const day = draft?.days?.[dayIndex];
  if (!day || day.windows.length <= 1) {
    return;
  }
  day.windows.splice(windowIndex, 1);
  clearAdminSaveStatus();
  renderOnboardingAdmin();
}

function updateMenuVisibilityDraft(itemIds, hiddenFromAgent) {
  syncAdminProfileDraftFromDom();
  syncAdminBusinessHoursDraftFromDom();
  syncAdminMenuKnowledgeDraftFromDom();
  syncAdminOnboardingModuleStateFromDom();
  syncAdminMenuDisclosureStateFromDom();
  setOnboardingModuleOpen("menuKnowledge", true);
  ensureAdminDrafts();
  const draft = {
    ...(portalState.adminMenuVisibilityDraft || {})
  };
  itemIds.forEach((itemId) => {
    if (typeof itemId === "string" && itemId.trim()) {
      const normalizedItemId = itemId.trim();
      draft[normalizedItemId] = hiddenFromAgent === true;
      if (portalState.adminMenuKnowledgeDraft?.items?.[normalizedItemId]) {
        portalState.adminMenuKnowledgeDraft.items[normalizedItemId].hiddenFromAgent = hiddenFromAgent === true;
      }
    }
  });
  portalState.adminMenuVisibilityDraft = draft;
  if (portalState.adminSavingTarget === "menuKnowledge" && portalState.adminSaveMessage) {
    clearAdminSaveStatus();
    clearAdminSaveStatusElement("menuKnowledge");
  }
  refreshMenuKnowledgeVisibilityDom();
}

function setMenuItemHidden(itemId, hiddenFromAgent) {
  updateMenuVisibilityDraft([itemId], hiddenFromAgent);
}

function setMenuCategoryHidden(categoryTitle, hiddenFromAgent) {
  const group = groupMenuItemsByCategory(currentAdminMenuItems())
    .find((candidate) => candidate.title === categoryTitle);
  if (!group) {
    return;
  }
  updateMenuVisibilityDraft(group.items.map((item) => item.id), hiddenFromAgent);
}

function wireOnboardingAdminEvents() {
  const profileForm = portalContent?.querySelector("[data-admin-profile-form]");
  if (profileForm instanceof HTMLFormElement) {
    profileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      void savePortalAdminProfile();
    });
    profileForm.addEventListener("input", () => {
      syncAdminProfileDraftFromDom();
      if (portalState.adminSavingTarget === "profile" && portalState.adminSaveMessage) {
        clearAdminSaveStatus();
      }
    });
    profileForm.addEventListener("change", () => {
      syncAdminProfileDraftFromDom();
      if (portalState.adminSavingTarget === "profile" && portalState.adminSaveMessage) {
        clearAdminSaveStatus();
      }
    });
  }

  const hoursForm = portalContent?.querySelector("[data-admin-hours-form]");
  if (hoursForm instanceof HTMLFormElement) {
    hoursForm.addEventListener("submit", (event) => {
      event.preventDefault();
      void savePortalAdminBusinessHours();
    });
    hoursForm.addEventListener("change", (event) => {
      syncAdminBusinessHoursDraftFromDom();
      if (portalState.adminSavingTarget === "businessHours" && portalState.adminSaveMessage) {
        clearAdminSaveStatus();
      }
      const target = event.target;
      if (target instanceof HTMLSelectElement && target.dataset.adminHoursOpen) {
        renderOnboardingAdmin();
      }
    });
  }

  portalContent?.querySelectorAll("[data-admin-hours-add]").forEach((button) => {
    button.addEventListener("click", () => {
      addBusinessHourWindow(Number(button.dataset.adminHoursAdd));
    });
  });
  portalContent?.querySelectorAll("[data-admin-hours-remove-day][data-admin-hours-remove-window]").forEach((button) => {
    button.addEventListener("click", () => {
      removeBusinessHourWindow(
        Number(button.dataset.adminHoursRemoveDay),
        Number(button.dataset.adminHoursRemoveWindow)
      );
    });
  });

  portalContent?.querySelector("[data-admin-menu-save]")?.addEventListener("click", () => {
    void savePortalAdminMenuKnowledge();
  });
  const menuKnowledgeDetails = portalContent?.querySelector("[data-admin-menu-knowledge-details]");
  if (menuKnowledgeDetails instanceof HTMLDetailsElement) {
    const syncMenuKnowledgeAndClearStatus = () => {
      syncAdminMenuKnowledgeDraftFromDom();
      if (portalState.adminSavingTarget === "menuKnowledge" && portalState.adminSaveMessage) {
        clearAdminSaveStatus();
        clearAdminSaveStatusElement("menuKnowledge");
      }
    };
    menuKnowledgeDetails.addEventListener("input", syncMenuKnowledgeAndClearStatus);
    menuKnowledgeDetails.addEventListener("change", (event) => {
      syncMenuKnowledgeAndClearStatus();
      const target = event.target;
      if (target instanceof HTMLSelectElement && target.dataset.adminModifierField === "askBehavior") {
        refreshModifierAskBehaviorPreview(target);
      }
    });
  }
  portalContent?.querySelectorAll("[data-admin-onboarding-module]").forEach((details) => {
    details.addEventListener("toggle", (event) => {
      const target = event.currentTarget;
      if (!(target instanceof HTMLDetailsElement) || event.target !== target) {
        return;
      }
      const moduleKey = target.dataset.adminOnboardingModule || "";
      if (moduleKey) {
        setOnboardingModuleOpen(moduleKey, target.open);
      }
    });
  });
  portalContent?.querySelector("[data-admin-menu-knowledge-details]")?.addEventListener("toggle", (event) => {
    const details = event.currentTarget;
    if (details instanceof HTMLDetailsElement && event.target === details) {
      setOnboardingModuleOpen("menuKnowledge", details.open);
    }
  });
  portalContent?.querySelectorAll("[data-admin-menu-category-details]").forEach((details) => {
    details.addEventListener("toggle", (event) => {
      const target = event.currentTarget;
      if (!(target instanceof HTMLDetailsElement) || event.target !== target) {
        return;
      }
      const categoryTitle = target.dataset.adminMenuCategoryDetails || "";
      if (!categoryTitle) {
        return;
      }
      if (target.open) {
        portalState.adminMenuOpenCategories.add(categoryTitle);
      } else {
        portalState.adminMenuOpenCategories.delete(categoryTitle);
      }
    });
  });
  portalContent?.querySelectorAll("[data-admin-menu-item-details]").forEach((details) => {
    details.addEventListener("toggle", (event) => {
      const target = event.currentTarget;
      if (!(target instanceof HTMLDetailsElement) || event.target !== target) {
        return;
      }
      const itemId = target.dataset.adminMenuItemDetails || "";
      if (!itemId) {
        return;
      }
      if (target.open) {
        portalState.adminMenuOpenItems.add(itemId);
      } else {
        portalState.adminMenuOpenItems.delete(itemId);
      }
    });
  });
  portalContent?.querySelectorAll("[data-admin-menu-item-visibility]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const itemId = button.dataset.adminMenuItemVisibility || "";
      const item = currentAdminMenuItems().find((candidate) => candidate?.id === itemId);
      setMenuItemHidden(itemId, !menuItemHiddenForAgent(item));
    });
  });
  portalContent?.querySelectorAll("[data-admin-menu-category-visibility]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const categoryTitle = button.dataset.adminMenuCategoryVisibility || "";
      const group = groupMenuItemsByCategory(currentAdminMenuItems())
        .find((candidate) => candidate.title === categoryTitle);
      if (!group) {
        return;
      }
      setMenuCategoryHidden(categoryTitle, group.visibleCount > 0);
    });
  });
}

function renderAdminAccessDenied(section) {
  if (!portalContent || !pageTitle || !pageKicker) {
    return;
  }
  const copy = sectionCopy[section] || { title: "Restricted", kicker: "Owner or GM" };
  pageTitle.textContent = copy.title;
  pageKicker.textContent = copy.kicker;
  portalContent.innerHTML = `
    <section class="ios-form-page">
      <article class="admin-state-card error">
        <p class="eyebrow blue">Owner or GM required</p>
        <h2>Restricted admin area</h2>
        <p>Onboarding and Configure contain business setup, routing, integrations, and workflow controls. This account cannot view them.</p>
      </article>
    </section>
  `;
}

function renderAdminState(message, isError = false) {
  return `
    <section class="ios-form-page">
      <article class="admin-state-card ${isError ? "error" : ""}">
        <p class="eyebrow blue">${isError ? "Configuration unavailable" : "Loading"}</p>
        <h2>${escapeHTML(message)}</h2>
      </article>
    </section>
  `;
}

function renderOnboardingAdmin() {
  if (!portalContent || !pageTitle || !pageKicker) {
    return;
  }
  pageTitle.textContent = "Onboarding";
  pageKicker.textContent = "Setup";
  if (!canAccessAdminAreas()) {
    renderAdminAccessDenied("onboarding");
    return;
  }
  if (portalState.adminSettingsLoading && !portalState.adminSettingsLoaded) {
    portalContent.innerHTML = renderAdminState("Loading restaurant setup...");
    return;
  }
  if (portalState.adminSettingsError) {
    portalContent.innerHTML = renderAdminState(portalState.adminSettingsError, true);
    return;
  }
  const settings = adminSettingsSnapshot();
  if (!settings) {
    portalContent.innerHTML = renderAdminState("Restaurant setup has not loaded yet.");
    return;
  }
  ensureAdminDrafts();

  const profile = settings.profile || {};
  const menuItems = Array.isArray(profile.menuItems) ? profile.menuItems : [];
  const upsellItems = Array.isArray(profile.upsellItems) ? profile.upsellItems : [];

  portalContent.innerHTML = `
    <section class="ios-form-page admin-onboarding-page">
      ${renderRestaurantProfileModule()}
      ${renderBusinessHoursModule()}
      ${menuItems.length ? renderMenuKnowledgeModule(menuItems) : ""}
      ${renderIosModule({
        title: "Status",
        icon: "checkmark.circle",
        open: isOnboardingModuleOpen("status"),
        detailsAttributes: `data-admin-onboarding-module="status"`,
        content: `
          <p class="ios-status-text ok">Loaded restaurant settings from Parse.</p>
          ${menuItems.length ? `<p class="ios-footnote">Menu items: ${menuItems.length}, Upsell candidates: ${upsellItems.length}</p>` : ""}
        `
      })}
    </section>
  `;
  wireOnboardingAdminEvents();
}

function renderConfigureAdmin() {
  if (!portalContent || !pageTitle || !pageKicker) {
    return;
  }
  pageTitle.textContent = "Configure";
  pageKicker.textContent = "Agent controls";
  if (!canAccessAdminAreas()) {
    renderAdminAccessDenied("configure");
    return;
  }
  if (portalState.adminSettingsLoading && !portalState.adminSettingsLoaded) {
    portalContent.innerHTML = renderAdminState("Loading agent controls...");
    return;
  }
  if (portalState.adminSettingsError) {
    portalContent.innerHTML = renderAdminState(portalState.adminSettingsError, true);
    return;
  }
  const settings = adminSettingsSnapshot();
  if (!settings) {
    portalContent.innerHTML = renderAdminState("Agent controls have not loaded yet.");
    return;
  }

  portalContent.innerHTML = `
    <section class="ios-form-page admin-configure-page">
      ${renderIosModule({
        title: "Status",
        icon: "checkmark.circle",
        open: true,
        content: `<p class="ios-status-text ok">Loaded restaurant settings from Parse.</p>`
      })}
      ${renderTeamAccessModule()}
      ${renderAddIntegrationModule()}
      ${renderPosIntegrationsModule(settings.integrations || [])}
      ${renderPhonePaymentsModule(settings.paymentProfile || {})}
      ${renderVoiceRuntimeModule(settings)}
      ${renderReservationsConfigModule(adminConfig().reservationConfig || {})}
      ${renderMiscRequestCategoriesModule(adminConfig().miscRequestCategories || [])}
      ${renderHandoffRoutesModule(adminConfig().handoffRoutes || [])}
      ${renderKitchenPrintingModule(adminConfig().posPrinting || {})}
      ${renderSystemFallbacksModule(adminConfig().systemFallbacks || {})}
      ${renderLiveCallVoiceModule(settings)}
      ${renderDeepgramAuraPreviewModule()}
    </section>
  `;
}

function renderIosModule({ title, icon, content, open = false, meta = "", detailsAttributes = "" }) {
  return `
    <section class="ios-module">
      <details class="ios-disclosure" ${open ? "open" : ""} ${detailsAttributes}>
        <summary>
          <span class="ios-module-label">
            <span class="ios-symbol" aria-hidden="true">${escapeHTML(adminSymbolGlyph(icon))}</span>
            <span>${escapeHTML(title)}</span>
          </span>
          ${meta ? `<span class="ios-module-meta">${escapeHTML(meta)}</span>` : ""}
        </summary>
        <div class="ios-module-body">
          ${content}
        </div>
      </details>
    </section>
  `;
}

function renderNestedDisclosure(title, content, open = false, meta = "") {
  return `
    <details class="ios-nested-disclosure" ${open ? "open" : ""}>
      <summary>
        <span>${escapeHTML(title)}</span>
        ${meta ? `<em>${escapeHTML(meta)}</em>` : ""}
      </summary>
      <div class="ios-nested-body">
        ${content}
      </div>
    </details>
  `;
}

function renderReadOnlyInputRow(label, value, multiline = false) {
  const safeValue = escapeHTML(value || "");
  return `
    <label class="ios-row ios-control-row">
      <span>${escapeHTML(label)}</span>
      ${multiline
        ? `<textarea disabled rows="3">${safeValue}</textarea>`
        : `<input type="text" value="${safeValue}" disabled>`}
    </label>
  `;
}

function renderEditableInputRow(label, name, value, options = {}) {
  const type = options.type || "text";
  return `
    <label class="ios-row ios-control-row">
      <span>${escapeHTML(label)}</span>
      <input
        type="${escapeHTML(type)}"
        name="${escapeHTML(name)}"
        value="${escapeHTML(value || "")}"
        autocomplete="off"
        ${options.required ? "required" : ""}
        ${options.placeholder ? `placeholder="${escapeHTML(options.placeholder)}"` : ""}
        ${portalState.adminSaving ? "disabled" : ""}
      >
    </label>
  `;
}

function renderEditableSelectRow(label, name, value, options) {
  return `
    <label class="ios-row ios-control-row">
      <span>${escapeHTML(label)}</span>
      <select name="${escapeHTML(name)}" ${portalState.adminSaving ? "disabled" : ""}>
        ${options.map((option) => `
          <option value="${escapeHTML(option)}" ${option === value ? "selected" : ""}>${escapeHTML(option)}</option>
        `).join("")}
      </select>
    </label>
  `;
}

function renderPickerRow(label, value) {
  return `
    <div class="ios-row">
      <span>${escapeHTML(label)}</span>
      <span class="ios-picker-value">${escapeHTML(displaySettingValue(value))}<b aria-hidden="true">⌄</b></span>
    </div>
  `;
}

function renderValueRow(label, value, detail = "") {
  return `
    <div class="ios-row">
      <span>${escapeHTML(label)}</span>
      <strong>${escapeHTML(displaySettingValue(value))}</strong>
      ${detail ? `<small>${escapeHTML(detail)}</small>` : ""}
    </div>
  `;
}

function renderToggleRow(label, checked, detail = "") {
  return `
    <div class="ios-row">
      <span>${escapeHTML(label)}</span>
      <span class="ios-switch ${checked ? "on" : ""}" role="switch" aria-checked="${checked ? "true" : "false"}"><i></i></span>
      ${detail ? `<small>${escapeHTML(detail)}</small>` : ""}
    </div>
  `;
}

function renderActionButton(label, icon = "") {
  return `
    <button class="ios-action-button" type="button" disabled>
      ${icon ? `<span aria-hidden="true">${escapeHTML(adminSymbolGlyph(icon))}</span>` : ""}
      <span>${escapeHTML(label)}</span>
    </button>
  `;
}

function renderAgentVisibilityButton(hiddenFromAgent, label, attributes = "") {
  return `
    <button
      class="agent-visibility-button ${hiddenFromAgent ? "hidden" : ""}"
      type="button"
      aria-label="${escapeHTML(label)}"
      title="${escapeHTML(label)}"
      ${attributes}
      ${portalState.adminSaving ? "disabled" : ""}
    >
      <span class="visibility-eye" aria-hidden="true"></span>
    </button>
  `;
}

function adminSymbolGlyph(icon) {
  const glyphs = {
    "fork.knife": "🍴",
    clock: "◷",
    "list.bullet.rectangle": "☷",
    "checkmark.circle": "✓",
    "person.2.badge.gearshape": "☻",
    "plus.circle": "+",
    "plus.circle.fill": "+",
    "phone.badge.plus": "☎",
    terminal: "⌘",
    creditcard: "▭",
    "phone.badge.checkmark": "☎",
    waveform: "≈",
    "calendar.badge.clock": "▦",
    "questionmark.bubble": "?",
    "phone.arrow.up.right": "↗",
    printer: "▣",
    "exclamationmark.arrow.triangle.2.circlepath": "!",
    "speaker.wave.2": "◉",
    "waveform.circle": "◎"
  };
  return glyphs[icon] || icon || "";
}

function displaySettingValue(value, fallback = "Not set") {
  if (value === true) {
    return "Enabled";
  }
  if (value === false) {
    return "Disabled";
  }
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  return String(value);
}

function formatSettingLabel(value) {
  return statusText(value || "not_set") || "Not set";
}

function formatTimeOfDay(value) {
  const text = String(value || "");
  const match = text.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    return text || "Not set";
  }
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
}

function businessHoursDays(hours) {
  const days = Array.isArray(hours?.days) ? hours.days : [];
  return portalWeekdayOrder.map((dayKey) => {
    const day = days.find((item) => item?.day === dayKey) || {};
    const windows = Array.isArray(day.windows) ? day.windows : [{ start: "09:00", end: "17:00" }];
    return {
      day: dayKey,
      isOpen: day.isOpen !== false,
      windows
    };
  });
}

function formatBusinessHoursSource(hours) {
  const source = hours?.source || "manual_default";
  const lastSyncedAt = hours?.lastSyncedAt;
  if (source === "clover") {
    return `Synced from Clover${lastSyncedAt ? ` on ${lastSyncedAt}` : ""}`;
  }
  if (source === "square") {
    return `Synced from Square${lastSyncedAt ? ` on ${lastSyncedAt}` : ""}`;
  }
  if (source === "manual") {
    return "Manually configured";
  }
  return "Default hours: open 9:00 AM-5:00 PM daily";
}

function renderRestaurantProfileModule() {
  const draft = portalState.adminProfileDraft || {};
  const saving = portalState.adminSaving && portalState.adminSavingTarget === "profile";
  return renderIosModule({
    title: "Restaurant Profile",
    icon: "fork.knife",
    open: isOnboardingModuleOpen("restaurantProfile"),
    detailsAttributes: `data-admin-onboarding-module="restaurantProfile"`,
    content: `
      <form data-admin-profile-form>
        ${renderEditableInputRow("Restaurant Name", "name", draft.name || "", { required: true })}
        ${renderEditableSelectRow("Timezone", "timezone", draft.timezone || "America/Chicago", adminTimezoneOptions)}
        ${renderEditableInputRow("Agent Number", "twilioNumberE164", draft.twilioNumberE164 || "", { type: "tel", placeholder: "+15551234567" })}
        ${renderActionButton("Browse Agent Numbers", "phone.badge.plus")}
        ${renderEditableInputRow("Business Phone", "phoneNumberE164", draft.phoneNumberE164 || "", { type: "tel", placeholder: "+15551234567" })}
        ${adminSaveStatusMarkup("profile")}
        <button class="ios-action-button primary" type="submit" ${portalState.adminSaving ? "disabled" : ""}>
          ${saving ? "Saving..." : "Save Restaurant Profile"}
        </button>
      </form>
    `
  });
}

function renderBusinessHoursModule() {
  const draft = portalState.adminBusinessHoursDraft || businessHoursDraftFromSettings(adminSettingsSnapshot());
  const hoursForSource = adminSettingsSnapshot()?.profile?.hours || draft;
  const saving = portalState.adminSaving && portalState.adminSavingTarget === "businessHours";
  return renderIosModule({
    title: "Business Hours",
    icon: "clock",
    open: isOnboardingModuleOpen("businessHours"),
    detailsAttributes: `data-admin-onboarding-module="businessHours"`,
    content: `
      <form data-admin-hours-form>
        <p class="ios-footnote">Synced from the POS when available. If the POS does not provide hours, configure them here so Tavra knows when the restaurant is open.</p>
        <p class="ios-source-note"><span aria-hidden="true">clock</span>${escapeHTML(formatBusinessHoursSource(hoursForSource || {}))}</p>
        <div class="admin-hours-list">
          ${(draft.days || []).map(renderBusinessHoursDayEditor).join("")}
        </div>
        ${adminSaveStatusMarkup("businessHours")}
        <button class="ios-action-button primary" type="submit" ${portalState.adminSaving ? "disabled" : ""}>
          ${saving ? "Saving..." : "Save Business Hours"}
        </button>
      </form>
    `
  });
}

function renderBusinessHoursDayEditor(day, dayIndex) {
  return `
    <div class="admin-hours-day" data-day-index="${dayIndex}">
      <div class="admin-hours-day-head">
        <strong>${escapeHTML(portalWeekdayLabels[day.day] || day.day)}</strong>
        <select name="day-${dayIndex}-isOpen" data-admin-hours-open="${dayIndex}" ${portalState.adminSaving ? "disabled" : ""}>
          <option value="open" ${day.isOpen ? "selected" : ""}>Open</option>
          <option value="closed" ${day.isOpen ? "" : "selected"}>Closed</option>
        </select>
      </div>
      ${day.isOpen ? `
        <div class="admin-hours-windows">
          ${day.windows.map((window, windowIndex) => renderBusinessHourWindow(dayIndex, windowIndex, window)).join("")}
        </div>
      ` : `<p class="admin-hours-closed">Closed</p>`}
    </div>
  `;
}

function renderBusinessHourWindow(dayIndex, windowIndex, window) {
  return `
    <div class="admin-hours-window">
      <select name="day-${dayIndex}-window-${windowIndex}-start" data-admin-hours-time ${portalState.adminSaving ? "disabled" : ""}>
        ${adminBusinessHourTimeOptions.map((time) => `
          <option value="${time}" ${time === window.start ? "selected" : ""}>${escapeHTML(formatTimeOfDay(time))}</option>
        `).join("")}
      </select>
      <span>to</span>
      <select name="day-${dayIndex}-window-${windowIndex}-end" data-admin-hours-time ${portalState.adminSaving ? "disabled" : ""}>
        ${adminBusinessHourTimeOptions.map((time) => `
          <option value="${time}" ${time === window.end ? "selected" : ""}>${escapeHTML(formatTimeOfDay(time))}</option>
        `).join("")}
      </select>
      <button class="admin-hour-icon-button" type="button" data-admin-hours-add="${dayIndex}" ${portalState.adminSaving ? "disabled" : ""} aria-label="Add hours window">+</button>
      ${portalState.adminBusinessHoursDraft?.days?.[dayIndex]?.windows?.length > 1 ? `
        <button class="admin-hour-icon-button danger" type="button" data-admin-hours-remove-day="${dayIndex}" data-admin-hours-remove-window="${windowIndex}" ${portalState.adminSaving ? "disabled" : ""} aria-label="Remove hours window">×</button>
      ` : ""}
    </div>
  `;
}

function formatBusinessWindow(window) {
  return `${formatTimeOfDay(window?.start)}-${formatTimeOfDay(window?.end)}`;
}

function renderMenuKnowledgeModule(menuItems) {
  const groups = groupMenuItemsByCategory(menuItems);
  const saving = portalState.adminSaving && portalState.adminSavingTarget === "menuKnowledge";
  return renderIosModule({
    title: "Menu Knowledge",
    icon: "list.bullet.rectangle",
    open: isOnboardingModuleOpen("menuKnowledge"),
    meta: `${menuItems.length} items`,
    detailsAttributes: `data-admin-onboarding-module="menuKnowledge" data-admin-menu-knowledge-details`,
    content: `
      <p class="ios-footnote">Provider-synced menus keep prices and item IDs in sync. Hide items or categories here to keep them out of the agent without changing the POS.</p>
      ${adminSaveStatusMarkup("menuKnowledge")}
      ${groups.map((group) => renderMenuCategoryDisclosure(group)).join("")}
      <div class="menu-knowledge-save-row">
        <button class="ios-action-button primary" type="button" data-admin-menu-save ${portalState.adminSaving ? "disabled" : ""}>
          ${saving ? "Saving..." : "Save Menu Knowledge"}
        </button>
      </div>
    `
  });
}

function groupMenuItemsByCategory(menuItems) {
  const groups = new Map();
  menuItems.forEach((item) => {
    const title = item.category || "Uncategorized";
    if (!groups.has(title)) {
      groups.set(title, []);
    }
    groups.get(title).push(item);
  });
  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([title, items]) => ({
      title,
      items: items.sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""))),
      visibleCount: items.filter((item) => !menuItemHiddenForAgent(item)).length
    }));
}

function renderMenuCategoryDisclosure(group) {
  const hiddenFromAgent = group.visibleCount === 0;
  const visibilityLabel = hiddenFromAgent
    ? `Show ${group.title} to the agent`
    : `Hide ${group.title} from the agent`;
  const isOpen = portalState.adminMenuOpenCategories.has(group.title);
  return `
    <details
      class="ios-nested-disclosure menu-category-disclosure"
      data-admin-menu-category-details="${escapeHTML(group.title)}"
      ${isOpen ? "open" : ""}
    >
      <summary>
        <span>${escapeHTML(group.title)}</span>
        <em data-admin-menu-category-count>${escapeHTML(`${group.visibleCount}/${group.items.length} visible`)}</em>
      </summary>
      ${renderAgentVisibilityButton(
        hiddenFromAgent,
        visibilityLabel,
        `data-admin-menu-category-visibility="${escapeHTML(group.title)}"`
      )}
      <div class="ios-nested-body">
        ${group.items.map(renderMenuItemDisclosure).join("")}
      </div>
    </details>
  `;
}

function renderMenuItemDisclosure(item) {
  const hiddenFromAgent = menuItemHiddenForAgent(item);
  const title = `${item.name || "Unnamed item"}${Number.isFinite(Number(item.priceCents)) ? ` - ${money(Number(item.priceCents))}` : ""}`;
  const visibilityLabel = hiddenFromAgent
    ? `Show ${item.name || "menu item"} to the agent`
    : `Hide ${item.name || "menu item"} from the agent`;
  const itemId = typeof item.id === "string" ? item.id.trim() : "";
  const isOpen = itemId ? portalState.adminMenuOpenItems.has(itemId) : false;
  return `
    <details
      class="ios-nested-disclosure menu-item-disclosure"
      data-admin-menu-item-details="${escapeHTML(itemId)}"
      ${isOpen ? "open" : ""}
    >
      <summary>
        <span>${escapeHTML(title)}</span>
        <em data-admin-menu-item-state>${escapeHTML(hiddenFromAgent ? "Hidden" : "Visible")}</em>
      </summary>
      ${renderAgentVisibilityButton(
        hiddenFromAgent,
        visibilityLabel,
        `data-admin-menu-item-visibility="${escapeHTML(itemId)}"`
      )}
      <div class="ios-nested-body">
        ${renderMenuItemKnowledgeDetail(item)}
      </div>
    </details>
  `;
}

function renderMenuItemKnowledgeDetail(item) {
  const itemId = typeof item?.id === "string" ? item.id.trim() : "";
  const draft = menuKnowledgeDraftForItem(item);
  return `
    <div class="menu-item-knowledge-detail">
      <div class="menu-item-copy-block">
        <h3>${escapeHTML(item.name || "Unnamed item")}</h3>
        <label class="menu-knowledge-field">
          <span>Agent description</span>
          <textarea
            rows="4"
            data-admin-menu-item-id="${escapeHTML(itemId)}"
            data-admin-menu-item-field="description"
            placeholder="Description the voice agent can use for this menu item."
            ${portalState.adminSaving ? "disabled" : ""}
          >${escapeHTML(draft.description || "")}</textarea>
        </label>
        <label class="menu-knowledge-field">
          <span>Alias / nicknames</span>
          <input
            type="text"
            value="${escapeHTML(draft.aliasesText || "")}"
            data-admin-menu-item-id="${escapeHTML(itemId)}"
            data-admin-menu-item-field="aliases"
            placeholder="Brushfire, spicy jerk taco"
            autocomplete="off"
            ${portalState.adminSaving ? "disabled" : ""}
          >
          <small>Use commas to add multiple nicknames.</small>
        </label>
      </div>
      ${renderModifierGroups(item, item.modifierGroups || [], item.name || "this item")}
    </div>
  `;
}

function renderModifierGroups(item, groups, itemName) {
  if (!Array.isArray(groups) || !groups.length) {
    return `<p class="menu-modifier-empty">No modifier groups synced for this item.</p>`;
  }
  return `
    <div class="menu-modifier-presentation-list">
      ${groups.map((group) => renderModifierPresentationEditor(item, group, itemName)).join("")}
    </div>
  `;
}

function renderModifierPresentationEditor(item, group, itemName) {
  const itemId = typeof item?.id === "string" ? item.id.trim() : "";
  const groupId = typeof group?.id === "string" ? group.id.trim() : "";
  const options = Array.isArray(group.options) ? group.options : [];
  const presentation = menuKnowledgeDraftForModifierGroup(item, group);
  const effectiveGroup = { ...group, presentation };
  const displayGroupName = modifierGroupDisplayName(effectiveGroup);
  const optionsSummary = modifierOptionsSummary(effectiveGroup);
  const sampleOption = modifierSampleOption(effectiveGroup);
  const askBehavior = modifierAskBehavior(effectiveGroup);
  const questionExample = renderModifierTemplate(
    presentation.questionTemplate,
    itemName,
    displayGroupName,
    sampleOption,
    optionsSummary,
    `Do you want ${itemName} with ${optionsSummary}?`
  );
  const confirmationExample = renderModifierTemplate(
    presentation.confirmationTemplate,
    itemName,
    displayGroupName,
    sampleOption,
    optionsSummary,
    `Got it. ${itemName} with ${sampleOption}.`
  );
  const readbackExample = renderModifierTemplate(
    presentation.readbackTemplate,
    itemName,
    displayGroupName,
    sampleOption,
    optionsSummary,
    `${itemName} with ${sampleOption}`
  );

  return `
    <section class="menu-modifier-editor">
      <h4>${escapeHTML(group.name || "Modifier group")}</h4>
      ${options.length ? `
        <p class="menu-modifier-muted">Choices the caller can pick: ${escapeHTML(options.map((option) => option.name || "Option").join(", "))}</p>
      ` : ""}

      <div class="menu-modifier-field">
        <h5>What should the agent call this choice?</h5>
        <input
          class="menu-modifier-input"
          type="text"
          value="${escapeHTML(presentation.displayName || "")}"
          data-admin-modifier-item-id="${escapeHTML(itemId)}"
          data-admin-modifier-group-id="${escapeHTML(groupId)}"
          data-admin-modifier-field="displayName"
          placeholder="${escapeHTML(group.name || "Modifier group")}"
          autocomplete="off"
          ${portalState.adminSaving ? "disabled" : ""}
        >
        <p class="menu-modifier-hint">Leave blank to use the Clover modifier group name.</p>
      </div>

      ${options.length ? `
        <div class="menu-modifier-field">
          <h5>What should the agent call each option?</h5>
          <div class="menu-modifier-options">
            ${options.map((option) => renderModifierOptionDisplay(itemId, groupId, option, presentation.optionDisplayNames || {})).join("")}
          </div>
          <p class="menu-modifier-hint">Leave blank to use the Clover modifier name.</p>
        </div>
      ` : ""}

      <div class="menu-modifier-default-row">
        <span>When the caller does not specify</span>
        <label>
          <select
            data-admin-modifier-item-id="${escapeHTML(itemId)}"
            data-admin-modifier-group-id="${escapeHTML(groupId)}"
            data-admin-modifier-field="askBehavior"
            ${portalState.adminSaving ? "disabled" : ""}
          >
            ${modifierAskBehaviorOptions().map((option) => `
              <option value="${escapeHTML(option.value)}" ${option.value === askBehavior ? "selected" : ""}>${escapeHTML(option.label)}</option>
            `).join("")}
          </select>
          <b aria-hidden="true">⌄</b>
        </label>
      </div>
      <p class="menu-modifier-muted" data-admin-modifier-help>${escapeHTML(modifierDefaultHandlingHelpText(askBehavior))}</p>

      <div class="menu-modifier-examples">
        <h5>What the caller will hear</h5>
        ${renderModifierExampleLine("Agent will ask", questionExample, "ask", "data-admin-modifier-ask-example", askBehavior === "apply_default_silently")}
        ${renderModifierExampleLine("Agent will confirm", confirmationExample, "confirm")}
        ${renderModifierExampleLine("Agent will read back", readbackExample, "readback")}
      </div>

      <details class="menu-modifier-custom">
        <summary>Custom wording (optional)</summary>
        <div>
          <p class="menu-modifier-muted">Only fill these in if you want to override the automatic wording.</p>
          ${renderModifierCustomValue("Custom question the agent asks", presentation.questionTemplate, itemId, groupId, "questionTemplate", "Do you want {item} with {options}?")}
          ${renderModifierCustomValue("Custom confirmation after selection", presentation.confirmationTemplate, itemId, groupId, "confirmationTemplate", "Got it. {item} with {option}.")}
          ${renderModifierCustomValue("Custom wording when reading the order back", presentation.readbackTemplate, itemId, groupId, "readbackTemplate", "{item} with {option}")}
          <p class="menu-modifier-hint">You can use: {item}, {group}, {option}, {options}.</p>
        </div>
      </details>
    </section>
  `;
}

function renderModifierOptionDisplay(itemId, groupId, option, optionDisplayNames) {
  const optionId = typeof option?.id === "string" ? option.id : "";
  const displayName = typeof optionDisplayNames?.[optionId] === "string" ? optionDisplayNames[optionId].trim() : "";
  return `
    <div class="menu-modifier-option-row">
      <span>${escapeHTML(option?.name || "Option")}</span>
      <input
        class="menu-modifier-input compact"
        type="text"
        value="${escapeHTML(displayName)}"
        data-admin-modifier-item-id="${escapeHTML(itemId)}"
        data-admin-modifier-group-id="${escapeHTML(groupId)}"
        data-admin-modifier-option-id="${escapeHTML(optionId)}"
        data-admin-modifier-field="optionDisplayName"
        placeholder="Optional spoken name"
        autocomplete="off"
        ${portalState.adminSaving ? "disabled" : ""}
      >
    </div>
  `;
}

function renderModifierExampleLine(title, text, tone, attributes = "", hidden = false) {
  return `
    <div class="menu-modifier-example ${escapeHTML(tone)}" ${attributes} ${hidden ? "hidden" : ""}>
      <span>${escapeHTML(title)}</span>
      <strong>“${escapeHTML(text)}”</strong>
    </div>
  `;
}

function renderModifierCustomValue(label, value, itemId, groupId, fieldName, placeholder) {
  const text = typeof value === "string" && value.trim() ? value.trim() : "";
  return `
    <label class="menu-modifier-custom-value">
      <span>${escapeHTML(label)}</span>
      <textarea
        class="menu-modifier-input"
        rows="2"
        data-admin-modifier-item-id="${escapeHTML(itemId)}"
        data-admin-modifier-group-id="${escapeHTML(groupId)}"
        data-admin-modifier-field="${escapeHTML(fieldName)}"
        placeholder="${escapeHTML(placeholder)}"
        ${portalState.adminSaving ? "disabled" : ""}
      >${escapeHTML(text)}</textarea>
    </label>
  `;
}

function modifierAskBehavior(group) {
  const value = group?.presentation?.askBehavior;
  return normalizedModifierAskBehavior(value);
}

function normalizedModifierAskBehavior(value) {
  return value === "always_ask" || value === "ask_if_no_default" ? value : "apply_default_silently";
}

function modifierAskBehaviorOptions() {
  return [
    { value: "apply_default_silently", label: "Use the restaurant default" },
    { value: "always_ask", label: "Always ask" },
    { value: "ask_if_no_default", label: "Ask only if no default exists" }
  ];
}

function modifierAskBehaviorTitle(askBehavior) {
  if (askBehavior === "always_ask") {
    return "Always ask";
  }
  if (askBehavior === "ask_if_no_default") {
    return "Ask only if no default exists";
  }
  return "Use the restaurant default";
}

function modifierDefaultHandlingHelpText(askBehavior) {
  if (askBehavior === "always_ask") {
    return "The agent will always ask the caller before choosing one.";
  }
  if (askBehavior === "ask_if_no_default") {
    return "The agent will use a default when Clover provides one, otherwise it will ask.";
  }
  return "The agent will use the Clover default unless the caller asks for something different.";
}

function modifierGroupDisplayName(group) {
  const displayName = typeof group?.presentation?.displayName === "string" ? group.presentation.displayName.trim() : "";
  return displayName || group?.name || "Modifier group";
}

function modifierOptionDisplayName(group, option) {
  const optionId = typeof option?.id === "string" ? option.id : "";
  const optionDisplayNames = group?.presentation?.optionDisplayNames || {};
  const displayName = typeof optionDisplayNames?.[optionId] === "string" ? optionDisplayNames[optionId].trim() : "";
  return displayName || option?.name || "the default option";
}

function modifierSampleOption(group) {
  const options = Array.isArray(group?.options) ? group.options : [];
  const defaultId = typeof group?.defaultOptionId === "string" ? group.defaultOptionId : "";
  const defaultOption = defaultId ? options.find((option) => option.id === defaultId) : null;
  return modifierOptionDisplayName(group, defaultOption || options[0] || null);
}

function modifierOptionsSummary(group) {
  const options = Array.isArray(group?.options) ? group.options : [];
  if (!options.length) {
    return "the available options";
  }
  return options.map((option) => modifierOptionDisplayName(group, option)).join(" or ");
}

function renderModifierTemplate(template, itemName, groupName, optionName, optionsSummary, fallback) {
  const text = typeof template === "string" && template.trim() ? template.trim() : fallback;
  return text
    .replaceAll("{item}", itemName)
    .replaceAll("{group}", groupName)
    .replaceAll("{option}", optionName)
    .replaceAll("{options}", optionsSummary);
}

function renderTeamAccessModule() {
  const members = portalState.adminTeamMembers || [];
  const activeMembers = members.filter((member) => member.status === "active");
  return renderIosModule({
    title: "Team Access",
    icon: "person.2.badge.gearshape",
    open: false,
    meta: `${activeMembers.length} active`,
    content: `
      ${members.length ? members.map((member) => `
        <div class="ios-list-card">
          <strong>${escapeHTML(member.name || member.email || member.invitedEmail || "Team member")}</strong>
          <span>${escapeHTML(roleLabel(member.role))} · ${escapeHTML(formatSettingLabel(member.status))}</span>
        </div>
      `).join("") : `<p class="ios-footnote">No team members are configured yet.</p>`}
    `
  });
}

function renderAddIntegrationModule() {
  return renderIosModule({
    title: "Add Integration",
    icon: "plus.circle",
    open: true,
    content: `
      <div class="ios-button-grid">
        ${["clover", "toast", "square"].map((provider) => renderActionButton(posProviderLabels[provider], "plus.circle.fill")).join("")}
      </div>
    `
  });
}

function renderPosIntegrationsModule(integrations) {
  const byProvider = new Map((Array.isArray(integrations) ? integrations : []).map((integration) => [integration.provider, integration]));
  return renderIosModule({
    title: "POS Integrations",
    icon: "terminal",
    open: false,
    content: ["clover", "toast", "square"].map((provider) => {
      const integration = byProvider.get(provider);
      const detail = integration
        ? [
            integration.restaurantName,
            integration.merchantId ? `Merchant ${integration.merchantId}` : "",
            integration.lastMenuSyncItemCount ? `${integration.lastMenuSyncItemCount} synced menu items` : ""
          ].filter(Boolean).join(" · ")
        : "Not connected";
      return renderIntegrationStatusRow({
        title: posProviderLabels[provider],
        detail,
        stateLabel: integration ? formatSettingLabel(integration.status) : "Disconnected",
        actionTitle: integration?.status === "connected" ? "Sync Menu" : "Connect"
      }) + (provider === "toast" && integration ? `
        ${renderReadOnlyInputRow("Restaurant GUID", integration.restaurantGuid || "")}
        ${renderReadOnlyInputRow("Dining option GUID", integration.diningOptionGuid || "")}
        ${renderReadOnlyInputRow("Dining option name", integration.diningOptionName || "")}
      ` : "");
    }).join("")
  });
}

function renderPhonePaymentsModule(paymentProfile) {
  const title = paymentProfile.displayName || "Phone payments";
  const status = paymentProfile.status || "not_configured";
  const detail = paymentProfile.provider
    ? `${formatSettingLabel(paymentProfile.provider)} · ${paymentProfile.phonePaymentsEnabled ? "Phone payments enabled" : "Phone payments disabled"}`
    : "No payment provider is configured.";
  return renderIosModule({
    title: "Phone Payments",
    icon: "creditcard",
    open: false,
    content: `
      <div class="ios-button-grid">
        ${renderActionButton("Secure Keypad Entry", "phone.badge.checkmark")}
        ${renderActionButton("Stripe Connect", "creditcard")}
      </div>
      ${renderIntegrationStatusRow({
        title,
        detail,
        stateLabel: formatSettingLabel(status),
        actionTitle: status === "not_configured" ? "Set Up" : "Manage"
      })}
    `
  });
}

function renderIntegrationStatusRow({ title, detail, stateLabel, actionTitle }) {
  return `
    <div class="ios-integration-row">
      <div>
        <strong>${escapeHTML(title)}</strong>
        <span>${escapeHTML(detail || "Not configured")}</span>
      </div>
      <em>${escapeHTML(stateLabel)}</em>
      <button type="button" disabled>${escapeHTML(actionTitle || "Manage")}</button>
    </div>
  `;
}

function renderVoiceRuntimeModule(settings) {
  const menuCount = Array.isArray(settings.profile?.menuItems) ? settings.profile.menuItems.length : 0;
  return renderIosModule({
    title: "Voice Runtime",
    icon: "waveform",
    open: false,
    content: `
      ${renderSetupRow("ConversationRelay", "Live primary voice transport for the receptionist runtime", true)}
      ${renderSetupRow(
        "Menu-Aware Ordering",
        menuCount > 0
          ? `Agent reads ${menuCount} synced menu items from BusinessProfile.menuItems.`
          : "Agent reads BusinessProfile.menuItems after any POS menu sync or manual menu setup.",
        menuCount > 0
      )}
    `
  });
}

function renderSetupRow(title, detail, complete) {
  return `
    <div class="ios-setup-row">
      <span class="${complete ? "complete" : "in-progress"}" aria-hidden="true">${complete ? "✓" : "…"}</span>
      <div>
        <strong>${escapeHTML(title)}</strong>
        <p>${escapeHTML(detail)}</p>
      </div>
    </div>
  `;
}

function renderReservationsConfigModule(config) {
  const serviceHours = config.serviceHours || {};
  return renderIosModule({
    title: "Reservations",
    icon: "calendar.badge.clock",
    open: false,
    content: `
      ${renderToggleRow("Reservations enabled", config.reservationsEnabled === true)}
      <p class="ios-footnote">Tavra can act as the restaurant's native reservation book without OpenTable, Resy, Tock, or another external platform. External providers can be added later without changing the reservation model.</p>
      ${renderIntegrationStatusRow({
        title: "Reservation Integrations",
        detail: reservationProviderDetail(config.externalProvider),
        stateLabel: "Read only",
        actionTitle: "Inspect"
      })}
      ${renderPickerRow("Mode", formatSettingLabel(config.reservationMode))}
      ${renderPickerRow("Fallback", formatSettingLabel(config.fallbackBehavior))}
      ${renderPickerRow("Default status", formatSettingLabel(config.defaultReservationStatus))}
      ${renderValueRow("Party size", `${config.minPartySize || 1}-${config.maxPartySize || 12} guests`)}
      ${renderPickerRow("Reservation spacing", `${config.reservationTimeSlotMinutes || 15} minutes`)}
      ${renderValueRow("Max covers/hour", config.maxCoversPerHour ?? "Not set")}
      ${renderValueRow("Max covers/slot", config.maxCoversPerSlot ?? "Not set")}
      ${renderValueRow("Max parties/slot", config.maxPartiesPerSlot ?? "Not set")}
      ${renderValueRow("Advance booking min", `${config.advanceBookingMinHours ?? 0} hours`)}
      ${renderValueRow("Advance booking max", `${config.advanceBookingMaxDays ?? 0} days`)}
      ${renderNestedDisclosure("Closed Days", renderClosedDays(config.closedDays || []), false)}
      ${renderNestedDisclosure("Bookable Hours", renderReservationServiceHours(serviceHours), false)}
      ${renderToggleRow("Send confirmation SMS", config.confirmationSmsEnabled === true)}
      ${renderToggleRow("Owner notification SMS", config.ownerNotificationSmsEnabled === true)}
      ${renderToggleRow("Owner notification email", config.ownerNotificationEmailEnabled === true)}
      ${renderActionButton("Save Reservation Settings")}
    `
  });
}

function reservationProviderDetail(provider) {
  if (!provider?.enabled) {
    return "Native Tavra book";
  }
  return [
    formatSettingLabel(provider.providerId),
    formatSettingLabel(provider.syncDirection),
    provider.providerLocationId
  ].filter(Boolean).join(" · ");
}

function renderClosedDays(closedDays) {
  const closed = new Set(Array.isArray(closedDays) ? closedDays : []);
  return reservationWeekdayNames.map((label, index) => renderToggleRow(label, closed.has(index), closed.has(index) ? "Closed" : "Bookable")).join("");
}

function renderReservationServiceHours(serviceHours) {
  const rows = Object.entries(serviceHours || {});
  if (!rows.length) {
    return `<p class="ios-footnote">No bookable hours are configured.</p>`;
  }
  return rows.map(([key, windows]) => `
    <div class="ios-day-row">
      <strong>${escapeHTML(reservationWeekdayNames[Number(key)] || formatSettingLabel(key))}</strong>
      <span>${escapeHTML(Array.isArray(windows) && windows.length ? windows.map(formatBusinessWindow).join(", ") : "Closed")}</span>
    </div>
  `).join("");
}

function renderMiscRequestCategoriesModule(categories) {
  const enabledCount = (Array.isArray(categories) ? categories : []).filter((category) => category.enabled !== false).length;
  return renderIosModule({
    title: "Other Caller Questions",
    icon: "questionmark.bubble",
    open: false,
    meta: `${enabledCount} enabled`,
    content: `
      <p class="ios-footnote">Configure how Tavra handles caller requests that are not reservations or to-go orders. Each category has its own answer, routing target, and optional custom phone number. Handoff Routes still define the restaurant's reusable staff destinations.</p>
      ${(Array.isArray(categories) ? categories : []).map(renderMiscRequestCategory).join("")}
      ${renderActionButton("Save Other Caller Questions")}
    `
  });
}

function renderMiscRequestCategory(category) {
  return renderNestedDisclosure(
    category.displayName || category.categoryKey || "Caller question",
    `
      ${renderToggleRow("Enabled", category.enabled !== false)}
      ${renderPickerRow("Handling", formatSettingLabel(category.handlingMode))}
      ${renderPickerRow("Source", formatSettingLabel(category.sourceType))}
      ${renderPickerRow("Routing target", formatSettingLabel(category.routingTargetType))}
      ${renderValueRow("Required caller fields", Array.isArray(category.requiredCallerFields) && category.requiredCallerFields.length ? category.requiredCallerFields.map(formatSettingLabel).join(", ") : "None")}
      ${renderReadOnlyInputRow("Public answer", category.publicAnswerTemplate || category.ownerProvidedKnowledge || "", true)}
      ${category.lastSyncStatus ? renderValueRow("Last sync", formatSettingLabel(category.lastSyncStatus), category.lastSyncedAt || "") : ""}
    `,
    false,
    category.enabled === false ? "Off" : "On"
  );
}

function handoffRoutesWithDefaults(routes) {
  const byId = new Map((Array.isArray(routes) ? routes : []).map((route) => [route.id, route]));
  return [
    {
      id: "manager",
      label: "Manager",
      description: "Escalations, complaints, urgent issues",
      phoneNumber: "",
      enabled: false,
      timeoutSeconds: 20,
      liveTransferPolicy: "urgent_only",
      ...byId.get("manager")
    },
    {
      id: "front_desk",
      label: "Host Stand",
      description: "General questions requiring a human",
      phoneNumber: "",
      enabled: false,
      timeoutSeconds: 15,
      liveTransferPolicy: "all_matches",
      ...byId.get("front_desk")
    }
  ];
}

function renderHandoffRoutesModule(routes) {
  return renderIosModule({
    title: "Live Handoff Routes",
    icon: "phone.arrow.up.right",
    open: false,
    meta: `${handoffRoutesWithDefaults(routes).filter((route) => route.enabled).length} enabled`,
    content: `
      <p class="ios-footnote">Use a direct number Tavra can call for live handoffs. Do not use the same public number that forwards calls to Tavra.</p>
      ${handoffRoutesWithDefaults(routes).map((route) => renderNestedDisclosure(
        route.label || route.id,
        `
          ${renderToggleRow("Enabled", route.enabled === true)}
          ${renderReadOnlyInputRow("Phone number", route.phoneNumber || "")}
          ${renderReadOnlyInputRow("Description", route.description || "", true)}
          ${renderPickerRow("Timeout", `${route.timeoutSeconds || 15} seconds`)}
          ${route.id === "manager" ? renderPickerRow("Manager live calls", formatSettingLabel(route.liveTransferPolicy)) : ""}
        `,
        false,
        route.enabled ? "On" : "Off"
      )).join("")}
      ${renderActionButton("Save Handoff Routes")}
    `
  });
}

function renderKitchenPrintingModule(posPrinting) {
  const targets = Array.isArray(posPrinting.targets) ? posPrinting.targets : [];
  return renderIosModule({
    title: "Kitchen Printing",
    icon: "printer",
    open: false,
    content: `
      <p class="ios-footnote">Tavra routes paid order print requests through the configured POS or printer target when that provider supports order printing.</p>
      ${renderToggleRow("Print new paid orders", posPrinting.enabled === true)}
      ${targets.length ? targets.map((target) => `
        <div class="ios-list-card">
          <strong>${escapeHTML(target.label || "Printer target")}</strong>
          <span>${escapeHTML([formatSettingLabel(target.provider), target.description, target.deviceId ? `Device ID: ${target.deviceId}` : ""].filter(Boolean).join(" · "))}</span>
        </div>
      `).join("") : `<p class="ios-footnote">No printer targets are configured.</p>`}
      ${renderActionButton("Save Printer Settings")}
    `
  });
}

function renderSystemFallbacksModule(rawFallbacks) {
  const fallbacks = { ...defaultSystemFallbacks, ...(rawFallbacks || {}) };
  return renderIosModule({
    title: "System Fallbacks",
    icon: "exclamationmark.arrow.triangle.2.circlepath",
    open: false,
    content: `
      <p class="ios-footnote">Separates provider/API outages from in-store device and printer outages during a live call.</p>
      ${renderPickerRow("Store devices offline", formatSettingLabel(fallbacks.localDeviceOfflineBehavior))}
      ${renderPickerRow("Provider/API unavailable", formatSettingLabel(fallbacks.orderSubmissionFailureBehavior))}
      ${renderPickerRow("Printer offline after order accepted", formatSettingLabel(fallbacks.printerFailureBehavior))}
      ${renderPickerRow("Payment failure", formatSettingLabel(fallbacks.paymentFailureBehavior))}
      ${renderPickerRow("Fallback route", formatSettingLabel(fallbacks.systemFallbackRouteId))}
      ${renderToggleRow("Mark in Operations for staff", fallbacks.notifyStaffOnSystemFallback === true)}
      ${renderReadOnlyInputRow("Caller-facing fallback message", fallbacks.connectedSystemUnavailableMessage || "", true)}
      ${renderActionButton("Save System Fallbacks")}
    `
  });
}

function renderLiveCallVoiceModule(settings) {
  const voiceSettings = settings.callFlowConfig?.config?.conversationRelayVoice || {};
  const elevenLabsOptions = Array.isArray(settings.elevenLabsVoices) ? settings.elevenLabsVoices : [];
  return renderIosModule({
    title: "Live Call Voice",
    icon: "speaker.wave.2",
    open: false,
    content: `
      <p class="ios-footnote">This setting controls your Agent's voice</p>
      ${renderValueRow("Current provider", voiceSettings.ttsProvider || "Google")}
      ${renderValueRow("Current voice", voiceDisplayName(voiceSettings, elevenLabsOptions))}
      ${elevenLabsOptions.length ? `
        <div class="ios-subgroup">
          <h4>ElevenLabs</h4>
          ${elevenLabsOptions.map((option) => renderVoiceOptionCard({
            title: option.friendlyName,
            detail: option.description || "Curated ElevenLabs voice for live ConversationRelay calls.",
            selected: voiceSettings.ttsProvider === "ElevenLabs" && normalizeElevenLabsVoiceId(voiceSettings.voice) === option.voiceId
          })).join("")}
        </div>
      ` : ""}
      <div class="ios-subgroup">
        <h4>Google ConversationRelay</h4>
        ${googleConversationRelayVoiceOptions.map((option) => renderVoiceOptionCard({
          title: option.title,
          detail: option.detail,
          selected: voiceSettings.ttsProvider === "Google" && voiceSettings.voice === option.voice
        })).join("")}
      </div>
      ${renderActionButton("Save Live Voice Preference")}
      <p class="ios-footnote">Voice changes are saved immediately for the next inbound call. ElevenLabs previews use the restaurant name currently loaded from Parse.</p>
    `
  });
}

function normalizeElevenLabsVoiceId(voice) {
  return typeof voice === "string" && voice.trim() ? voice.trim().split("-")[0] : null;
}

function voiceDisplayName(voiceSettings, elevenLabsOptions) {
  if (voiceSettings.ttsProvider === "ElevenLabs") {
    const voiceId = normalizeElevenLabsVoiceId(voiceSettings.voice);
    const option = elevenLabsOptions.find((item) => item.voiceId === voiceId);
    return option?.friendlyName || voiceId || "Not set";
  }
  const google = googleConversationRelayVoiceOptions.find((option) => option.voice === voiceSettings.voice);
  return google?.title || voiceSettings.voice || "Google Journey O";
}

function renderVoiceOptionCard({ title, detail, selected }) {
  return `
    <div class="ios-list-card voice ${selected ? "selected" : ""}">
      <strong>${escapeHTML(title || "Voice")}</strong>
      <span>${escapeHTML(detail || "")}</span>
      <em>${selected ? "Selected" : "Available"}</em>
    </div>
  `;
}

function renderDeepgramAuraPreviewModule() {
  return renderIosModule({
    title: "Deepgram Aura Preview",
    icon: "waveform.circle",
    open: false,
    content: `
      <p class="ios-footnote">These previews are real Deepgram Aura renders. They do not control the live caller voice while ConversationRelay remains responsible for TTS.</p>
      ${deepgramAuraPreviewOptions.map((option) => renderVoiceOptionCard({
        title: option.title,
        detail: `${option.detail} Model: ${option.model}`,
        selected: false
      })).join("")}
    `
  });
}

function renderPlaceholderSection(section) {
  if (!portalContent || !pageTitle || !pageKicker) {
    return;
  }
  const copy = sectionCopy[section] || sectionCopy.settings;
  pageTitle.textContent = copy.title;
  pageKicker.textContent = copy.kicker;
  portalContent.innerHTML = `
    <section class="placeholder-panel">
      <p class="eyebrow blue">Coming into the web portal</p>
      <h2>${escapeHTML(copy.title)}</h2>
      <p>${escapeHTML(copy.body)}</p>
      <ul>
        ${copy.bullets.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
      </ul>
    </section>
  `;
}

function showLogin() {
  if (!loginScreen || !portalApp) {
    return;
  }
  stopPortalVoicemail();
  resetPortalFoodOrdersLiveQuery();
  resetPortalReservationsLiveQuery();
  resetPortalCallLogsLiveQuery();
  stopPortalCallLogsPolling();
  document.body.classList.remove("portal-authenticated");
  document.body.classList.remove("portal-reservations-page");
  document.body.classList.remove("portal-food-orders-page");
  document.body.classList.remove("portal-call-logs-page");
  document.body.classList.remove("portal-voicemail-page");
  document.body.classList.remove("portal-wait-list-page");
  document.body.classList.remove("portal-menu86-page");
  document.body.classList.remove("portal-admin-page");
  portalState.session = null;
  portalState.membership = null;
  portalState.business = null;
  portalState.adminSettings = null;
  portalState.adminTeamMembers = [];
  portalState.adminSettingsLoaded = false;
  portalState.adminSettingsLoading = false;
  portalState.adminSettingsError = "";
  portalState.adminProfileDraft = null;
  portalState.adminBusinessHoursDraft = null;
  portalState.adminMenuVisibilityDraft = null;
  portalState.adminMenuKnowledgeDraft = null;
  portalState.adminOnboardingOpenModules = defaultOnboardingOpenModules();
  portalState.adminMenuKnowledgeOpen = false;
  portalState.adminMenuOpenCategories = new Set();
  portalState.adminMenuOpenItems = new Set();
  portalState.adminSavingTarget = null;
  portalState.adminSaving = false;
  portalState.adminSaveMessage = "";
  portalState.adminSaveIsError = false;
  clearStoredSession();
  loginScreen.hidden = false;
  loginScreen.removeAttribute("aria-hidden");
  portalApp.hidden = true;
  portalApp.setAttribute("aria-hidden", "true");
  portalApp.style.display = "";
}

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) {
    setLoginStatus("Enter your Tavra account email and password.", true);
    return;
  }

  loginSubmit.disabled = true;
  setLoginStatus("Checking account access...");
  try {
    await logIn(email, password);
    setLoginStatus("");
    renderShell();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message === "no_active_portal_access") {
      clearStoredSession();
      setLoginStatus("Login worked, but this account does not have active portal access yet.", true);
    } else if (message === "portal_shell_missing") {
      setLoginStatus("Login worked, but the portal shell could not render. Reload the page and try again.", true);
    } else {
      setLoginStatus("Login failed. Check your email and password.", true);
    }
  } finally {
    loginSubmit.disabled = false;
  }
});

logoutButton?.addEventListener("click", showLogin);

sectionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const section = button.dataset.section || "operations";
    setActiveSection(section);
  });
});

async function boot() {
  const stored = readStoredSession();
  if (!stored?.sessionToken) {
    showLogin();
    return;
  }
  portalState.session = stored;
  try {
    await refreshMembership();
    renderShell();
  } catch {
    showLogin();
    setLoginStatus("Your portal session expired. Log in again.", true);
  }
}

boot();

window.addEventListener("error", (event) => {
  if (!document.body.classList.contains("portal-authenticated")) {
    setLoginStatus(`Portal render error: ${event.message || "unknown error"}`, true);
  }
});

window.addEventListener("unhandledrejection", (event) => {
  if (!document.body.classList.contains("portal-authenticated")) {
    const reason = event.reason instanceof Error ? event.reason.message : String(event.reason || "unknown error");
    setLoginStatus(`Portal request error: ${reason}`, true);
  }
});
