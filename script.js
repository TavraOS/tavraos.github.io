const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const headerActions = document.querySelector(".header-actions");
const navLinks = Array.from(document.querySelectorAll(".site-nav a, .site-footer a[href^='#']"));
const callButton = document.querySelector("[data-call-modal]");
const modal = document.querySelector("[data-modal]");
const modalDialog = modal?.querySelector(".call-modal");
const modalClose = document.querySelector("[data-modal-close]");
const voiceSelect = document.querySelector("#voice-select");

// Future: replace this hardcoded list with Tavra voices loaded from Parse/Back4App
// once the public demo is connected to approved Tavra voice and call infrastructure.
const placeholderVoices = ["Bella", "Marcus", "Sofia", "Nate"];

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
  callButton?.focus();
}

function openModal() {
  if (!modal || !modalDialog) return;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  modalDialog.focus();
}

function seedPlaceholderVoices() {
  if (!voiceSelect) return;
  const current = Array.from(voiceSelect.options).map((option) => option.value);
  const needsSeed = placeholderVoices.some((voice) => !current.includes(voice));

  if (!needsSeed) return;

  voiceSelect.replaceChildren(
    ...placeholderVoices.map((voice) => {
      const option = document.createElement("option");
      option.value = voice;
      option.textContent = voice;
      return option;
    })
  );
}

seedPlaceholderVoices();

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
