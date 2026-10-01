/* BLSSNVJ21 Discharge Summary — browser-only enhancements */
(function () {
  "use strict";
  const KEY = "blssnvj21.discharge-summary.v2";
  const DRAFTS = "blssnvj21.discharge-summary.drafts.v1";

  function read() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (_) { return null; } }
  function write(data) { try { localStorage.setItem(KEY, JSON.stringify(data)); return true; } catch (_) { return false; } }
  function collect() {
    if (typeof collectState === "function") return collectState();
    return null;
  }
  function toast(message) {
    let el = document.getElementById("appToast");
    if (!el) { el = document.createElement("div"); el.id="appToast"; document.body.appendChild(el); }
    el.textContent = message; el.classList.add("show"); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove("show"),2200);
  }
  function saveLocal(silent) {
    const data = collect();
    if (!data) return;
    write({version:2, savedAt:new Date().toISOString(), data});
    if (!silent) toast("Saved in this browser");
  }
  function restoreLocal() {
    const saved=read();
    if (!saved || !saved.data || typeof normalizeState!=="function") return;
    if (!confirm("Restore the last browser-saved draft?")) return;
    state=normalizeState(saved.data);
    renderPatient(); renderDischargeType(); renderSections();
    toast("Draft restored");
  }
  function downloadJSON() {
    const data=collect(); if(!data) return;
    const payload=JSON.stringify({app:"BLSSNVJ21 Discharge Summary",version:2,exportedAt:new Date().toISOString(),data},null,2);
    const blob=new Blob([payload],{type:"application/json"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="BLSSNVJ21-discharge-summary.json"; a.click(); URL.revokeObjectURL(a.href);
    toast("JSON backup exported");
  }
  function importJSON() {
    const input=document.createElement("input"); input.type="file"; input.accept=".json,application/json";
    input.onchange=async()=>{const file=input.files&&input.files[0]; if(!file)return; try{
      const obj=JSON.parse(await file.text()); const data=obj.data||obj;
      state=normalizeState(data); renderPatient(); renderDischargeType(); renderSections(); saveLocal(true); toast("JSON backup imported");
    }catch(e){alert("Invalid JSON backup.");}};
    input.click();
  }
  function saveNamedDraft() { const data=collect(); if(!data)return; const name=prompt("Draft name:","Discharge Summary"); if(!name)return; let all={}; try{all=JSON.parse(localStorage.getItem(DRAFTS)||"{}")}catch(_){} all[name]={savedAt:new Date().toISOString(),data}; localStorage.setItem(DRAFTS,JSON.stringify(all)); toast("Draft saved: "+name); }
  function openDraft() { let all={}; try{all=JSON.parse(localStorage.getItem(DRAFTS)||"{}")}catch(_){} const names=Object.keys(all); if(!names.length){alert("No named drafts found.");return;} const name=prompt("Enter draft name:\n\n"+names.join("\n"),names[0]); if(!name||!all[name])return; state=normalizeState(all[name].data); renderPatient();renderDischargeType();renderSections();saveLocal(true);toast("Draft opened: "+name); }
  function clearLocal() {
    if(!confirm("Clear this browser's saved draft?")) return;
    localStorage.removeItem(KEY); localStorage.removeItem(DRAFTS); toast("Browser draft cleared");
  }
  function addUtilityButtons() {
    const host=document.querySelector(".top-actions"); if(!host)return;
    const make=(id,label,fn,cls="secondary")=>{if(document.getElementById(id))return;const b=document.createElement("button");b.id=id;b.type="button";b.className=cls;b.textContent=label;b.addEventListener("click",fn);host.appendChild(b);};
    make("restoreBtn","Restore Draft",restoreLocal); make("saveDraftBtn","Save Draft",saveNamedDraft); make("openDraftBtn","Open Draft",openDraft);
    make("exportBtn","Export JSON",downloadJSON);
    make("importBtn","Import JSON",importJSON);
    make("clearStorageBtn","Clear Storage",clearLocal,"danger");
  }
  function init() {
    addUtilityButtons();
    const status=document.createElement("span"); status.className="save-status"; status.textContent="Browser-only • Auto-save on";
    document.querySelector(".brand")?.appendChild(status);
    document.addEventListener("input",()=>{clearTimeout(window.__blAuto);window.__blAuto=setTimeout(()=>saveLocal(true),700);},{passive:true});
    document.addEventListener("change",()=>saveLocal(true),{passive:true});
    window.addEventListener("beforeunload",()=>saveLocal(true));
    if(read()) {
      const restore=document.createElement("button"); restore.type="button"; restore.className="secondary no-print"; restore.textContent="Restore last draft";
      restore.addEventListener("click",restoreLocal);
      const actions=document.querySelector(".bottom-actions"); if(actions) actions.prepend(restore);
    }
    if("serviceWorker" in navigator) navigator.serviceWorker.register("/static/sw.js").catch(()=>{});
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();
})();