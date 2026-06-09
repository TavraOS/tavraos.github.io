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

const reservationTimezone = "America/Chicago";
const reservationSlotMinutes = 15;
const defaultReservationStartMinutes = 17 * 60;
const defaultReservationEndMinutes = 22 * 60;
const reservationMaxCoversPerSlot = 24;
const reservationMaxPartiesPerSlot = 6;
const reservationActiveStatuses = new Set(["requested", "confirmed", "checked_in"]);

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
  activeModule: "foodOrders",
  reservations: [],
  reservationsLoaded: false,
  reservationsLoading: false,
  reservationLoadError: "",
  reservationSelectedDateKey: null
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

function datePartsInReservationTimezone(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: reservationTimezone,
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

function reservationsForSelectedDate() {
  const dateKey = portalState.reservationSelectedDateKey || chooseReservationDateKey(portalState.reservations);
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

function buildReservationTimelineModel() {
  const selectedDateKey = portalState.reservationSelectedDateKey || chooseReservationDateKey(portalState.reservations);
  const dateReservations = reservationsForSelectedDate();
  const timedReservations = dateReservations
    .map((reservation) => {
      const startDate = reservationStartDate(reservation);
      if (!startDate) {
        return null;
      }
      const endDate = reservationEndDate(reservation);
      const startMinutes = reservationMinutesOfDay(startDate);
      const endMinutes = endDate
        ? Math.max(startMinutes + reservationSlotMinutes, reservationMinutesOfDay(endDate))
        : startMinutes + 45;
      return { reservation, startDate, startMinutes, endMinutes };
    })
    .filter(Boolean)
    .sort((a, b) => a.startMinutes - b.startMinutes);

  const minReservationMinute = timedReservations.length
    ? Math.min(...timedReservations.map((item) => item.startMinutes))
    : defaultReservationStartMinutes;
  const maxReservationMinute = timedReservations.length
    ? Math.max(...timedReservations.map((item) => item.endMinutes))
    : defaultReservationEndMinutes;
  const startMinute = Math.min(defaultReservationStartMinutes, Math.floor(minReservationMinute / reservationSlotMinutes) * reservationSlotMinutes);
  const endMinute = Math.max(defaultReservationEndMinutes, Math.ceil(maxReservationMinute / reservationSlotMinutes) * reservationSlotMinutes);
  const slotLabels = [];
  for (let minute = startMinute; minute <= endMinute; minute += reservationSlotMinutes) {
    slotLabels.push(formatReservationTime(minute));
  }

  const lanes = [];
  const events = timedReservations.map((item) => {
    const start = (item.startMinutes - startMinute) / reservationSlotMinutes;
    const span = Math.max(1.35, (item.endMinutes - item.startMinutes) / reservationSlotMinutes);
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
      rawStatus: reservation.status || "requested",
      start,
      span,
      row,
      note: reservationStatusNote(reservation)
    };
  });

  const activeReservations = dateReservations.filter((reservation) => reservationActiveStatuses.has(reservation.status || "requested"));
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
    const percent = Math.min(100, Math.round((count / reservationMaxCoversPerSlot) * 100));
    return {
      time: formatReservationTime(minute),
      count: `${count} / ${reservationMaxCoversPerSlot}`,
      percent,
      tone: percent >= 85 ? "yellow" : percent > 0 ? "green" : "gray"
    };
  });

  const totalCapacity = Math.max(reservationMaxCoversPerSlot, hourStarts.length * reservationMaxCoversPerSlot);
  const totalPercent = Math.min(100, Math.round((coversReserved / totalCapacity) * 100));
  const progressOffset = Math.round(220 - ((220 * totalPercent) / 100));
  const now = new Date();
  const showNow = reservationDateKey(now) === selectedDateKey;
  const nowSlot = (reservationMinutesOfDay(now) - startMinute) / reservationSlotMinutes;
  return {
    selectedDateKey,
    slotLabels,
    events,
    rowCount: Math.max(6, lanes.length || 1),
    reservationsCount: dateReservations.length,
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
    portalState.reservationsLoaded = true;
    if (!portalState.reservationSelectedDateKey) {
      portalState.reservationSelectedDateKey = chooseReservationDateKey(portalState.reservations);
    }
  } catch (error) {
    portalState.reservationLoadError = error instanceof Error ? error.message : String(error);
  } finally {
    portalState.reservationsLoading = false;
    renderReservationsBook();
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
    if (!portalState.reservationsLoaded && !portalState.reservationsLoading) {
      void loadPortalReservations();
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
      : model.reservationsCount === 0
        ? `<div class="reservation-book-status">No reservations found for ${escapeHTML(dateLabel)}.</div>`
        : "";
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
            <button class="date-step" type="button" aria-label="Previous day" data-reservation-date-step="-1">‹</button>
            <button class="date-pill" type="button">
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

        ${statusMessage}

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
              ${model.slotLabels.map(() => `<span>${reservationMaxCoversPerSlot}</span>`).join("")}
            </div>
          </div>
          <div class="reservation-head-row capacity-row parties-row">
            <div class="reservation-label-cell">Max Parties / Slot</div>
            <div class="reservation-capacity-cells">
              ${model.slotLabels.map(() => `<span>${reservationMaxPartiesPerSlot}</span>`).join("")}
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
            <p><span aria-hidden="true">♧</span> Max 24 covers / 15 min</p>
            <p><span aria-hidden="true">♧</span> Max 6 parties / 15 min</p>
          </article>
        </div>

        <p class="reservation-timezone">All times shown in America/Chicago</p>
      </div>
    </section>
  `;
  portalContent.querySelector("[data-reservation-refresh]")?.addEventListener("click", () => {
    void loadPortalReservations();
  });
  portalContent.querySelectorAll("[data-reservation-date-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const offset = Number(button.dataset.reservationDateStep || 0);
      portalState.reservationSelectedDateKey = offsetDateKey(model.selectedDateKey, offset);
      renderReservationsBook();
    });
  });
  portalContent.querySelector("[data-reservation-today]")?.addEventListener("click", () => {
    portalState.reservationSelectedDateKey = dateKeyForToday();
    renderReservationsBook();
  });
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
  return `
    <article
      class="reservation-event ${escapeHTML(event.status)}"
      style="--start: ${event.start}; --span: ${event.span}; --row: ${event.row};"
      aria-label="${escapeHTML(event.name)} ${escapeHTML(event.rawStatus)} reservation"
    >
      <strong>${escapeHTML(event.name)}</strong>
      <span>
        <i aria-hidden="true">♟</i>
        ${escapeHTML(event.note)}
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
