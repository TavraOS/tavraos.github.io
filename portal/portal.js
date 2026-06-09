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

const operationModules = [
  {
    key: "foodOrders",
    label: "Food Orders",
    icon: "🥤",
    status: "Order work",
    description:
      "Food Orders will show submitted and in-progress phone orders, payment status, kitchen output, and staff follow-up when the full web module is enabled."
  },
  {
    key: "menu86",
    label: "86 Board",
    icon: "⚠",
    status: "Availability",
    description:
      "The 86 Board will let permitted team members mark unavailable ingredients or menu items and show the agent which items should not be sold."
  },
  {
    key: "callLogs",
    label: "Call Logs",
    icon: "☎",
    status: "Transcripts",
    description:
      "Call Logs will show completed calls, transcripts, workflow outcomes, caller details, and the records Tavra created during the conversation."
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
      "Reservations will become the web version of Tavra's native reservation book with timeline, list, and table views for phone-originated reservations."
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

const reservationTimeSlots = [
  "5:00 PM",
  "5:15 PM",
  "5:30 PM",
  "5:45 PM",
  "6:00 PM",
  "6:15 PM",
  "6:30 PM",
  "6:45 PM",
  "7:00 PM",
  "7:15 PM",
  "7:30 PM",
  "7:45 PM",
  "8:00 PM",
  "8:15 PM",
  "8:30 PM",
  "8:45 PM",
  "9:00 PM",
  "9:15 PM",
  "9:30 PM",
  "9:45 PM",
  "10:00 PM"
];

const reservationTimelineEvents = [
  { name: "Miller", party: 2, status: "confirmed", start: 1.1, span: 1.45, row: 0 },
  { name: "Thompson", party: 4, status: "confirmed", start: 4.2, span: 2.3, row: 0 },
  { name: "Garcia", party: 2, status: "confirmed", start: 7.15, span: 1.45, row: 0 },
  { name: "Patel", party: 4, status: "confirmed", start: 9.6, span: 1.95, row: 0 },
  { name: "Johnson", party: 6, status: "confirmed", start: 13.4, span: 2.5, row: 0 },
  { name: "Lee", party: 2, status: "confirmed", start: 17.2, span: 1.4, row: 0 },
  { name: "Brown", party: 4, status: "confirmed", start: 19.6, span: 2.0, row: 0 },
  { name: "Wilson", party: 4, status: "confirmed", start: 2.1, span: 2.0, row: 1 },
  { name: "Anderson", party: 2, status: "confirmed", start: 5.55, span: 2.3, row: 1 },
  { name: "Stewart", party: 4, status: "requested", start: 9.8, span: 2.65, row: 1 },
  { name: "Martinez", party: 4, status: "confirmed", start: 13.75, span: 2.1, row: 1 },
  { name: "Taylor", party: 2, status: "confirmed", start: 18.55, span: 1.7, row: 1 },
  { name: "Davis", party: 6, status: "requested", start: 0.25, span: 2.8, row: 2 },
  { name: "Moore", party: 2, status: "confirmed", start: 4.45, span: 1.5, row: 2 },
  { name: "Clark", party: 4, status: "confirmed", start: 7.25, span: 1.85, row: 2 },
  { name: "Robinson", party: 3, status: "requested", start: 10.75, span: 2.15, row: 2 },
  { name: "White", party: 4, status: "confirmed", start: 13.75, span: 2.1, row: 2 },
  { name: "Hall", party: 2, status: "cancelled", start: 19.95, span: 1.5, row: 2 },
  { name: "Martin", party: 2, status: "confirmed", start: 2.25, span: 1.65, row: 3 },
  { name: "Walker", party: 4, status: "requested", start: 5.25, span: 2.35, row: 3 },
  { name: "Young", party: 6, status: "confirmed", start: 9.45, span: 2.5, row: 3 },
  { name: "Allen", party: 2, status: "requested", start: 14.35, span: 2.2, row: 3 },
  { name: "King", party: 4, status: "confirmed", start: 18.85, span: 2.2, row: 3 },
  { name: "Harris", party: 4, status: "confirmed", start: 0.25, span: 2.1, row: 4 },
  { name: "Lewis", party: 2, status: "confirmed", start: 3.95, span: 1.55, row: 4 },
  { name: "Lee", party: 2, status: "confirmed", start: 6.95, span: 1.7, row: 4 },
  { name: "Perez", party: null, status: "declined", start: 11.8, span: 1.95, row: 4, note: "Declined" },
  { name: "Adams", party: 2, status: "confirmed", start: 16.05, span: 2.15, row: 4 },
  { name: "Baker", party: 4, status: "confirmed", start: 19.85, span: 2.15, row: 4 },
  { name: "Zimmerman", party: 2, status: "requested", start: 1.35, span: 2.4, row: 5 },
  { name: "Howard", party: 4, status: "confirmed", start: 5.1, span: 2.25, row: 5 },
  { name: "Wright", party: 6, status: "requested", start: 8.4, span: 2.35, row: 5 },
  { name: "Scott", party: 2, status: "confirmed", start: 13.35, span: 1.85, row: 5 },
  { name: "Green", party: 2, status: "cancelled", start: 19.7, span: 1.55, row: 5, note: "Cancelled" }
];

const reservationHourlyCapacity = [
  { time: "5:00 PM", count: "15 / 24", percent: 63, tone: "green" },
  { time: "6:00 PM", count: "22 / 24", percent: 92, tone: "yellow" },
  { time: "7:00 PM", count: "20 / 24", percent: 83, tone: "yellow" },
  { time: "8:00 PM", count: "18 / 24", percent: 75, tone: "green" },
  { time: "9:00 PM", count: "12 / 24", percent: 50, tone: "green" },
  { time: "10:00 PM", count: "0 / 24", percent: 0, tone: "gray" }
];

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
  section: "operations",
  activeModule: "foodOrders"
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

function permissionLabel(permission) {
  if (permission.write) {
    return "Writable";
  }
  if (permission.read) {
    return "Read only";
  }
  return "No access";
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
  setActiveSection(portalState.section);
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
  portalState.section = section;
  document.body.classList.toggle("portal-reservations-page", section === "reservations");
  sectionButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.section === section);
  });
  if (section === "operations") {
    renderOperations();
    return;
  }
  if (section === "reservations") {
    renderReservationsBook();
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
      portalState.activeModule = button.dataset.operationModule || "foodOrders";
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
        <span>${permissionLabel(permission)}</span>
      </span>
      <span class="tile-icon" aria-hidden="true">${module.icon}</span>
      <strong>${escapeHTML(module.label)}</strong>
      <span class="tile-status">${permission.write ? "RW" : permission.read ? "R" : "–"}</span>
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
  return `
    <div class="reservation-preview" aria-label="Reservations timeline preview">
      <div class="reservation-preview-bar">
        <span>Timeline</span>
        <span>5:00 PM - 10:00 PM</span>
      </div>
      <div class="reservation-timeline">
        <div class="reservation-row">
          <span class="reservation-chip">Miller · 2</span>
          <span class="reservation-chip">Garcia · 4</span>
          <span class="reservation-chip requested">Stewart · 4</span>
          <span class="reservation-chip">Johnson · 6</span>
        </div>
        <div class="reservation-row">
          <span class="reservation-chip">Davis · 6</span>
          <span class="reservation-chip">Moore · 2</span>
          <span class="reservation-chip declined">Perez · declined</span>
          <span class="reservation-chip">Lee · 2</span>
        </div>
      </div>
    </div>
  `;
}

function renderReservationsBook() {
  if (!portalContent || !pageTitle || !pageKicker) {
    return;
  }
  pageTitle.textContent = "Reservations";
  pageKicker.textContent = "Operations";
  portalContent.innerHTML = `
    <section class="reservation-book" aria-labelledby="reservation-book-title">
      <div class="reservation-workspace">
        <div class="reservation-book-top">
          <h1 id="reservation-book-title">Reservations</h1>
          <div class="reservation-top-actions">
            <button class="reservation-action dark" type="button">
              <span aria-hidden="true">◷</span>
              <span>Go to time</span>
            </button>
            <button class="reservation-action blue" type="button">
              <span aria-hidden="true">+</span>
              <span>Add reservation</span>
            </button>
          </div>
        </div>

        <div class="reservation-controls-row">
          <div class="reservation-view-switch" aria-label="Reservation view">
            <button class="active" type="button"><span aria-hidden="true">☷</span> Timeline</button>
            <button type="button"><span aria-hidden="true">☰</span> List</button>
            <button type="button"><span aria-hidden="true">▦</span> Table</button>
          </div>

          <div class="reservation-date-controls">
            <button class="date-step" type="button" aria-label="Previous day">‹</button>
            <button class="date-pill" type="button">
              <span aria-hidden="true">▣</span>
              <span>Saturday, May 10, 2026</span>
              <span aria-hidden="true">⌄</span>
            </button>
            <button class="today-pill" type="button">Today</button>
          </div>

          <div class="reservation-status-legend" aria-label="Reservation status legend">
            ${renderReservationLegendItem("confirmed", "Confirmed")}
            ${renderReservationLegendItem("requested", "Requested")}
            ${renderReservationLegendItem("declined", "Declined")}
            ${renderReservationLegendItem("cancelled", "Cancelled")}
          </div>
        </div>

        <div class="reservation-timeline-card" aria-label="Reservation timeline for Saturday, May 10, 2026">
          <div class="reservation-head-row time-row">
            <div class="reservation-label-cell">Time</div>
            <div class="reservation-slot-head">
              ${reservationTimeSlots.map(renderReservationTimeSlot).join("")}
            </div>
          </div>
          <div class="reservation-head-row capacity-row">
            <div class="reservation-label-cell">Max Covers / Slot</div>
            <div class="reservation-capacity-cells">
              ${reservationTimeSlots.map(() => "<span>24</span>").join("")}
            </div>
          </div>
          <div class="reservation-head-row capacity-row parties-row">
            <div class="reservation-label-cell">Max Parties / Slot</div>
            <div class="reservation-capacity-cells">
              ${reservationTimeSlots.map(() => "<span>6</span>").join("")}
            </div>
          </div>

          <div class="reservation-grid-area">
            <div class="reservation-now-line" style="--now: 8.8;" aria-label="Current time 7:12 PM">
              <span>7:12 PM</span>
            </div>
            ${reservationTimelineEvents.map(renderReservationEvent).join("")}
          </div>
        </div>

        <div class="reservation-bottom-row">
          <article class="reservation-night-card">
            <div>
              <h2>Night Overview</h2>
              <strong>87 / 96</strong>
              <span>Covers Reserved</span>
            </div>
            <div class="reservation-progress" aria-label="91 percent of total capacity">
              <svg viewBox="0 0 90 90" aria-hidden="true">
                <circle cx="45" cy="45" r="35"></circle>
                <circle class="progress" cx="45" cy="45" r="35"></circle>
              </svg>
              <b>91%</b>
              <span>of total capacity</span>
            </div>
          </article>

          <article class="reservation-hour-card" aria-label="Hourly reservation capacity">
            ${reservationHourlyCapacity.map(renderReservationHourCapacity).join("")}
          </article>

          <article class="reservation-legend-card">
            <h2>Legend</h2>
            <p><span aria-hidden="true">♧</span> Max 24 covers / 15 min</p>
            <p><span aria-hidden="true">♧</span> Max 6 parties / 15 min</p>
          </article>
        </div>

        <p class="reservation-timezone">All times shown in America/Chicago</p>
      </div>
    </section>
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
  const note = event.note || (event.party ? String(event.party) : "");
  return `
    <article
      class="reservation-event ${escapeHTML(event.status)}"
      style="--start: ${event.start}; --span: ${event.span}; --row: ${event.row};"
      aria-label="${escapeHTML(event.name)} ${escapeHTML(event.status)} reservation"
    >
      <strong>${escapeHTML(event.name)}</strong>
      <span>
        <i aria-hidden="true">♟</i>
        ${escapeHTML(note)}
      </span>
    </article>
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
  document.body.classList.remove("portal-authenticated");
  document.body.classList.remove("portal-reservations-page");
  portalState.session = null;
  portalState.membership = null;
  portalState.business = null;
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
