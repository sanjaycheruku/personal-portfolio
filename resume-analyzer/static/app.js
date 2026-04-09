/* ══════════════════════════════════════════
   ResumeAI — app.js
   Full frontend logic: Upload, Analyze,
   Templates, Editor, Download
══════════════════════════════════════════ */

/* ─── State ─────────────────────────── */
const state = {
  file:           null,
  results:        null,
  activeTemplate: "modern",
  tabIds:         ["analyze","templates","editor","about"],
};

const TEMPLATE_LABELS = {
  modern:    "Modern",
  executive: "Executive",
  creative:  "Creative",
  minimal:   "Minimal",
};

const TEMPLATE_GRAD = {
  modern:    "linear-gradient(135deg,#6c63ff,#a78bfa)",
  executive: "linear-gradient(135deg,#1e3a5f,#4a90d9)",
  creative:  "linear-gradient(135deg,#e85d04,#f48c06)",
  minimal:   "linear-gradient(135deg,#333,#555)",
};

/* ─── DOM shortcuts ─────────────────── */
const $ = id => document.getElementById(id);

/* ─── TABS ──────────────────────────── */
function switchTab(name) {
  document.querySelectorAll(".nav-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === name));
  document.querySelectorAll(".tab-view").forEach(v => v.classList.toggle("active", v.id === `tab-${name}`));
}

document.querySelectorAll(".nav-tab").forEach(btn => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));
$("go-editor-btn").addEventListener("click",    () => switchTab("editor"));
$("go-templates-btn").addEventListener("click", () => switchTab("templates"));
$("change-template-btn").addEventListener("click", () => switchTab("templates"));

/* ─── FILE UPLOAD ────────────────────── */
const dropzone  = $("dropzone");
const fileInput = $("file-input");
const filePill  = $("file-pill");
const analyzeBtn= $("analyze-btn");

dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("dragover", e => { e.preventDefault(); dropzone.classList.add("dragover"); });
dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
dropzone.addEventListener("drop", e => {
  e.preventDefault();
  dropzone.classList.remove("dragover");
  const f = e.dataTransfer.files[0];
  if (f) setFile(f);
});
fileInput.addEventListener("change", () => { if (fileInput.files[0]) setFile(fileInput.files[0]); });
$("fp-remove").addEventListener("click", clearFile);

function setFile(f) {
  const allowed = ["application/pdf","application/vnd.openxmlformats-officedocument.wordprocessingml.document","text/plain"];
  const ext = f.name.split(".").pop().toLowerCase();
  if (!["pdf","docx","txt"].includes(ext)) { showToast("❌ Only PDF, DOCX or TXT allowed.","error"); return; }
  state.file = f;
  $("fp-name").textContent = f.name;
  $("fp-size").textContent = formatBytes(f.size);
  filePill.classList.remove("hidden");
  analyzeBtn.disabled = false;
}
function clearFile() {
  state.file = null; fileInput.value = "";
  filePill.classList.add("hidden"); analyzeBtn.disabled = true;
}
function formatBytes(b) {
  if (b < 1024) return b+" B";
  if (b < 1048576) return (b/1024).toFixed(1)+" KB";
  return (b/1048576).toFixed(1)+" MB";
}

/* ─── ANALYZE ────────────────────────── */
$("analyze-btn").addEventListener("click", runAnalysis);
$("reset-btn").addEventListener("click", resetAnalysis);

async function runAnalysis() {
  if (!state.file) return;

  // UI: loading
  $("analyze-btn-text").textContent = "Analyzing…";
  $("analyze-spinner").classList.remove("hidden");
  analyzeBtn.disabled = true;

  const formData = new FormData();
  formData.append("resume", state.file);
  formData.append("job_description", $("job-desc").value);

  try {
    const res = await fetch("/analyze", { method:"POST", body: formData });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || "Analysis failed");
    state.results = data;
    renderResults(data);
    showToast("✅ Analysis complete!");
  } catch(err) {
    showToast(`❌ ${err.message}`, "error");
  } finally {
    $("analyze-btn-text").textContent = "Analyze Resume";
    $("analyze-spinner").classList.add("hidden");
    analyzeBtn.disabled = false;
  }
}

function resetAnalysis() {
  clearFile();
  $("job-desc").value = "";
  $("empty-state").classList.remove("hidden");
  $("results-content").classList.add("hidden");
  state.results = null;
}

/* ─── RENDER RESULTS ─────────────────── */
function renderResults(d) {
  $("empty-state").classList.add("hidden");
  $("results-content").classList.remove("hidden");

  // ── ATS Ring
  animateRing("ring-ats", d.ats_score);
  animateCounter("ats-val", d.ats_score);
  const { label, color } = scoreVerdict(d.ats_score);
  const atsVerdict = $("ats-verdict");
  atsVerdict.textContent = label;
  atsVerdict.style.color = color;

  // ── JD Ring
  if (d.job_match > 0) {
    animateRing("ring-jd", d.job_match);
    animateCounter("jd-val", Math.round(d.job_match));
    const jv = $("jd-verdict");
    jv.textContent = d.job_match >= 70 ? "🎯 Great match" : d.job_match >= 45 ? "⚡ Moderate match" : "⚠️ Low match";
    jv.style.color = d.job_match >= 70 ? "var(--green)" : d.job_match >= 45 ? "var(--amber)" : "var(--red)";
  } else {
    $("jd-val").textContent = "N/A";
    $("jd-sub").textContent = "";
    $("jd-verdict").textContent = "No JD provided";
  }

  // ── Word Count
  $("word-count").textContent = d.word_count.toLocaleString();

  // ── Breakdown
  const bdList = $("breakdown-list");
  bdList.innerHTML = "";
  const bdWrap = document.createElement("div");
  bdWrap.className = "breakdown-wrap";
  for (const [name, info] of Object.entries(d.breakdown)) {
    const pct = Math.round((info.score / info.max) * 100);
    bdWrap.innerHTML += `
      <div class="bd-item">
        <div class="bd-head">
          <span class="bd-name">${name}</span>
          <span class="bd-pts">${info.score} / ${info.max}</span>
        </div>
        <div class="bd-track"><div class="bd-fill" style="width:0%" data-pct="${pct}%"></div></div>
        <div class="bd-detail">${info.detail}</div>
      </div>`;
  }
  bdList.appendChild(bdWrap);
  // Animate bars after DOM paint
  setTimeout(() => {
    bdWrap.querySelectorAll(".bd-fill").forEach(el => el.style.width = el.dataset.pct);
  }, 60);

  // ── Skills
  const skillsOut = $("skills-output");
  skillsOut.innerHTML = "";
  if (Object.keys(d.skills).length === 0) {
    skillsOut.innerHTML = `<p style="color:var(--muted);font-size:0.88rem">No recognisable skills found. Ensure your resume has a Skills section.</p>`;
  } else {
    const wrap = document.createElement("div");
    wrap.className = "skills-wrap";
    for (const [cat, skills] of Object.entries(d.skills)) {
      wrap.innerHTML += `
        <div>
          <div class="skill-cat-label">${cat}</div>
          <div class="tags-wrap">${skills.map(s => `<span class="tag">${s}</span>`).join("")}</div>
        </div>`;
    }
    skillsOut.appendChild(wrap);
  }

  // ── Missing / Matched
  const matchSection = $("match-section");
  if (d.job_match > 0 && (d.missing_skills.length || d.matched_skills.length)) {
    matchSection.style.display = "grid";
    $("missing-tags").innerHTML = d.missing_skills.length
      ? d.missing_skills.map(s => `<span class="tag miss">${s}</span>`).join("")
      : `<span style="color:var(--green);font-size:0.85rem">🎉 None missing!</span>`;
    $("matched-tags").innerHTML = d.matched_skills.length
      ? d.matched_skills.map(s => `<span class="tag match">${s}</span>`).join("")
      : `<span style="color:var(--muted);font-size:0.85rem">No overlapping skills.</span>`;
  } else {
    matchSection.style.display = "none";
  }

  // ── Suggestions
  const sugList = $("suggestions-list");
  sugList.innerHTML = d.suggestions.map(s => `<li>${s}</li>`).join("");

  // ── Preview
  $("resume-pre").textContent = d.resume_preview + "\n\n[Preview truncated to 1000 characters…]";

  // Scroll to results on mobile
  if (window.innerWidth < 1024) {
    setTimeout(() => $("results-content").scrollIntoView({ behavior:"smooth", block:"start" }), 100);
  }
}

function scoreVerdict(s) {
  if (s >= 80) return { label:"🏆 Excellent", color:"var(--green)" };
  if (s >= 65) return { label:"✅ Good",      color:"#86efac" };
  if (s >= 50) return { label:"⚡ Average",    color:"var(--amber)" };
  return                { label:"⚠️ Needs Work",color:"var(--red)" };
}

/* ─── RING ANIMATION ─────────────────── */
function animateRing(ringId, value, max=100) {
  const circ = 314; // 2 * π * r (r=50)
  const offset = circ - (circ * (value / max));
  const el = $(ringId);
  // Force reflow then animate
  el.style.strokeDashoffset = circ;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { el.style.strokeDashoffset = offset; });
  });
}

function animateCounter(elId, target) {
  const el = $(elId);
  let start = 0;
  const dur = 1400;
  const step = ts => {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / dur, 1);
    el.textContent = Math.round(prog * target);
    if (prog < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ─── TEMPLATES ─────────────────────── */
document.querySelectorAll(".tpl-select-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    selectTemplate(btn.dataset.template);
    switchTab("editor");
  });
});
document.querySelectorAll(".template-card").forEach(card => {
  card.addEventListener("click", () => selectTemplate(card.dataset.template));
});

function selectTemplate(tpl) {
  state.activeTemplate = tpl;
  // Update card active state
  document.querySelectorAll(".template-card").forEach(c => c.classList.toggle("active", c.dataset.template === tpl));
  // Update editor indicator
  $("active-template-name").textContent = TEMPLATE_LABELS[tpl];
  $("preview-badge").textContent = TEMPLATE_LABELS[tpl];
  updateLivePreview();
}

/* ─── EDITOR: Dynamic Entries ────────── */
function makeRemoveBtn(listId, entryClass) {
  const btn = document.createElement("button");
  btn.className = "entry-remove"; btn.textContent = "Remove";
  btn.addEventListener("click", () => {
    const entries = document.querySelectorAll(`#${listId} .${entryClass}`);
    if (entries.length > 1) btn.closest(`.${entryClass}`).remove();
    else showToast("At least one entry required.", "warn");
    updateLivePreview();
  });
  return btn;
}

// Experience
$("add-exp-btn").addEventListener("click", () => {
  const list = $("exp-list");
  const idx  = list.children.length;
  const div  = document.createElement("div");
  div.className = "exp-entry entry-card"; div.dataset.idx = idx;
  div.innerHTML = `
    <div class="form-grid-2">
      <div class="form-group"><label>Job Title / Role</label><input type="text" class="form-input exp-role" placeholder="Software Engineer"/></div>
      <div class="form-group"><label>Company</label><input type="text" class="form-input exp-company" placeholder="Google"/></div>
      <div class="form-group"><label>Period</label><input type="text" class="form-input exp-period" placeholder="Jan 2023 – Present"/></div>
      <div class="form-group"><label>Location</label><input type="text" class="form-input exp-loc" placeholder="Bengaluru"/></div>
    </div>
    <div class="form-group">
      <label>Key Responsibilities & Achievements</label>
      <textarea class="textarea exp-desc" rows="3" placeholder="• Developed REST APIs…"></textarea>
    </div>`;
  div.appendChild(makeRemoveBtn("exp-list","exp-entry"));
  list.appendChild(div);
  attachLivePreviewListeners(div);
});

// Education
$("add-edu-btn").addEventListener("click", () => {
  const list = $("edu-list");
  const idx  = list.children.length;
  const div  = document.createElement("div");
  div.className = "edu-entry entry-card"; div.dataset.idx = idx;
  div.innerHTML = `
    <div class="form-grid-2">
      <div class="form-group"><label>Degree</label><input type="text" class="form-input edu-degree" placeholder="B.Tech Computer Science"/></div>
      <div class="form-group"><label>Institution</label><input type="text" class="form-input edu-inst" placeholder="XYZ University"/></div>
      <div class="form-group"><label>Year</label><input type="text" class="form-input edu-year" placeholder="2020–2024"/></div>
      <div class="form-group"><label>Grade / CGPA</label><input type="text" class="form-input edu-grade" placeholder="9.0 / 10"/></div>
    </div>`;
  div.appendChild(makeRemoveBtn("edu-list","edu-entry"));
  list.appendChild(div);
  attachLivePreviewListeners(div);
});

// Projects
$("add-proj-btn").addEventListener("click", () => {
  const list = $("proj-list");
  const idx  = list.children.length;
  const div  = document.createElement("div");
  div.className = "proj-entry entry-card"; div.dataset.idx = idx;
  div.innerHTML = `
    <div class="form-grid-2">
      <div class="form-group"><label>Project Name</label><input type="text" class="form-input proj-name" placeholder="Project Name"/></div>
      <div class="form-group"><label>Technologies Used</label><input type="text" class="form-input proj-tech" placeholder="Python, React, AWS"/></div>
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea class="textarea proj-desc" rows="2" placeholder="Describe what you built and the impact…"></textarea>
    </div>`;
  div.appendChild(makeRemoveBtn("proj-list","proj-entry"));
  list.appendChild(div); 
  attachLivePreviewListeners(div);
});

/* ─── LIVE PREVIEW ────────────────────── */
function collectEditorData() {
  const data = {
    name:     $("ed-name").value.trim()    || "Your Name",
    email:    $("ed-email").value.trim()   || "",
    phone:    $("ed-phone").value.trim()   || "",
    linkedin: $("ed-linkedin").value.trim()|| "",
    github:   $("ed-github").value.trim()  || "",
    location: $("ed-location").value.trim()|| "",
    summary:  $("ed-summary").value.trim() || "",
    experience: [],
    education: [],
    skills: {},
    projects: [],
    certifications: [],
  };

  // Experience
  document.querySelectorAll("#exp-list .exp-entry").forEach(e => {
    const role = e.querySelector(".exp-role")?.value.trim();
    const company = e.querySelector(".exp-company")?.value.trim();
    if (role || company) {
      data.experience.push({
        role:    role || "",
        company: company || "",
        period:  e.querySelector(".exp-period")?.value.trim() || "",
        description: e.querySelector(".exp-desc")?.value.trim() || "",
      });
    }
  });

  // Education
  document.querySelectorAll("#edu-list .edu-entry").forEach(e => {
    const degree = e.querySelector(".edu-degree")?.value.trim();
    const inst   = e.querySelector(".edu-inst")?.value.trim();
    if (degree || inst) {
      data.education.push({
        degree:      degree || "",
        institution: inst   || "",
        year:        e.querySelector(".edu-year")?.value.trim()  || "",
        grade:       e.querySelector(".edu-grade")?.value.trim() || "",
      });
    }
  });

  // Skills
  document.querySelectorAll(".skill-input").forEach(inp => {
    const cat  = inp.dataset.cat;
    const vals = inp.value.split(",").map(s => s.trim()).filter(Boolean);
    if (vals.length) data.skills[cat] = vals;
  });

  // Projects
  document.querySelectorAll("#proj-list .proj-entry").forEach(p => {
    const name = p.querySelector(".proj-name")?.value.trim();
    if (name) {
      data.projects.push({
        name, 
        tech:        p.querySelector(".proj-tech")?.value.trim() || "",
        description: p.querySelector(".proj-desc")?.value.trim() || "",
      });
    }
  });

  // Certifications
  data.certifications = $("ed-certs").value.split("\n").map(s => s.trim()).filter(Boolean);

  return data;
}

function updateLivePreview() {
  const d   = collectEditorData();
  const tpl = state.activeTemplate;
  const grad = TEMPLATE_GRAD[tpl];
  const lp  = $("live-preview");

  const contacts = [d.email, d.phone, d.linkedin, d.location].filter(Boolean).join("  ·  ");

  let html = `
    <div class="lp-name" style="-webkit-text-fill-color:transparent;background:${grad};-webkit-background-clip:text;background-clip:text;">${escHtml(d.name)}</div>
    ${contacts ? `<div class="lp-contact">${escHtml(contacts)}</div>` : ""}
    <div class="lp-hr" style="background:${grad}"></div>`;

  if (d.summary) {
    html += `<div class="lp-sec-title">Summary</div><div class="lp-text">${escHtml(d.summary)}</div>`;
  }

  if (d.experience.length) {
    html += `<div class="lp-sec-title">Experience</div>`;
    d.experience.forEach(e => {
      html += `
        <div class="lp-entry">
          <div class="lp-entry-head">
            <span>${escHtml(e.role)}</span>
            <span style="font-size:0.68rem;color:var(--muted)">${escHtml(e.period)}</span>
          </div>
          <div class="lp-entry-sub">${escHtml(e.company)}</div>
          ${e.description ? `<div class="lp-entry-body">${escHtml(e.description).replace(/\n/g,"<br/>")}</div>` : ""}
        </div>`;
    });
  }

  if (d.education.length) {
    html += `<div class="lp-sec-title">Education</div>`;
    d.education.forEach(e => {
      html += `
        <div class="lp-entry">
          <div class="lp-entry-head">
            <span>${escHtml(e.degree)}</span>
            <span style="font-size:0.68rem;color:var(--muted)">${escHtml(e.year)}</span>
          </div>
          <div class="lp-entry-sub">${escHtml(e.institution)}${e.grade ? " · "+escHtml(e.grade) : ""}</div>
        </div>`;
    });
  }

  if (Object.keys(d.skills).length) {
    html += `<div class="lp-sec-title">Skills</div>`;
    for (const [cat, skills] of Object.entries(d.skills)) {
      html += `<div class="lp-text" style="margin-bottom:3px"><strong style="color:var(--text);font-size:0.7rem">${escHtml(cat)}:</strong> ${escHtml(skills.join(", "))}</div>`;
    }
  }

  if (d.projects.length) {
    html += `<div class="lp-sec-title">Projects</div>`;
    d.projects.forEach(p => {
      html += `
        <div class="lp-entry">
          <div class="lp-entry-head"><span>${escHtml(p.name)}</span></div>
          ${p.tech ? `<div class="lp-tags">${p.tech.split(",").map(t=>`<span class="lp-tag">${escHtml(t.trim())}</span>`).join("")}</div>` : ""}
          ${p.description ? `<div class="lp-entry-body">${escHtml(p.description)}</div>` : ""}
        </div>`;
    });
  }

  if (d.certifications.length) {
    html += `<div class="lp-sec-title">Certifications</div>`;
    d.certifications.forEach(c => {
      html += `<div class="lp-text" style="margin-bottom:2px">• ${escHtml(c)}</div>`;
    });
  }

  lp.innerHTML = html;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");
}

// Attach live preview on all existing editor fields
function attachLivePreviewListeners(root) {
  root.querySelectorAll("input, textarea").forEach(el => el.addEventListener("input", updateLivePreview));
}
attachLivePreviewListeners(document);
// Initial render
updateLivePreview();

/* ─── DOWNLOAD ─────────────────────── */
$("dl-pdf-btn").addEventListener("click",  () => downloadResume("pdf"));
$("dl-docx-btn").addEventListener("click", () => downloadResume("docx"));

async function downloadResume(format) {
  const data = collectEditorData();
  if (!data.name || data.name === "Your Name") {
    showToast("⚠️ Fill in at least your name before downloading.", "warn"); return;
  }

  const btn = format === "pdf" ? $("dl-pdf-btn") : $("dl-docx-btn");
  const orig = btn.innerHTML;
  btn.innerHTML = `<div class="spinner" style="width:18px;height:18px;border-width:2px"></div> Generating…`;
  btn.disabled = true;

  try {
    const payload = { ...data, format, template: state.activeTemplate };
    const res = await fetch("/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Download failed"); }

    const blob = await res.blob();
    const ext  = format === "pdf" ? "pdf" : "docx";
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${(data.name || "resume").replace(/\s+/g,"-").toLowerCase()}_resume.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`✅ ${format.toUpperCase()} downloaded!`);
  } catch(err) {
    showToast(`❌ ${err.message}`, "error");
  } finally {
    btn.innerHTML = orig; btn.disabled = false;
  }
}

/* ─── TOAST ─────────────────────────── */
let toastTimer;
function showToast(msg, type="success") {
  const toast = $("toast");
  toast.textContent = msg;
  toast.style.borderColor = type === "error" ? "rgba(248,113,113,0.4)"
                          : type === "warn"  ? "rgba(251,191,36,0.4)"
                          : "rgba(52,211,153,0.4)";
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3800);
}

/* ─── INITIAL SETUP ─────────────────── */
// Select modern template by default
selectTemplate("modern");

// Handle pre-populate from analysis
document.addEventListener("prefill-editor", e => {
  const d = e.detail;
  if (d.name) $("ed-name").value = d.name;
  updateLivePreview();
});
