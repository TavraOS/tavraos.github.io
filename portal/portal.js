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
      "Food Orders shows submitted and in-progress phone orders, payment status, kitchen output, and staff follow-up."
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
  section: "operations",
  activeModule: "foodOrders",
  foodOrders: [],
  foodOrdersLoaded: false,
  foodOrdersLoading: false,
  foodOrdersError: "",
  foodOrderFilter: "active",
  expandedFoodOrderIds: new Set(),
  foodOrderUpdatingId: null,
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
  reservationDetailSaving: false,
  reservationDetailError: "",
  reservationNoteModal: null
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

  const lanes = [];
  const events = timedReservations.map((item) => {
    const start = (item.startMinutes - startMinute) / settings.slotMinutes;
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
      rawStatus: reservation.status || "requested",
      reservation,
      start,
      span,
      row,
      note: reservationStatusNote(reservation)
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
      tone: percent >= 85 ? "yellow" : percent > 0 ? "green" : "gray"
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
  document.body.classList.toggle("portal-food-orders-page", section === "foodOrders");
  const sidebarSection = section === "reservations" || section === "foodOrders" ? "operations" : section;
  sectionButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.section === sidebarSection);
  });
  if (section === "operations") {
    renderOperations();
    return;
  }
  if (section === "foodOrders") {
    renderFoodOrdersInbox();
    if (!portalState.foodOrdersLoaded && !portalState.foodOrdersLoading) {
      void loadPortalFoodOrders();
    }
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
      const moduleKey = button.dataset.operationModule || "foodOrders";
      portalState.activeModule = moduleKey;
      const permission = modulePermission(moduleKey);
      if (permission.read && moduleKey === "foodOrders") {
        setActiveSection("foodOrders");
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
      ${renderReservationNoteModal()}
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
  return `
    <button
      type="button"
      class="reservation-event ${escapeHTML(event.status)}"
      style="--start: ${event.start}; --span: ${event.span}; --row: ${event.row}; --reservation-name-size: ${nameSize}px;"
      data-reservation-detail="${escapeHTML(event.id)}"
      aria-label="${escapeHTML(event.name)} ${escapeHTML(event.rawStatus)} reservation"
    >
      <strong>${escapeHTML(event.name)}</strong>
      <span>
        <i aria-hidden="true">♟</i>
        ${escapeHTML(event.note)}
      </span>
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

function reservationNotesText(reservation) {
  const notes = [
    reservation.notes,
    reservation.specialRequests ? `Special requests: ${reservation.specialRequests}` : "",
    reservation.allergies ? `Allergies: ${reservation.allergies}` : "",
    reservation.occasion ? `Occasion: ${reservation.occasion}` : "",
    reservation.highChairRequest ? "High chair requested." : "",
    reservation.boosterSeatRequest ? "Booster seat requested." : "",
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
  return `
    <div class="reservation-modal-backdrop" role="presentation">
      <article class="reservation-modal reservation-detail-modal" aria-label="Reservation details">
        <div class="reservation-modal-head">
          <div>
            <p class="eyebrow blue">${escapeHTML(reservation.status || "requested")}</p>
            <h2>${escapeHTML(reservation.guestName || "Unknown guest")}</h2>
          </div>
          <button type="button" class="reservation-modal-close" data-reservation-detail-close aria-label="Close">×</button>
        </div>
        <div class="reservation-detail-grid">
          <p><span>When</span><strong>${escapeHTML(formatReservationDateTime(reservation))}</strong></p>
          <p><span>Party</span><strong>${escapeHTML(reservation.partySize || 1)} guests</strong></p>
          <p><span>Phone</span><strong>${escapeHTML(reservation.callbackNumber || reservation.callerPhoneNumber || "Not captured")}</strong></p>
          <p><span>Source</span><strong>${escapeHTML(reservation.source || "Tavra")}</strong></p>
        </div>
        <div class="reservation-note-box">
          <span>Reservation notes</span>
          <p>${escapeHTML(reservationNotesText(reservation)).replaceAll("\n", "<br>")}</p>
        </div>
        ${portalState.reservationDetailError ? `<p class="reservation-modal-error">${escapeHTML(portalState.reservationDetailError)}</p>` : ""}
        <div class="reservation-modal-actions">
          <button type="button" class="reservation-action dark" data-reservation-detail-close>Close</button>
          <button type="button" class="reservation-action green" data-reservation-status="checked_in" ${canWrite && !portalState.reservationDetailSaving ? "" : "disabled"}>Check in</button>
          <button type="button" class="reservation-action danger" data-reservation-status="no_show" ${canWrite && !portalState.reservationDetailSaving ? "" : "disabled"}>No-show</button>
        </div>
      </article>
    </div>
  `;
}

function renderReservationNoteModal() {
  if (!portalState.reservationNoteModal) {
    return "";
  }
  return `
    <div class="reservation-modal-backdrop" role="presentation">
      <article class="reservation-modal reservation-note-modal" aria-label="Reservation notes">
        <div class="reservation-modal-head">
          <div>
            <p class="eyebrow blue">Checked in</p>
            <h2>${escapeHTML(portalState.reservationNoteModal.guestName)}</h2>
          </div>
          <button type="button" class="reservation-modal-close" data-reservation-note-close aria-label="Close">×</button>
        </div>
        <div class="reservation-note-box large">
          <span>Surface these notes for the host stand</span>
          <p>${escapeHTML(portalState.reservationNoteModal.notes).replaceAll("\n", "<br>")}</p>
        </div>
        <div class="reservation-modal-actions">
          <button type="button" class="reservation-action blue" data-reservation-note-close>Done</button>
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

async function updatePortalReservationStatus(status) {
  const reservationId = portalState.reservationDetailId;
  if (!reservationId) {
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
    if (status === "checked_in") {
      portalState.reservationNoteModal = {
        guestName: payload.reservation?.guestName || "Guest",
        notes: reservationNotesText(payload.reservation || {})
      };
    }
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
  portalContent.querySelector("[data-reservation-phone]")?.addEventListener("input", (event) => {
    event.currentTarget.value = formatNorthAmericanPhone(event.currentTarget.value);
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
      portalState.reservationDetailError = "";
      renderReservationsBook();
    });
  });
  portalContent.querySelectorAll("[data-reservation-status]").forEach((button) => {
    button.addEventListener("click", () => {
      void updatePortalReservationStatus(button.dataset.reservationStatus || "requested");
    });
  });
  portalContent.querySelectorAll("[data-reservation-note-close]").forEach((button) => {
    button.addEventListener("click", () => {
      portalState.reservationNoteModal = null;
      renderReservationsBook();
    });
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
        <div class="food-order-action-row">
          ${actions.map((action) => `
            <button
              class="food-order-action ${action.role === "danger" ? "danger" : ""}"
              type="button"
              data-food-order-id="${escapeHTML(orderId)}"
              data-food-order-status="${escapeHTML(action.status)}"
              ${portalState.foodOrderUpdatingId === orderId ? "disabled" : ""}
            >
              ${escapeHTML(portalState.foodOrderUpdatingId === orderId ? "Updating..." : action.title)}
            </button>
          `).join("")}
        </div>
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
  if (kind === "active") {
    return [
      { title: "Complete", status: "completed" },
      { title: "Cancel", status: "cancelled", role: "danger" }
    ];
  }
  if (kind === "needsAttention") {
    return [
      { title: "Move to Active", status: "confirmed" },
      { title: "Cancel", status: "cancelled", role: "danger" }
    ];
  }
  return [];
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

function relativeFoodOrderTime(value) {
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
  document.body.classList.remove("portal-food-orders-page");
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
