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
const demoCallSubmit = document.querySelector("[data-demo-call-submit]");
const demoCallStatus = document.querySelector("[data-demo-call-status]");
const voiceSelect = document.querySelector("#voice-select");
const voiceStatus = document.querySelector("[data-voice-status]");
const locationInput = document.querySelector("#location-name");
const greetingTextarea = document.querySelector("#ai-greeting");
const greetingHighlight = document.querySelector("[data-greeting-highlight]");

const demoApiBaseUrl = ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ? "http://127.0.0.1:8787"
  : "https://obscure-taiga-94224-b609c8dc8cd4.herokuapp.com";

let syncedLocationName = locationInput?.value.trim() || "your restaurant";

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
  modal.hidden = false;
  document.body.classList.add("modal-open");
  window.setTimeout(() => demoPhoneInput?.focus() || modalDialog.focus(), 0);
}

function setVoiceStatus(message, state = "neutral") {
  if (!voiceStatus) return;
  voiceStatus.textContent = message;
  voiceStatus.dataset.state = state;
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

function greetingTemplate(locationName) {
  return `Thank you for calling ${locationName}. Would you like to place a to-go order, make a reservation, or something else?`;
}

function renderGreetingHighlight() {
  if (!greetingTextarea || !greetingHighlight) return;

  const greeting = greetingTextarea.value;
  const locationName = locationInput?.value.trim() || "";

  if (!locationName) {
    greetingHighlight.innerHTML = escapeHTML(greeting);
    return;
  }

  const pattern = new RegExp(escapeRegExp(locationName), "gi");
  greetingHighlight.innerHTML = escapeHTML(greeting).replace(pattern, (match) => `<mark>${match}</mark>`);
}

function syncGreetingToLocation() {
  if (!locationInput || !greetingTextarea) return;

  const nextLocationName = locationInput.value.trim() || "your restaurant";
  const previousPattern = syncedLocationName ? new RegExp(escapeRegExp(syncedLocationName), "g") : null;

  if (previousPattern && previousPattern.test(greetingTextarea.value)) {
    greetingTextarea.value = greetingTextarea.value.replace(previousPattern, nextLocationName);
  } else {
    greetingTextarea.value = greetingTemplate(nextLocationName);
  }

  syncedLocationName = nextLocationName;
  renderGreetingHighlight();
}

function voiceLabel(record) {
  const description = typeof record.description === "string" ? record.description.trim() : "";
  const friendlyName = typeof record.friendlyName === "string" ? record.friendlyName.trim() : "";
  return description ? `${friendlyName} - ${description}` : friendlyName;
}

function buildVoiceOption(record) {
  const option = document.createElement("option");
  const voiceId = typeof record.voiceId === "string" ? record.voiceId.trim() : "";
  const friendlyName = typeof record.friendlyName === "string" ? record.friendlyName.trim() : voiceId;

  option.value = voiceId;
  option.textContent = voiceLabel({ ...record, friendlyName }) || voiceId;
  option.dataset.voiceId = voiceId;

  if (record.objectId) {
    option.dataset.objectId = record.objectId;
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
    .filter((record) => typeof record.voiceId === "string" && record.voiceId.trim());
}

async function populateVoiceSelect() {
  if (!voiceSelect) return;

  voiceSelect.disabled = true;
  setVoiceStatus("Loading voice options.", "loading");

  try {
    const voices = await fetchTavraVoices();

    if (voices.length === 0) {
      throw new Error("No online Tavra voices were returned.");
    }

    voiceSelect.replaceChildren(...voices.map(buildVoiceOption));
    voiceSelect.disabled = false;
    setVoiceStatus("Voice options ready.", "ready");
  } catch (error) {
    console.error(error);
    const option = document.createElement("option");
    option.textContent = "Voice options unavailable";
    option.value = "";

    voiceSelect.replaceChildren(option);
    voiceSelect.disabled = true;
    setVoiceStatus("Voice options unavailable. Try again shortly.", "error");
  }
}

populateVoiceSelect();
renderGreetingHighlight();

function selectedVoicePayload() {
  if (!voiceSelect || !voiceSelect.value) {
    return {
      voiceId: null,
      voiceLabel: null
    };
  }

  const selected = voiceSelect.selectedOptions[0];
  return {
    voiceId: voiceSelect.value,
    voiceLabel: selected?.textContent?.trim() || null
  };
}

async function submitDemoCall(event) {
  event.preventDefault();

  if (!demoPhoneInput || !locationInput || !greetingTextarea) return;

  const phoneNumber = demoPhoneInput.value.trim();
  const businessName = locationInput.value.trim();
  const greeting = greetingTextarea.value.trim();
  const voice = selectedVoicePayload();

  if (!phoneNumber || !businessName || !greeting) {
    setDemoCallStatus("Add a phone number first.", "error");
    return;
  }

  demoCallSubmit?.setAttribute("disabled", "true");
  setDemoCallStatus("Placing the demo call...", "loading");

  try {
    const response = await fetch(`${demoApiBaseUrl}/demo/voice/calls`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phoneNumber,
        businessName,
        greeting,
        voiceId: voice.voiceId,
        voiceLabel: voice.voiceLabel
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || `Demo call request failed with ${response.status}`);
    }

    setDemoCallStatus("Call requested. Your phone should ring shortly.", "success");
  } catch (error) {
    console.error(error);
    setDemoCallStatus("The demo call could not be placed. Try again shortly.", "error");
  } finally {
    demoCallSubmit?.removeAttribute("disabled");
  }
}

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
});

document.addEventListener("click", (event) => {
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
