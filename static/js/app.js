/* BLSSNVJ21 Discharge Summary — browser-only manual storage enhancements */
(function () {
  "use strict";

  const KEY = "blssnvj21.discharge-summary.v2";
  const DRAFTS = "blssnvj21.discharge-summary.drafts.v1";

  function readSaved() {
    try { return JSON.parse(localStorage.getItem(KEY) || "null"); }
    catch (_) { return null; }
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

  // Explicit user action only. There are no unload, input, timer, visibility,
  // random-data, print, or restore handlers that write the current draft.
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
    toast("Draft restored");
  }

  function saveNamedDraft() {
    const data = collect();
    if (!data) return;
    const name = prompt("Draft name:", "Discharge Summary");
    if (!name || !name.trim()) return;

    let all = {};
    try { all = JSON.parse(localStorage.getItem(DRAFTS) || "{}"); } catch (_) {}
    all[name.trim()] = { savedAt: new Date().toISOString(), data };

    try {
      localStorage.setItem(DRAFTS, JSON.stringify(all));
      toast("Draft saved: " + name.trim());
    } catch (_) {
      alert("Browser storage is unavailable.");
    }
  }

  function openDraft() {
    let all = {};
    try { all = JSON.parse(localStorage.getItem(DRAFTS) || "{}"); } catch (_) {}
    const names = Object.keys(all);
    if (!names.length) {
      alert("No named drafts found in this browser.");
      return;
    }

    const name = prompt("Enter draft name:\n\n" + names.join("\n"), names[0]);
    if (!name || !all[name]) return;

    state = normalizeState(all[name].data);
    renderPatient();
    renderDischargeType();
    renderSections();
    // Deliberately do NOT call saveLocal(): opening a draft is not a save action.
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

  function init() {
    addUtilityButtons();

    const status = document.createElement("span");
    status.className = "save-status";
    status.textContent = "Browser-only • Manual save only";
    document.querySelector(".brand")?.appendChild(status);

    if (readSaved()) {
      const restore = document.createElement("button");
      restore.type = "button";
      restore.className = "secondary no-print";
      restore.textContent = "Restore last draft";
      restore.addEventListener("click", restoreLocal);
      document.querySelector(".bottom-actions")?.prepend(restore);
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/static/sw.js").catch(() => {});
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
