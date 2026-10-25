/* ============================================================
   OWNER SETTINGS
   ------------------------------------------------------------
   1. Open your deployed site in a browser, open DevTools (F12) → Console, and run:
        await hashPassphrase("your long passphrase here")
   2. Copy the printed hash into ownerHash below and commit.
   3. Visit yoursite.github.io/your-repo/?edit to enter owner mode.
 
   Honest note: a static site cannot truly hide this. Anyone who can read this file
   can try passphrases offline, so use a LONG passphrase. This keeps out casual
   visitors; it is not a bank vault. Your real protection is who can push to the repo.
   ============================================================ */
const CONFIG = {
  ownerHash: "a341b49baa4f057c9397e19e22c20969a77952f6ea6957bf04a36558ae99e4c1",
  draftKey: "animator-portfolio-draft-v1",
  maxHistory: 100,
};
 
const FONTS = [
  { label: "Handwritten", value: "'Brush Script MT','Segoe Script',cursive" },
  { label: "Friendly sans", value: "'Trebuchet MS',Verdana,sans-serif" },
  { label: "Serif", value: "Georgia,'Times New Roman',serif" },
  { label: "Mono", value: "'Courier New',monospace" },
  { label: "Poster", value: "Impact,'Arial Black',sans-serif" },
];
 
const ASPECTS = ["16 / 10", "4 / 3", "16 / 9", "1 / 1", "3 / 4"];
const FRAME_ASPECTS = ["auto", "1 / 1", "4 / 3", "3 / 4", "16 / 9", "9 / 16", "5 / 4"];
 
// Media model:
//   frame  = the visible window (item.w + aspect). It clips with overflow:hidden.
//   picture = the ORIGINAL file, positioned inside the frame.
//     zoom  = picture width as a fraction of the frame width (1 = same width, 0.5 = half, 3 = triple)
//     panX  = left edge of the picture, as % of frame width   (can be negative or >100)
//     panY  = top edge of the picture, as % of frame height   (can be negative or >100)
//   natW/natH = the picture's real pixel size (measured when it loads).
const MEDIA_DEFAULTS = {
  aspect: "auto", panX: 0, panY: 0, zoom: 1,
  bg: "transparent", autoplay: true, loop: true, muted: true,
};
 
// Placeholder art so the sample site looks alive before you add your own work.
const ph = (label, bg = "#ffd166", fg = "#1d1d1d") =>
  "data:image/svg+xml;utf8," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360"><rect width="100%" height="100%" fill="${bg}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="30" font-weight="bold" fill="${fg}">${label}</text></svg>`);
 
/* CONTENT:START */
const CONTENT = {
  identity: {
    title: "Your Name — Animator",
    description: "Animator portfolio: loops, characters and frame-by-frame chaos.",
    favicon: "",
    shareImage: "",
    shareTitle: "",
    shareDescription: "",
  },
  site: { title: "Your Name — Animator", name: "Your Name" },
  theme: { bg: "#f6efe2", ink: "#1d1d1d", accent: "#ff5a36" },
  canvasAspect: "16 / 10",
  canvas: [
    { id: "t-hello", kind: "text", text: "hi, I'm Your Name", x: 6, y: 10, w: 44, rot: -3, z: 5, locked: false,
      style: { fontSize: 72, fontFamily: FONTS[0].value, weight: 700, color: "#1d1d1d", align: "left", bg: "transparent", border: "", shadow: false } },
    { id: "img-1", kind: "image", src: ph("SAMPLE GIF", "#8ecae6"), alt: "placeholder", x: 58, y: 6, w: 30, rot: 4, z: 2, locked: false,
      style: { border: "4px solid #1d1d1d", shadow: true, bg: "#fff" } },
    { id: "st-1", kind: "sticker", src: ph("★ STICKER", "#ff5a36", "#fff"), alt: "sticker", x: 82, y: 58, w: 12, rot: -12, z: 6, locked: false, style: {} },
    { id: "t-tag", kind: "text", text: "animator • storyteller • frame-by-frame goblin", x: 8, y: 62, w: 40, rot: 2, z: 4, locked: false,
      style: { fontSize: 28, fontFamily: FONTS[1].value, weight: 700, color: "#1d1d1d", align: "left", bg: "#fffdf7", border: "2px solid #1d1d1d", shadow: true } },
    { id: "btn-reel", kind: "button", text: "see my reel →", href: "#reel", x: 60, y: 68, w: 22, rot: -2, z: 7, locked: false,
      style: { fontSize: 22, bg: "transparent", border: "", shadow: false } },
  ],
  projects: [
    { id: "p1", title: "SAMPLE: Bouncy Ball Loop", desc: "Placeholder project. Swap in your real work in the editor.", thumb: ph("SAMPLE THUMB 1", "#ffd166"), preview: "", link: "", tags: ["sample", "loop"] },
    { id: "p2", title: "SAMPLE: Dancing Teapot", desc: "Another placeholder. Replace the thumbnail and add a GIF preview.", thumb: ph("SAMPLE THUMB 2", "#b8f2e6"), preview: "", link: "", tags: ["sample", "character"] },
    { id: "p3", title: "SAMPLE: Gravity Test", desc: "Placeholder. Delete me once your real projects are in.", thumb: ph("SAMPLE THUMB 3", "#ffadad"), preview: "", link: "", tags: ["sample"] },
  ],
  about: "Placeholder bio. Open owner mode and write something true about you.\nSecond paragraph goes on its own line.",
  links: [
    { label: "Instagram", url: "https://instagram.com/" },
    { label: "Email", url: "mailto:you@example.com" },
    { label: "Vimeo", url: "https://vimeo.com/" },
  ],
};
/* CONTENT:END */
 
/* ============================================================
   HELPERS
   ============================================================ */
const $ = (sel, root = document) => root.querySelector(sel);
const clone = (o) => JSON.parse(JSON.stringify(o));
const r1 = (n) => Math.round(n * 10) / 10;
const r3 = (n) => Math.round(n * 1000) / 1000;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const findItem = (id) => C.canvas.find((i) => i.id === id);
const elOf = (id) => document.querySelector(`#canvas .item[data-id="${id}"]`);
const isMediaKind = (k) => k === "image" || k === "sticker" || k === "video";
const opt = (v, cur, label) => `<option value="${v}" ${String(cur) === String(v) ? "selected" : ""}>${label}</option>`;
 
async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
window.hashPassphrase = sha256;
 
/* ============================================================
   ASSET STORE (uploaded images, GIFs, videos)
   Uploads live in the browser's IndexedDB, not in the draft.
   The draft only holds short references like "asset:a1b2c3",
   so the old "draft too big" limit no longer applies.
   ============================================================ */
const ASSET_DB = "animator-portfolio-assets";
const ASSET_URLS = {}; // asset id -> object URL, for display
 
function openAssetDB() {
  return new Promise((res, rej) => {
    const req = indexedDB.open(ASSET_DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore("files");
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}
 
async function putAsset(id, blob) {
  const db = await openAssetDB();
  return new Promise((res, rej) => {
    const tx = db.transaction("files", "readwrite");
    tx.objectStore("files").put(blob, id);
    tx.oncomplete = () => { db.close(); res(); };
    tx.onerror = () => rej(tx.error);
  });
}
 
async function getAsset(id) {
  const db = await openAssetDB();
  return new Promise((res, rej) => {
    const req = db.transaction("files").objectStore("files").get(id);
    req.onsuccess = () => { db.close(); res(req.result || null); };
    req.onerror = () => rej(req.error);
  });
}
 
async function storeUpload(file) {
  const id = uid("a");
  await putAsset(id, file);
  ASSET_URLS[id] = URL.createObjectURL(file);
  return "asset:" + id;
}
 
// Turns a stored reference into a URL the browser can display.
const resolveSrc = (s) =>
  typeof s === "string" && s.startsWith("asset:") ? (ASSET_URLS[s.slice(6)] || "") : (s || "");
 
// Every place a picture can live: [object, key] pairs.
function assetSlots(data = C) {
  const slots = data.canvas.map((it) => [it, "src"]);
  data.projects.forEach((p) => slots.push([p, "thumb"], [p, "preview"]));
  slots.push([data.identity, "favicon"], [data.identity, "shareImage"]);
  return slots;
}
 
function blobToDataURL(blob) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(blob);
  });
}
 
// Older drafts stored pictures inline as long text. Move them into the asset store.
async function migrateInlineAssets() {
  let changed = false;
  for (const [obj, key] of assetSlots()) {
    const v = obj[key];
    if (typeof v === "string" && v.startsWith("data:") && !v.startsWith("data:image/svg+xml;utf8")) {
      const blob = await (await fetch(v)).blob();
      const id = uid("a");
      await putAsset(id, blob);
      obj[key] = "asset:" + id;
      changed = true;
    }
  }
  return changed;
}
 
// Runs when owner mode opens: migrate, load display URLs, drop unused files.
async function prepareAssets() {
  try {
    if (await migrateInlineAssets()) saveDraft();
    for (const [obj, key] of assetSlots()) {
      const v = obj[key];
      if (typeof v === "string" && v.startsWith("asset:") && !ASSET_URLS[v.slice(6)]) {
        const blob = await getAsset(v.slice(6));
        if (blob) ASSET_URLS[v.slice(6)] = URL.createObjectURL(blob);
      }
    }
    await pruneAssets();
  } catch (err) {
    console.warn("Asset store problem:", err);
  }
}
 
// Delete stored files that nothing in the current draft uses anymore.
async function pruneAssets() {
  const db = await openAssetDB();
  const keys = await new Promise((res, rej) => {
    const req = db.transaction("files").objectStore("files").getAllKeys();
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
  const used = new Set(assetSlots().map(([o, k]) => o[k])
    .filter((v) => typeof v === "string" && v.startsWith("asset:"))
    .map((v) => v.slice(6)));
  const tx = db.transaction("files", "readwrite");
  const store = tx.objectStore("files");
  keys.forEach((k) => { if (!used.has(k)) store.delete(k); });
  tx.oncomplete = () => db.close();
}
 
// Used by export: swaps stored references for real data so they can be saved as files.
async function inlineAssets(data) {
  for (const [obj, key] of assetSlots(data)) {
    const v = obj[key];
    if (typeof v === "string" && v.startsWith("asset:")) {
      const blob = await getAsset(v.slice(6));
      if (blob) obj[key] = await blobToDataURL(blob);
    }
  }
}
 
function setPath(obj, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  const target = keys.reduce((o, k) => (o[k] = o[k] || {}), obj);
  target[last] = value;
}
 
/* ============================================================
   STATE
   C is what is currently shown. Visitors always see CONTENT
   (the published version). Drafts live only in the owner's browser.
   ============================================================ */
let C = clone(CONTENT);
let editing = false;
let selectedId = null;          // selected canvas item
let selectedProjectId = null;   // selected project card
let currentTab = "canvas";
let gesture = null;
let cropDrag = null;
let pendingUpload = null;
let showOutside = false;        // UI toggle: draw the picture's full extent in the crop preview
const hist = { stack: [], i: -1 };
 
/* ============================================================
   MEDIA (images, GIFs, stickers, videos)
   The frame is clipped. The picture is always the full original file,
   positioned and scaled inside the frame. Nothing is cropped away
   in the data, so you can always move the picture to reveal more.
   ============================================================ */
const mediaOf = (obj) => ({ ...MEDIA_DEFAULTS, ...(obj.media || {}) });
const natOf = (m) => (m.natW && m.natH ? { w: m.natW, h: m.natH } : null);
 
// CSS aspect-ratio string for the frame. "auto" follows the picture's real shape.
function frameAspectCSS(m) {
  if (m.aspect !== "auto") return m.aspect;
  const nat = natOf(m);
  return nat ? `${nat.w} / ${nat.h}` : "4 / 3";
}
 
function frameRatio(m) {
  const [w, h] = frameAspectCSS(m).split("/").map((n) => Number(n.trim()));
  return w / h;
}
 
// Positions the picture inside its frame. Used by the canvas and the crop preview.
function pictureStyle(m) {
  return `position:absolute;left:${m.panX}%;top:${m.panY}%;width:${m.zoom * 100}%;height:auto;max-width:none;pointer-events:none;`;
}
 
function mediaInnerHTML(item) {
  const m = mediaOf(item);
  if (item.kind === "video") {
    return `<video data-mid="${esc(item.id)}" onloadedmetadata="measureMedia(this)" src="${esc(resolveSrc(item.src))}" style="${pictureStyle(m)}" ${m.autoplay ? "autoplay" : ""} ${m.loop ? "loop" : ""} ${m.muted ? "muted" : ""} playsinline></video>`;
  }
  return `<img data-mid="${esc(item.id)}" onload="measureMedia(this)" src="${esc(resolveSrc(item.src))}" alt="${esc(item.alt || "")}" draggable="false" style="${pictureStyle(m)}">`;
}
 
// Re-position the picture without re-rendering (cheap, no video restart).
function applyMediaTransform(obj) {
  const m = mediaOf(obj);
  document
    .querySelectorAll(`[data-id="${obj.id}"] .media-frame > *, [data-pid="${obj.id}"] .media-frame > *, #crop-box .crop-inner > *`)
    .forEach((n) => {
      n.style.left = m.panX + "%";
      n.style.top = m.panY + "%";
      n.style.width = m.zoom * 100 + "%";
    });
}
 
const findMediaObj = (id) => C.canvas.find((i) => i.id === id) || C.projects.find((p) => p.id === id);
 
// Called by the picture's onload. Stores its real pixel size once, so the
// frame can match the picture's shape and fit/fill can do the maths.
function measureMedia(el) {
  const id = el.dataset.mid;
  const w = el.naturalWidth || el.videoWidth;
  const h = el.naturalHeight || el.videoHeight;
  const obj = id && findMediaObj(id);
  if (!obj || !w || !h) return;
  const m = obj.media || {};
  if (m.natW === w && m.natH === h) return;
  obj.media = { ...mediaOf(obj), natW: w, natH: h };
  if (editing) saveDraft();
  if (!cropDrag && !gesture) renderPage();
}
 
// Fit entire image, fill frame, or reset. Returns false if the size isn't known yet.
function placeMedia(obj, mode) {
  const m = mediaOf(obj);
  const nat = natOf(m);
  if (!nat) {
    alert("Still measuring the picture. Try again in a second.");
    return false;
  }
  const a = nat.w / nat.h;   // picture shape
  const f = frameRatio(m);   // frame shape
  const k =
    mode === "fit" ? Math.min(1, a / f) :
    mode === "fill" ? Math.max(1, a / f) : 1;
  const pictureHeightPct = (k * f / a) * 100; // picture height as % of frame height
  obj.media = {
    ...m,
    zoom: r3(k),
    panX: r1((100 - k * 100) / 2),
    panY: r1((100 - pictureHeightPct) / 2),
  };
  return true;
}
 
/* ============================================================
   RENDERING (shared by public site and owner mode)
   ============================================================ */
function applyGeometry(el, item) {
  el.style.left = item.x + "%";
  el.style.top = item.y + "%";
  el.style.width = item.w + "%";
  el.style.transform = `rotate(${item.rot || 0}deg)`;
  el.style.zIndex = item.z || 1;
}
 
// Font sizes are authored for a 900px-wide canvas and scale with it.
const scaledPx = (px) => `calc(${px} * 100cqw / 900)`;
 
function itemEl(item) {
  const el = document.createElement("div");
  const s = item.style || {};
  el.className = `item ${item.kind}${item.locked ? " locked" : ""}`;
  el.dataset.id = item.id;
  applyGeometry(el, item);
  el.style.border = s.border || "none";
  el.style.borderRadius = s.radius || "0";
  el.style.boxShadow = s.shadow ? "6px 8px 0 #1d1d1d" : "none";
  el.style.background = s.bg || "transparent";
  el.style.opacity = s.opacity === undefined ? 1 : s.opacity;
 
  if (item.kind === "text") {
    el.textContent = item.text;
    el.style.fontSize = scaledPx(s.fontSize || 32);
    el.style.fontFamily = s.fontFamily || "inherit";
    el.style.fontWeight = s.weight || 400;
    el.style.color = s.color || "inherit";
    el.style.textAlign = s.align || "left";
    el.style.padding = "0.2em 0.4em";
  } else if (item.kind === "button") {
    el.innerHTML = `<a class="btn" href="${esc(item.href || "#")}" style="font-size:${scaledPx(s.fontSize || 22)}">${esc(item.text)}</a>`;
  } else {
    const m = mediaOf(item);
    el.style.aspectRatio = frameAspectCSS(m);
    const frame = document.createElement("div");
    frame.className = "media-frame";
    frame.style.background = m.bg;
    frame.innerHTML = mediaInnerHTML(item);
    el.appendChild(frame);
  }
  return el;
}
 
function renderCanvas() {
  const c = $("#canvas");
  c.style.aspectRatio = C.canvasAspect;
  c.replaceChildren(...C.canvas.map(itemEl));
  updateSelection();
}
 
const showOf = (p) => ({ title: true, desc: true, tags: true, link: true, ...(p.show || {}) });
 
function projectCard(p) {
  const s = p.style || {};
  const show = showOf(p);
  const above = s.textOrder === "above";
  const thumbMedia = { id: p.id, kind: "image", src: p.thumb, alt: p.title, media: p.media };
  const tm = mediaOf(thumbMedia);
 
  const css = [
    p.rot !== undefined ? `--rot:${p.rot}deg` : "",
    `border:${s.border || "2px solid var(--ink)"}`,
    `border-radius:${s.radius || "0"}`,
    `box-shadow:${s.shadow === false ? "none" : "6px 6px 0 var(--ink)"}`,
    `background:${s.bg || "var(--paper)"}`,
    `padding:${s.padding || "14px 14px 18px"}`,
    `opacity:${s.opacity === undefined ? 1 : s.opacity}`,
    `text-align:${s.align || "left"}`,
    p.featured ? "grid-column: span 2" : "",
  ].filter(Boolean).join(";");
 
  const thumb = `
    <div class="thumb" style="order:${above ? 2 : 1};aspect-ratio:${frameAspectCSS(tm)}">
      <div class="media-frame" style="background:${tm.bg}">${mediaInnerHTML(thumbMedia)}</div>
      ${p.preview ? `<video src="${esc(resolveSrc(p.preview))}" muted loop playsinline></video>` : ""}
    </div>`;
 
  const title = show.title
    ? `<h3 style="font-size:${s.titleSize || 1.2}rem;color:${s.titleColor || "inherit"}">${esc(p.title)}</h3>` : "";
  const desc = show.desc ? `<p>${esc(p.desc)}</p>` : "";
  const tags = show.tags && (p.tags || []).length
    ? `<div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>` : "";
  const link = show.link && p.link
    ? `<a href="${esc(p.link)}" target="_blank" rel="noopener">watch project →</a>` : "";
 
  return `
    <article class="card" data-pid="${esc(p.id)}" style="${css}">
      ${thumb}
      <div class="card-text" style="order:${above ? 1 : 2}">${title}${desc}${tags}${link}</div>
    </article>`;
}
 
function wireCardHover() {
  document.querySelectorAll(".card").forEach((card) => {
    const v = card.querySelector("video");
    if (!v) return;
    card.addEventListener("mouseenter", () => v.play().catch(() => {}));
    card.addEventListener("mouseleave", () => { v.pause(); v.currentTime = 0; });
  });
}
 
function updateProjectSelection() {
  document.querySelectorAll(".card").forEach((c) =>
    c.classList.toggle("sel", editing && c.dataset.pid === selectedProjectId));
}
 
// Sets the real favicon, description and share tags. Visitors get these from C
// (the published content), so the preview and the live site can't drift apart.
function setMeta(attr, key, value) {
  if (!value) return;
  let m = document.querySelector(`meta[${attr}="${key}"]`);
  if (!m) {
    m = document.createElement("meta");
    m.setAttribute(attr, key);
    document.head.append(m);
  }
  m.content = value;
}
 
function applyIdentity() {
  const id = C.identity;
  document.title = id.title || C.site.title;
  setMeta("name", "description", id.description);
  setMeta("property", "og:title", id.shareTitle || id.title);
  setMeta("property", "og:description", id.shareDescription || id.description);
  setMeta("property", "og:image", id.shareImage);
  if (id.favicon) {
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.append(link);
    }
    link.href = resolveSrc(id.favicon);
  }
}
 
function renderPage() {
  const st = document.documentElement.style;
  st.setProperty("--bg", C.theme.bg);
  st.setProperty("--ink", C.theme.ink);
  st.setProperty("--accent", C.theme.accent);
  applyIdentity();
  $("#site-name").textContent = C.site.name;
  $("#year").textContent = new Date().getFullYear();
 
  renderCanvas();
  $("#projects").innerHTML = C.projects.map(projectCard).join("");
  $("#about-body").innerHTML = C.about.split("\n").filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join("");
  $("#links-body").innerHTML = C.links.map((l) =>
    `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("");
  wireCardHover();
  updateProjectSelection();
}
 
/* ============================================================
   SELECTION + HANDLES (owner mode)
   ============================================================ */
function updateSelection() {
  document.querySelectorAll("#canvas .item").forEach((el) => {
    const item = findItem(el.dataset.id);
    const sel = editing && el.dataset.id === selectedId;
    el.classList.toggle("selected", sel);
    el.querySelectorAll(".handle").forEach((h) => h.remove());
    if (sel && item && !item.locked) {
      el.insertAdjacentHTML("beforeend",
        `<div class="handle rotate" data-mode="rotate" title="rotate"></div>
         <div class="handle resize" data-mode="resize" title="resize"></div>`);
    }
  });
}
 
function select(id) {
  selectedId = id;
  if (id) {
    selectedProjectId = null;
    currentTab = "canvas";
  }
  updateSelection();
  updateProjectSelection();
  if (editing) refreshPanel();
}
 
// Clicking a project card in owner mode selects it and opens its settings.
function onProjectClick(e) {
  if (!editing) return;
  const card = e.target.closest(".card");
  if (!card) return;
  e.preventDefault();
  selectedId = null;
  updateSelection();
  selectedProjectId = card.dataset.pid;
  currentTab = "projects";
  updateProjectSelection();
  refreshPanel();
}
 
/* ============================================================
   HISTORY (undo / redo) + DRAFT SAVING
   ============================================================ */
function saveDraft() {
  try {
    localStorage.setItem(CONFIG.draftKey, JSON.stringify(C));
  } catch {
    alert("Couldn't save your draft in this browser. Export now so nothing gets lost.");
  }
}
 
function commit(rebuildPanel = true) {
  hist.stack = hist.stack.slice(0, hist.i + 1);
  hist.stack.push(clone(C));
  if (hist.stack.length > CONFIG.maxHistory) hist.stack.shift();
  hist.i = hist.stack.length - 1;
  saveDraft();
  renderPage();
  if (rebuildPanel) refreshPanel();
  updateToolbar();
}
 
function restore(i) {
  hist.i = i;
  C = clone(hist.stack[i]);
  if (selectedId && !findItem(selectedId)) selectedId = null;
  if (selectedProjectId && !C.projects.some((p) => p.id === selectedProjectId)) selectedProjectId = null;
  saveDraft();
  renderPage();
  refreshPanel();
  updateToolbar();
}
 
const undo = () => hist.i > 0 && restore(hist.i - 1);
const redo = () => hist.i < hist.stack.length - 1 && restore(hist.i + 1);
 
function updateToolbar() {
  const u = $('[data-act="undo"]');
  const r = $('[data-act="redo"]');
  if (u) u.disabled = hist.i <= 0;
  if (r) r.disabled = hist.i >= hist.stack.length - 1;
}
 
/* ============================================================
   POINTER GESTURES: move, resize, rotate (canvas) + pan (crop preview)
   ============================================================ */
function onCanvasDown(e) {
  if (!editing) return;
  if (e.target.closest("[contenteditable='true']")) return;
  const el = e.target.closest(".item");
  if (!el) { select(null); return; }
 
  const item = findItem(el.dataset.id);
  const handle = e.target.closest(".handle");
  if (selectedId !== item.id) select(item.id);
  if (item.locked) return;
 
  e.preventDefault();
  const cr = $("#canvas").getBoundingClientRect();
  const br = el.getBoundingClientRect();
  gesture = {
    mode: handle ? handle.dataset.mode : "move",
    item,
    sx: e.clientX, sy: e.clientY,
    ox: item.x, oy: item.y, ow: item.w,
    cr,
    cx: br.left + br.width / 2,
    cy: br.top + br.height / 2,
    moved: false,
  };
}
 
// Which object does the crop box belong to? Canvas item or project card.
function cropTargetObj(box) {
  if (box.dataset.target === "project") return C.projects[Number(box.dataset.index)];
  return findItem(selectedId);
}
 
// Dragging the picture in the crop preview moves it inside the frame.
function onPanelDown(e) {
  const box = e.target.closest("#crop-box");
  if (!box) return;
  const obj = cropTargetObj(box);
  if (!obj) return;
  e.preventDefault();
  const m = mediaOf(obj);
  cropDrag = { obj, box, sx: e.clientX, sy: e.clientY, ox: m.panX, oy: m.panY, moved: false };
}
 
function onMove(e) {
  if (cropDrag) {
    const c = cropDrag;
    const r = c.box.getBoundingClientRect();
    const m = mediaOf(c.obj);
    // Percent of the frame, so the picture follows the pointer exactly.
    m.panX = r1(c.ox + ((e.clientX - c.sx) / r.width) * 100);
    m.panY = r1(c.oy + ((e.clientY - c.sy) / r.height) * 100);
    c.obj.media = m;
    c.moved = true;
    applyMediaTransform(c.obj);
    return;
  }
  if (!gesture) return;
  const g = gesture;
  const dx = e.clientX - g.sx;
  const dy = e.clientY - g.sy;
  if (g.mode === "move") {
    g.item.x = r1(g.ox + (dx / g.cr.width) * 100);
    g.item.y = r1(g.oy + (dy / g.cr.height) * 100);
  } else if (g.mode === "resize") {
    g.item.w = Math.max(3, r1(g.ow + (dx / g.cr.width) * 100));
  } else if (g.mode === "rotate") {
    let a = (Math.atan2(e.clientY - g.cy, e.clientX - g.cx) * 180) / Math.PI + 90;
    if (e.shiftKey) a = Math.round(a / 15) * 15; // hold Shift to snap
    g.item.rot = Math.round(a);
  }
  g.moved = true;
  const el = elOf(g.item.id);
  if (el) applyGeometry(el, g.item);
}
 
function onUp() {
  if (cropDrag) {
    const moved = cropDrag.moved;
    cropDrag = null;
    if (moved) commit(true);
    return;
  }
  if (!gesture) return;
  const moved = gesture.moved;
  gesture = null;
  if (moved) commit(true);
}
 
function onCanvasDbl(e) {
  if (!editing) return;
  const el = e.target.closest(".item.text");
  if (!el) return;
  const item = findItem(el.dataset.id);
  el.contentEditable = "true";
  el.focus();
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  el.addEventListener("blur", () => {
    el.contentEditable = "false";
    const t = el.innerText.replace(/\n$/, "");
    if (t !== item.text) { item.text = t; commit(true); }
  }, { once: true });
}
 
/* ============================================================
   ITEM + PROJECT ACTIONS
   ============================================================ */
function newItem(overrides) {
  const z = Math.max(0, ...C.canvas.map((i) => i.z || 0)) + 1;
  return {
    id: uid("i"), kind: "image", text: "", src: "", href: "#",
    x: 30, y: 30, w: 25, rot: 0, z, locked: false, style: {},
    ...overrides,
  };
}
 
const maxZExcept = (it) => Math.max(0, ...C.canvas.filter((i) => i !== it).map((i) => i.z || 0));
const minZExcept = (it) => Math.min(0, ...C.canvas.filter((i) => i !== it).map((i) => i.z || 0));
 
function deleteItem() {
  const it = findItem(selectedId);
  if (!it) return;
  C.canvas = C.canvas.filter((i) => i !== it);
  selectedId = null;
  commit(true);
}
 
function moveIn(arr, i, dir) {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
}
 
function askFile(p) {
  pendingUpload = p;
  const inp = $("#file-input");
  inp.accept =
    p.field === "preview" || p.mode === "replace" || p.mode === "add" ? "image/*,video/*" :
    p.field === "favicon" ? "image/*,.ico" : "image/*";
  inp.click();
}
 
async function onFile(e) {
  const f = e.target.files[0];
  e.target.value = "";
  if (!f || !pendingUpload) return;
  const p = pendingUpload;
  pendingUpload = null;
  if (f.size > 25 * 1024 * 1024) {
    alert("That's a very big file. It will work, but the page may feel slow.");
  }
  // The original file is stored untouched, so GIF animation and video survive.
  const url = await storeUpload(f);
  const kind = f.type.startsWith("video/") ? "video" : "image";
 
  // A new file has a new size, so drop the old measurement; it gets re-measured on load.
  if (p.mode === "add") {
    const n = newItem({ kind, src: url, x: 30, y: 25, w: kind === "video" ? 40 : 25 });
    C.canvas.push(n);
    selectedId = n.id;
  } else if (p.mode === "replace") {
    const it = findItem(selectedId);
    if (!it) return;
    it.src = url;
    if (kind === "video") it.kind = "video";
    else if (it.kind === "video") it.kind = "image";
    it.media = { ...MEDIA_DEFAULTS, aspect: mediaOf(it).aspect, bg: mediaOf(it).bg };
  } else if (p.mode === "project") {
    const proj = C.projects[p.index];
    proj[p.field] = url;
    if (p.field === "thumb") proj.media = { ...MEDIA_DEFAULTS, aspect: mediaOf(proj).aspect, bg: mediaOf(proj).bg };
  } else if (p.mode === "identity") {
    C.identity[p.field] = url;
  }
  commit(true);
}
 
/* ============================================================
   OWNER PANEL (forms are generated from the data)
   ============================================================ */
function canvasHint() {
  const layers = [...C.canvas].sort((a, b) => (b.z || 0) - (a.z || 0));
  return `
    <p class="hint">Click something on the canvas to edit it. Drag to move, use the corner handle to resize, the top knob to rotate (hold Shift to snap). Double-click text to type. Arrow keys nudge, Delete removes, Ctrl+Z undoes.</p>
    <h4>Layers (top first)</h4>
    ${layers.map((i) => `<div class="row"><button data-act="select" data-id="${i.id}">${esc(i.kind)}${i.locked ? " 🔒" : ""}: ${esc((i.text || "").slice(0, 18))}</button></div>`).join("") || "<p>Nothing yet. Use the toolbar to add stuff.</p>"}`;
}
 
// Crop and position editor. The solid box is the frame (what visitors see).
// The picture is the full original file, and it can be moved past the edges.
// `t` is the data-target attribute that tells the handlers which object this is.
function cropEditor(it, t = 'data-target="item"') {
  const m = mediaOf(it);
  const nat = natOf(m);
  const outline = showOutside && nat
    ? `<div class="src-outline" style="left:${m.panX}%;top:${m.panY}%;width:${m.zoom * 100}%;aspect-ratio:${nat.w} / ${nat.h}"></div>`
    : "";
  return `
    <div class="crop-wrap">
      <h4>Crop &amp; position</h4>
      <div id="crop-box" class="crop-box" ${t} style="aspect-ratio:${frameAspectCSS(m)}" title="drag the picture to move it">
        ${outline}
        <div class="crop-inner">${mediaInnerHTML(it)}</div>
      </div>
      <p class="hint">The solid box is your frame. Drag the picture to move it, even past the edges.${nat ? "" : " (Measuring the picture…)"}</p>
      <label>Zoom (picture size vs frame)
        <input type="range" min="0.1" max="5" step="0.05" ${t} data-key="media.zoom" value="${m.zoom}">
      </label>
      <div class="row">
        <label>Pan X % (left edge)<input type="number" step="0.5" ${t} data-key="media.panX" value="${m.panX}"></label>
        <label>Pan Y % (top edge)<input type="number" step="0.5" ${t} data-key="media.panY" value="${m.panY}"></label>
      </div>
      <div class="row">
        <button data-act="media-fit" ${t}>fit entire image</button>
        <button data-act="media-fill" ${t}>fill frame</button>
        <button data-act="crop-reset" ${t}>reset position</button>
      </div>
      <label><input type="checkbox" id="show-outside" ${showOutside ? "checked" : ""}> show the parts outside the frame (dashed line)</label>
    </div>`;
}
 
function mediaControls(it, t = 'data-target="item"') {
  const m = mediaOf(it);
  return `
    <h4>Frame &amp; picture</h4>
    <label>Frame shape (aspect ratio)
      <input list="aspect-list" ${t} data-key="media.aspect" value="${esc(m.aspect)}">
    </label>
    <datalist id="aspect-list">${FRAME_ASPECTS.map((a) => `<option value="${a}">`).join("")}</datalist>
    <label>Empty-space background (frame colour)
      <input ${t} data-key="media.bg" value="${esc(m.bg)}">
    </label>
    ${it.kind === "video" ? `
      <label><input type="checkbox" ${t} data-key="media.autoplay" ${m.autoplay ? "checked" : ""}> Autoplay</label>
      <label><input type="checkbox" ${t} data-key="media.loop" ${m.loop ? "checked" : ""}> Loop</label>
      <label><input type="checkbox" ${t} data-key="media.muted" ${m.muted ? "checked" : ""}> Muted</label>` : ""}`;
}
 
function itemForm(it) {
  const s = it.style || {};
  const t = 'data-target="item"';
  const isText = it.kind === "text";
  const isBtn = it.kind === "button";
  const isMedia = isMediaKind(it.kind);
  const color = /^#[0-9a-f]{6}$/i.test(s.color || "") ? s.color : "#1d1d1d";
 
  return `
    <h3>selected: ${esc(it.kind)}</h3>
    ${isMedia ? cropEditor(it) : ""}
    ${isMedia ? mediaControls(it) : ""}
    ${isText ? `<label>Text<textarea rows="3" ${t} data-key="text">${esc(it.text)}</textarea></label>` : ""}
    ${isBtn ? `<label>Button label<input ${t} data-key="text" value="${esc(it.text)}"></label>
               <label>Link<input ${t} data-key="href" value="${esc(it.href)}"></label>` : ""}
    ${isMedia ? `<label>Kind
                   <select ${t} data-key="kind">${["image", "sticker"].map((k) => opt(k, it.kind, k)).join("")}</select>
                 </label>
                 <div class="row">
                   <button data-act="item-replace">replace file</button>
                   <button data-act="item-url">set image URL</button>
                 </div>` : ""}
    <h4>Size, position &amp; look</h4>
    <label>Width (% of canvas)<input type="number" step="1" ${t} data-key="w" value="${it.w}"></label>
    <label>Rotation (degrees)<input type="number" step="1" ${t} data-key="rot" value="${it.rot || 0}"></label>
    <label>Opacity
      <input type="range" min="0" max="1" step="0.05" ${t} data-key="style.opacity" value="${s.opacity === undefined ? 1 : s.opacity}">
    </label>
    <label>Corner radius (CSS, e.g. 12px or 50%)<input ${t} data-key="style.radius" value="${esc(s.radius || "")}"></label>
    ${isText || isBtn ? `<label>Font size (px on a 900px canvas)<input type="number" ${t} data-key="style.fontSize" value="${s.fontSize || (isText ? 32 : 22)}"></label>` : ""}
    ${isText ? `
      <label>Font<select ${t} data-key="style.fontFamily">${FONTS.map((f) => opt(f.value, s.fontFamily, f.label)).join("")}</select></label>
      <label>Weight<select ${t} data-key="style.weight">${[400, 700, 900].map((w) => opt(w, Number(s.weight), w)).join("")}</select></label>
      <label>Alignment<select ${t} data-key="style.align">${["left", "center", "right"].map((a) => opt(a, s.align, a)).join("")}</select></label>
      <label>Text colour<input type="color" ${t} data-key="style.color" value="${color}"></label>` : ""}
    <label>Background (colour, or "transparent")<input ${t} data-key="style.bg" value="${esc(s.bg || "transparent")}"></label>
    <label>Border (CSS, e.g. 3px solid #1d1d1d)<input ${t} data-key="style.border" value="${esc(s.border || "")}"></label>
    <label><input type="checkbox" ${t} data-key="style.shadow" ${s.shadow ? "checked" : ""}> Hard shadow</label>
    <label><input type="checkbox" ${t} data-key="locked" ${it.locked ? "checked" : ""}> Lock (can't be moved)</label>
    <div class="row">
      <button data-act="item-fwd">bring forward</button>
      <button data-act="item-back">send back</button>
      <button data-act="item-dup">duplicate</button>
      <button data-act="item-del">delete</button>
    </div>`;
}
 
// One project card's full settings. Crop and frame controls only appear for the
// selected card, so the crop box ID stays unique.
function projectForm(p, i) {
  const sel = p.id === selectedProjectId;
  const s = p.style || {};
  const show = showOf(p);
  const t = `data-target="project" data-index="${i}"`;
  const proxy = { id: p.id, kind: "image", src: p.thumb, alt: p.title, media: p.media };
  const cb = (key, on, label) =>
    `<label><input type="checkbox" ${t} data-key="${key}" ${on ? "checked" : ""}> ${label}</label>`;
 
  return `
    <details class="card-form" ${sel ? "open" : ""}>
      <summary><strong>${i + 1}. ${esc(p.title)}</strong>${sel ? " ← editing" : ""}</summary>
 
      <h4>Text</h4>
      <label>Title<input ${t} data-key="title" value="${esc(p.title)}"></label>
      <label>Description<textarea rows="2" ${t} data-key="desc">${esc(p.desc)}</textarea></label>
      <label>External link<input ${t} data-key="link" value="${esc(p.link)}"></label>
      <label>Tags (comma separated)<input ${t} data-key="tags" value="${esc((p.tags || []).join(", "))}"></label>
      <label>Title size (rem)<input type="number" step="0.1" ${t} data-key="style.titleSize" value="${s.titleSize || 1.2}"></label>
      <label>Title colour<input type="color" ${t} data-key="style.titleColor" value="${/^#[0-9a-f]{6}$/i.test(s.titleColor || "") ? s.titleColor : "#1d1d1d"}"></label>
      <label>Text alignment<select ${t} data-key="style.align">${["left", "center", "right"].map((a) => opt(a, s.align || "left", a)).join("")}</select></label>
      <label>Text position<select ${t} data-key="style.textOrder">${[["below", "below picture"], ["above", "above picture"]].map(([v, l]) => opt(v, s.textOrder || "below", l)).join("")}</select></label>
      <label><input type="checkbox" ${t} data-key="featured" ${p.featured ? "checked" : ""}> Featured (spans two columns)</label>
 
      <h4>Show / hide</h4>
      ${cb("show.title", show.title, "title")}
      ${cb("show.desc", show.desc, "description")}
      ${cb("show.tags", show.tags, "tags")}
      ${cb("show.link", show.link, "link")}
 
      <h4>Card look</h4>
      <label>Rotation (degrees)<input type="number" step="1" ${t} data-key="rot" value="${p.rot || 0}"></label>
      <label>Border (CSS)<input ${t} data-key="style.border" value="${esc(s.border || "")}" placeholder="2px solid #1d1d1d"></label>
      <label>Corner radius (CSS)<input ${t} data-key="style.radius" value="${esc(s.radius || "")}"></label>
      <label>Card background (colour)<input ${t} data-key="style.bg" value="${esc(s.bg || "")}" placeholder="e.g. #fffdf7"></label>
      <label>Padding (CSS)<input ${t} data-key="style.padding" value="${esc(s.padding || "")}" placeholder="14px 14px 18px"></label>
      <label>Opacity<input type="range" min="0" max="1" step="0.05" ${t} data-key="style.opacity" value="${s.opacity === undefined ? 1 : s.opacity}"></label>
      <label>${s.shadow === false ? `<input type="checkbox" ${t} data-key="style.shadow"> Hard shadow` : `<input type="checkbox" ${t} data-key="style.shadow" checked> Hard shadow`}</label>
 
      <h4>Thumbnail / GIF</h4>
      <div class="row">
        <button data-act="proj-thumb" data-index="${i}">replace thumbnail</button>
        <button data-act="proj-preview" data-index="${i}">${p.preview ? "replace" : "add"} hover preview</button>
      </div>
      ${sel ? `${cropEditor(proxy, t)}${mediaControls(proxy, t)}` : `<p class="hint">Click this card on the page to crop its picture and change its frame.</p>`}
 
      <div class="row">
        <button data-act="proj-up" data-index="${i}">↑ up</button>
        <button data-act="proj-down" data-index="${i}">↓ down</button>
        <button data-act="proj-del" data-index="${i}">remove</button>
      </div>
    </details>`;
}
 
function projectsForm() {
  const hint = selectedProjectId
    ? ""
    : `<p class="hint">Click any project card on the page to edit its text, look, picture and crop.</p>`;
  return hint + C.projects.map(projectForm).join("") +
    `<button data-act="proj-add">+ add project</button>`;
}
 
function identityForm() {
  const id = C.identity;
  const tabTitle = id.title || C.site.title;
  return `
    <h4>Browser tab preview</h4>
    <div class="fake-tab">
      <img src="${esc(resolveSrc(id.favicon) || ph("A", "#1d1d1d", "#fff"))}" alt="">
      <span>${esc(tabTitle)}</span>
    </div>
    <div class="row">
      <button data-act="id-favicon">upload favicon</button>
      ${id.favicon ? `<button data-act="id-favicon-clear">remove</button>` : ""}
    </div>
    <p class="hint">Square PNG, 512×512 ideal (ICO and SVG also work). The browser shrinks it for you.</p>
    <label>Browser tab title<input data-target="site" data-key="identity.title" value="${esc(id.title)}"></label>
    <label>Search description<textarea rows="2" data-target="site" data-key="identity.description">${esc(id.description)}</textarea></label>
 
    <h4>Share preview (chat / social links)</h4>
    <div class="share-preview">
      ${id.shareImage ? `<img src="${esc(resolveSrc(id.shareImage))}" alt="">` : `<em>no share image yet</em>`}
      <strong>${esc(id.shareTitle || id.title)}</strong>
      <span>${esc(id.shareDescription || id.description)}</span>
    </div>
    <div class="row">
      <button data-act="id-share">upload share image (1200×630)</button>
      ${id.shareImage ? `<button data-act="id-share-clear">remove</button>` : ""}
    </div>
    <label>Share title<input data-target="site" data-key="identity.shareTitle" value="${esc(id.shareTitle)}"></label>
    <label>Share description<textarea rows="2" data-target="site" data-key="identity.shareDescription">${esc(id.shareDescription)}</textarea></label>
    <p class="hint">Heads up: link previews in Discord, iMessage and Slack read the static meta tags in index.html, and they can't run JavaScript. Paste the snippet from the reply into index.html once.</p>`;
}
 
function siteForm() {
  return `
    <label>Your name (header)<input data-target="site" data-key="site.name" value="${esc(C.site.name)}"></label>
    <label>Background<input type="color" data-target="site" data-key="theme.bg" value="${C.theme.bg}"></label>
    <label>Text colour<input type="color" data-target="site" data-key="theme.ink" value="${C.theme.ink}"></label>
    <label>Accent colour<input type="color" data-target="site" data-key="theme.accent" value="${C.theme.accent}"></label>
    <label>Hero canvas shape<select data-target="site" data-key="canvasAspect">${ASPECTS.map((a) => opt(a, C.canvasAspect, a)).join("")}</select></label>
    <label>About (blank line between paragraphs)<textarea rows="6" data-target="site" data-key="about">${esc(C.about)}</textarea></label>
    <h4>Links</h4>
    ${C.links.map((l, i) => `
      <div class="row">
        <input data-target="link" data-index="${i}" data-key="label" value="${esc(l.label)}" placeholder="label">
        <input data-target="link" data-index="${i}" data-key="url" value="${esc(l.url)}" placeholder="https://">
        <button data-act="link-del" data-index="${i}">✕</button>
      </div>`).join("")}
    <button data-act="link-add">+ add link</button>`;
}
 
function refreshPanel() {
  if (!editing) return;
  document.querySelectorAll("#ed-panel .tabs button").forEach((b) =>
    b.classList.toggle("on", b.dataset.tab === currentTab));
  const body = $("#ed-body");
  if (currentTab === "canvas") {
    const it = findItem(selectedId);
    body.innerHTML = it ? itemForm(it) : canvasHint();
  } else if (currentTab === "projects") {
    body.innerHTML = projectsForm();
  } else if (currentTab === "identity") {
    body.innerHTML = identityForm();
  } else {
    body.innerHTML = siteForm();
  }
  updateProjectSelection();
}
 
// The object a form field edits, based on its data-target.
function targetOf(el) {
  const t = el.dataset.target;
  const idx = Number(el.dataset.index);
  if (t === "item") return findItem(selectedId);
  if (t === "project") return C.projects[idx];
  if (t === "link") return C.links[idx];
  return C;
}
 
// Live update while dragging the zoom slider: no save, no history entry yet.
function onPanelInput(e) {
  const el = e.target;
  if (el.type !== "range" || !el.dataset.key || !el.dataset.key.startsWith("media.")) return;
  const obj = targetOf(el);
  if (!obj) return;
  setPath(obj, el.dataset.key, Number(el.value));
  applyMediaTransform(obj);
}
 
// Any form field change: write it into the data, then save.
function onPanelChange(e) {
  const el = e.target;
  if (el.id === "show-outside") {
    showOutside = el.checked;
    return refreshPanel();
  }
  if (!el.dataset.key) return;
  const obj = targetOf(el);
  if (!obj) return;
 
  let v = el.type === "checkbox" ? el.checked
        : (el.type === "number" || el.type === "range") ? Number(el.value)
        : el.value;
  if ((el.type === "number" || el.type === "range") && Number.isNaN(v)) return;
  const key = el.dataset.key;
  if (key === "tags") v = v.split(",").map((s) => s.trim()).filter(Boolean);
  if (key === "style.bg" && !String(v).trim()) v = "transparent";
  if (key === "media.bg" && !String(v).trim()) v = "transparent";
  if (key === "media.aspect" && !String(v).trim()) v = "auto";
 
  setPath(obj, key, v);
  const isPanOrZoom = key === "media.zoom" || key === "media.panX" || key === "media.panY";
  if (key.startsWith("media.")) applyMediaTransform(obj);
  commit(!isPanOrZoom);
}
 
/* ============================================================
   TOOLBAR ACTIONS
   ============================================================ */
function act(name, d) {
  const it = findItem(selectedId);
  const idx = Number(d.index);
 
  switch (name) {
    case "tab":
      currentTab = d.tab;
      return refreshPanel();
    case "select":
      select(d.id);
      return refreshPanel();
    case "undo": return undo();
    case "redo": return redo();
    case "export": return exportSite();
    case "exit": return exitEditor();
    case "reset":
      if (confirm("Throw away the draft and go back to the published site?")) {
        C = clone(CONTENT);
        selectedId = null;
        selectedProjectId = null;
        commit(true);
      }
      return;
 
    case "add-image": return askFile({ mode: "add" });
    case "add-url": {
      const url = prompt("Image or GIF URL:");
      if (!url) return;
      const n = newItem({ kind: "image", src: url.trim(), x: 30, y: 25, w: 25 });
      C.canvas.push(n);
      selectedId = n.id;
      return commit(true);
    }
    case "add-text": {
      const n = newItem({
        kind: "text", text: "type here", x: 20, y: 20, w: 35,
        style: { fontSize: 40, fontFamily: FONTS[0].value, weight: 700, color: C.theme.ink, align: "left", bg: "transparent", border: "", shadow: false },
      });
      C.canvas.push(n);
      selectedId = n.id;
      return commit(true);
    }
    case "add-button": {
      const n = newItem({
        kind: "button", text: "click me", href: "#", x: 40, y: 40, w: 22,
        style: { fontSize: 22, bg: "transparent", border: "", shadow: false },
      });
      C.canvas.push(n);
      selectedId = n.id;
      return commit(true);
    }
 
    case "item-replace": return askFile({ mode: "replace" });
    case "item-url": {
      if (!it) return;
      const url = prompt("Image or GIF URL:", it.src && !it.src.startsWith("data:") ? it.src : "");
      if (url) { it.src = url.trim(); it.media = { ...MEDIA_DEFAULTS, aspect: mediaOf(it).aspect, bg: mediaOf(it).bg }; commit(true); }
      return;
    }
    case "item-dup": {
      if (!it) return;
      const copy = clone(it);
      copy.id = uid("c");
      copy.x = r1(it.x + 2);
      copy.y = r1(it.y + 2);
      copy.z = maxZExcept(null) + 1;
      C.canvas.push(copy);
      selectedId = copy.id;
      return commit(true);
    }
    case "item-del": return deleteItem();
    case "item-fwd":
      if (it) { it.z = maxZExcept(it) + 1; commit(true); }
      return;
    case "item-back":
      if (it) { it.z = minZExcept(it) - 1; commit(true); }
      return;
 
    case "media-fit":
    case "media-fill": {
      const obj = d.target === "project" ? C.projects[idx] : it;
      if (!obj) return;
      if (placeMedia(obj, name === "media-fit" ? "fit" : "fill")) commit(true);
      return;
    }
    case "crop-reset": {
      const obj = d.target === "project" ? C.projects[idx] : it;
      if (obj) { placeMedia(obj, "reset"); commit(true); }
      return;
    }
 
    case "id-favicon": return askFile({ mode: "identity", field: "favicon" });
    case "id-favicon-clear": C.identity.favicon = ""; return commit(true);
    case "id-share": return askFile({ mode: "identity", field: "shareImage" });
    case "id-share-clear": C.identity.shareImage = ""; return commit(true);
 
    case "proj-add": {
      const p = { id: uid("p"), title: "New project", desc: "", thumb: ph("NEW PROJECT", "#b8f2e6"), preview: "", link: "", tags: [] };
      C.projects.push(p);
      selectedProjectId = p.id;
      currentTab = "projects";
      return commit(true);
    }
    case "proj-up": moveIn(C.projects, idx, -1); return commit(true);
    case "proj-down": moveIn(C.projects, idx, 1); return commit(true);
    case "proj-del":
      if (confirm("Remove this project from the site?")) {
        if (C.projects[idx]?.id === selectedProjectId) selectedProjectId = null;
        C.projects.splice(idx, 1);
        commit(true);
      }
      return;
    case "proj-thumb": return askFile({ mode: "project", index: idx, field: "thumb" });
    case "proj-preview": return askFile({ mode: "project", index: idx, field: "preview" });
 
    case "link-add": C.links.push({ label: "New link", url: "https://" }); return commit(true);
    case "link-del": C.links.splice(idx, 1); return commit(true);
  }
}
 
function onAct(e) {
  if (!editing) return;
  const b = e.target.closest("[data-act]");
  if (!b) return;
  act(b.dataset.act, b.dataset);
}
 
function onKey(e) {
  if (!editing) return;
  if (e.target.closest("input, textarea, select, [contenteditable='true']")) return;
  const mod = e.ctrlKey || e.metaKey;
  const key = e.key.toLowerCase();
 
  if (mod && key === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
  if (mod && key === "y") { e.preventDefault(); redo(); return; }
 
  if (!selectedId) return;
  if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); deleteItem(); return; }
 
  const it = findItem(selectedId);
  if (!it || it.locked || !e.key.startsWith("Arrow")) return;
  e.preventDefault();
  const step = e.shiftKey ? 2 : 0.5;
  if (e.key === "ArrowLeft") it.x = r1(it.x - step);
  if (e.key === "ArrowRight") it.x = r1(it.x + step);
  if (e.key === "ArrowUp") it.y = r1(it.y - step);
  if (e.key === "ArrowDown") it.y = r1(it.y + step);
  commit(false);
}
 
/* ============================================================
   EXPORT (publishing)
   Writes an updated script.js with the new content baked in,
   and downloads any uploaded images so you can put them in assets/.
   Picture sizes and crop settings are saved inside each object's media.
   ============================================================ */
async function exportSite() {
  const data = clone(C);
  await inlineAssets(data);
  const downloads = [];
  let n = 0;
 
  const extFor = (u) => {
    const m = u.match(/^data:image\/([a-z0-9+.-]+);/i);
    if (!m) return "png";
    return m[1].replace("svg+xml", "svg").replace("x-icon", "ico").replace("vnd.microsoft.icon", "ico").replace("jpeg", "jpg");
  };
  const isPlaceholder = (s) => /^data:image\/svg\+xml;utf8/.test(s);
  const localize = (src, base) => {
    if (!src || !src.startsWith("data:") || isPlaceholder(src)) return src;
    const name = `assets/${base}-${++n}.${extFor(src)}`;
    downloads.push({ name, href: src });
    return name;
  };
 
  data.canvas.forEach((it) => { if (it.src) it.src = localize(it.src, it.kind); });
  data.projects.forEach((p, i) => {
    p.thumb = localize(p.thumb, `project${i + 1}-thumb`);
    p.preview = localize(p.preview, `project${i + 1}-preview`);
  });
  data.identity.favicon = localize(data.identity.favicon, "favicon");
  data.identity.shareImage = localize(data.identity.shareImage, "share-image");
 
  let source = null;
  try {
    source = await (await fetch("script.js", { cache: "no-store" })).text();
  } catch { /* opened from file:// or no server */ }
 
  const block = `/* CONTENT:START */\nconst CONTENT = ${JSON.stringify(data, null, 2)};\n/* CONTENT:END */`;
  if (source && source.includes("CONTENT:START")) {
    const next = source.replace(/\/\* CONTENT:START \*\/[\s\S]*?\/\* CONTENT:END \*\//, () => block);
    const url = URL.createObjectURL(new Blob([next], { type: "text/javascript" }));
    downloads.unshift({ name: "script.js", href: url });
  } else {
    const url = URL.createObjectURL(new Blob([block], { type: "text/javascript" }));
    downloads.unshift({ name: "content-block.js", href: url });
    alert("Couldn't read script.js from this page (are you running it from a local server or GitHub Pages?). I downloaded just the content block instead. Paste it between the CONTENT markers in script.js.");
  }
 
  for (const d of downloads) {
    const a = document.createElement("a");
    a.href = d.href;
    a.download = d.name.split("/").pop();
    document.body.appendChild(a);
    a.click();
    a.remove();
    await new Promise((r) => setTimeout(r, 300)); // give the browser time between downloads
  }
 
  alert("Exported! To publish:\n1. Replace script.js in your repo with the downloaded one.\n2. Create an assets/ folder and move the downloaded images into it.\n3. Commit and push. GitHub Pages updates in a minute or two.");
}
 
/* ============================================================
   OWNER MODE SETUP
   ============================================================ */
function enterEditor() {
  editing = true;
 
  const bar = document.createElement("div");
  bar.id = "ed-bar";
  bar.innerHTML = `
    <strong>✏️ owner mode</strong>
    <button data-act="add-image">+ image / GIF / sticker</button>
    <button data-act="add-url">+ image URL</button>
    <button data-act="add-text">+ text</button>
    <button data-act="add-button">+ button</button>
    <button data-act="undo">↶ undo</button>
    <button data-act="redo">↷ redo</button>
    <button data-act="export">⬇ export site</button>
    <button data-act="reset">reset draft</button>
    <button data-act="exit">exit</button>`;
 
  const panel = document.createElement("aside");
  panel.id = "ed-panel";
  panel.innerHTML = `
    <div class="tabs">
      <button data-act="tab" data-tab="canvas">canvas</button>
      <button data-act="tab" data-tab="projects">projects</button>
      <button data-act="tab" data-tab="identity">identity</button>
      <button data-act="tab" data-tab="site">site</button>
    </div>
    <div id="ed-body"></div>`;
 
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.id = "file-input";
  fileInput.hidden = true;
  fileInput.addEventListener("change", onFile);
 
  document.body.append(bar, panel, fileInput);
  document.body.classList.add("editing");
  panel.addEventListener("change", onPanelChange);
  panel.addEventListener("input", onPanelInput);
  panel.addEventListener("pointerdown", onPanelDown);
  document.addEventListener("keydown", onKey);
 
  updateSelection();
  refreshPanel();
  updateToolbar();
}
 
function exitEditor() {
  editing = false;
  selectedId = null;
  selectedProjectId = null;
  $("#ed-bar")?.remove();
  $("#ed-panel")?.remove();
  $("#file-input")?.remove();
  document.body.classList.remove("editing");
  document.removeEventListener("keydown", onKey);
  // Show visitors' version again. Your draft is still saved in this browser.
  C = clone(CONTENT);
  renderPage();
}
 
async function openOwnerMode() {
  if (CONFIG.ownerHash.startsWith("PASTE_")) {
    alert("Owner passphrase isn't set yet. See the instructions at the top of script.js.");
    return;
  }
  const pass = prompt("Owner passphrase:");
  if (!pass) return;
  if ((await sha256(pass)) !== CONFIG.ownerHash) {
    alert("Nope 🙃");
    return;
  }
  try {
    const saved = localStorage.getItem(CONFIG.draftKey);
    if (saved) C = JSON.parse(saved);
  } catch { /* corrupt draft: fall back to published */ }
  await prepareAssets();
  hist.stack = [clone(C)];
  hist.i = 0;
  enterEditor();
  renderPage();
}
 
/* ============================================================
   INIT
   ============================================================ */
function init() {
  const canvas = $("#canvas");
  canvas.addEventListener("pointerdown", onCanvasDown);
  canvas.addEventListener("dblclick", onCanvasDbl);
  canvas.addEventListener("click", (e) => {
    if (editing && e.target.closest("a")) e.preventDefault();
  });
  $("#projects").addEventListener("click", onProjectClick);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
  document.addEventListener("click", onAct);
 
  renderPage();
  if (new URLSearchParams(location.search).has("edit")) openOwnerMode();
}
 
init();
 
