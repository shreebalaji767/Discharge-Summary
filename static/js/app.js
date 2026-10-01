/* BLSSNVJ21 Discharge Summary — browser-only manual storage enhancements */
(function () {
  "use strict";

  const KEY = "blssnvj21.discharge-summary.v2";
  const DRAFTS = "blssnvj21.discharge-summary.drafts.v1";

  function readSaved() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null");
    } catch (_) {
      return null;
    }
  }

  function toast(message) {
    let el = document.getElementById("appToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "appToast";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 2200);
  }

  function collect() {
    return typeof collectState === "function" ? collectState() : null;
  }

  function updateSaveStatus(message) {
    const status = document.querySelector(".save-status");
    if (status) status.textContent = message;
  }

  // Explicit user action only. Nothing is written automatically while typing,
  // printing, restoring, randomizing, leaving the page, or switching tabs.
  function saveLocal() {
    const data = collect();
    if (!data) return;

    try {
      localStorage.setItem(KEY, JSON.stringify({
        app: "BLSSNVJ21 Discharge Summary",
        version: 2,
        savedAt: new Date().toISOString(),
        data
      }));

      updateSaveStatus(
        "Last saved manually • " +
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      );

      toast("Saved in this browser");
    } catch (_) {
      alert("Browser storage is unavailable.");
    }
  }

  function restoreLocal() {
    const saved = readSaved();

    if (!saved?.data || typeof normalizeState !== "function") {
      toast("No saved browser draft found");
      return;
    }

    if (!confirm("Restore the last browser-saved draft?")) return;

    state = normalizeState(saved.data);
    renderPatient();
    renderDischargeType();
    renderSections();

    updateSaveStatus("Draft restored • not saved automatically");
    toast("Draft restored");
  }

  function saveNamedDraft() {
    const data = collect();
    if (!data) return;

    const name = prompt("Draft name:", "Discharge Summary");
    if (!name || !name.trim()) return;

    let all = {};

    try {
      all = JSON.parse(localStorage.getItem(DRAFTS) || "{}");
    } catch (_) {
      all = {};
    }

    all[name.trim()] = {
      savedAt: new Date().toISOString(),
      data
    };

    try {
      localStorage.setItem(DRAFTS, JSON.stringify(all));
      toast("Draft saved: " + name.trim());
    } catch (_) {
      alert("Browser storage is unavailable.");
    }
  }

  function openDraft() {
    let all = {};

    try {
      all = JSON.parse(localStorage.getItem(DRAFTS) || "{}");
    } catch (_) {
      all = {};
    }

    const names = Object.keys(all);

    if (!names.length) {
      alert("No named drafts found in this browser.");
      return;
    }

    const name = prompt(
      "Enter draft name:\n\n" + names.join("\n"),
      names[0]
    );

    if (!name || !all[name]) return;

    state = normalizeState(all[name].data);
    renderPatient();
    renderDischargeType();
    renderSections();

    // Opening a draft is not a save action.
    updateSaveStatus("Draft opened • not saved automatically");
    toast("Draft opened: " + name);
  }

  function addUtilityButtons() {
    const host = document.querySelector(".top-actions");
    if (!host) return;

    const make = (id, label, fn, cls = "secondary") => {
      if (document.getElementById(id)) return;

      const button = document.createElement("button");
      button.id = id;
      button.type = "button";
      button.className = cls;
      button.textContent = label;
      button.addEventListener("click", fn);

      host.appendChild(button);
    };

    make("restoreBtn", "Restore Draft", restoreLocal);
    make("saveDraftBtn", "Save Draft", saveNamedDraft);
    make("openDraftBtn", "Open Draft", openDraft);
  }

  let deferredInstallPrompt = null;

  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
  }

  function setupInstallPrompt() {
    const host = document.querySelector(".top-actions");
    if (!host || document.getElementById("installAppBtn")) return;

    window.addEventListener("beforeinstallprompt", function (event) {
      event.preventDefault();
      deferredInstallPrompt = event;

      if (isStandalone()) return;

      const button = document.createElement("button");
      button.id = "installAppBtn";
      button.type = "button";
      button.className = "secondary";
      button.textContent = "Install App";
      button.title = "Install BLSSNVJ21 as an app";
      button.addEventListener("click", async function () {
        if (!deferredInstallPrompt) return;

        deferredInstallPrompt.prompt();
        const choice = await deferredInstallPrompt.userChoice;

        if (choice.outcome === "accepted") {
          toast("App installation started");
        }

        deferredInstallPrompt = null;
        button.remove();
      });

      host.appendChild(button);
    });

    window.addEventListener("appinstalled", function () {
      deferredInstallPrompt = null;
      document.getElementById("installAppBtn")?.remove();
      toast("BLSSNVJ21 installed");
    });

    if (isStandalone()) {
      document.getElementById("installAppBtn")?.remove();
    }
  }

  function init() {
    addUtilityButtons();

    const brand = document.querySelector(".brand");

    if (brand && !brand.querySelector(".save-status")) {
      const status = document.createElement("span");
      status.className = "save-status";
      status.textContent = "Browser-only • Manual save only";
      brand.appendChild(status);
    }

    if (readSaved() && !document.getElementById("restoreLastBtn")) {
      const restore = document.createElement("button");
      restore.id = "restoreLastBtn";
      restore.type = "button";
      restore.className = "secondary no-print";
      restore.textContent = "Restore last draft";
      restore.addEventListener("click", restoreLocal);
      document.querySelector(".bottom-actions")?.prepend(restore);
    }

    document.addEventListener("keydown", function (event) {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "s"
      ) {
        event.preventDefault();
        saveLocal();
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "p"
      ) {
        event.preventDefault();
        document.getElementById("printBtn")?.click();
      }
    });

    setupInstallPrompt();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/static/sw.js", {
        scope: "/",
        updateViaCache: "none"
      }).then((registration) => {
        registration.update().catch(() => {});
      }).catch(() => {});
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
