(function () {
  "use strict";

  const deepLink = "aiansweringservice://support/new?source=website";
  const openButton = document.getElementById("open-tavra");
  const status = document.getElementById("launch-status");
  const statusText = status?.querySelector("span:last-child");
  let hasAttemptedLaunch = false;

  function setStatus(message) {
    if (statusText) {
      statusText.textContent = message;
    }
  }

  function launchTavra() {
    if (hasAttemptedLaunch) {
      return;
    }
    hasAttemptedLaunch = true;
    setStatus("Attempting to launch Tavra…");
    window.location.href = deepLink;
  }

  openButton?.addEventListener("click", function () {
    setStatus("Opening Tavra Support Center…");
  });

  window.addEventListener("load", function () {
    window.setTimeout(launchTavra, 140);
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      setStatus("Tavra should be opening now.");
    }
  });

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      hasAttemptedLaunch = true;
      setStatus("If you still need help, tap “Open Tavra Support.”");
    }
  });
}());
