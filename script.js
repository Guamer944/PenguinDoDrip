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
  ownerHash: "a341b49baa4f057c9397e19e22c20969a77952f6ea6957bf04a36558ae99e4c1",",
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
const MEDIA_DEFAULTS = {
  fit: "cover", aspect: "auto", panX: 0, panY: 0, zoom: 1,
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
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const findItem = (id) => C.canvas.find((i) => i.id === id);
const elOf = (id) => document.querySelector(`#canvas .item[data-id="${id}"]`);
const isMediaKind = (k) => k === "image" || k === "sticker" || k === "video";

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
window.hashPassphrase = sha256;

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
let selectedId = null;
let currentTab = "canvas";
let gesture = null;
let cropDrag = null;
let pendingUpload = null;
const hist = { stack: [], i: -1 };

/* ============================================================
   MEDIA (images, GIFs, stickers, videos)
   Pan/zoom/fit live in item.media. The file itself is never changed,
   so GIF animation and video playback are preserved.
   ============================================================ */
const mediaOf = (item) => ({ ...MEDIA_DEFAULTS, ...(item.media || {}) });

function mediaTransform(m) {
  return `translate(${m.panX}%, ${m.panY}%) scale(${m.zoom})`;
}

function mediaInnerHTML(item, forceFrame = false) {
  const m = mediaOf(item);
  const h = forceFrame || m.aspect !== "auto" ? "100%" : "auto";
  const style = `display:block;width:100%;height:${h};object-fit:${m.fit};` +
                `transform:${mediaTransform(m)};transform-origin:center;pointer-events:none;`;
  if (item.kind === "video") {
    return `<video src="${esc(item.src)}" style="${style}" ${m.autoplay ? "autoplay" : ""} ${m.loop ? "loop" : ""} ${m.muted ? "muted" : ""} playsinline></video>`;
  }
  return `<img src="${esc(item.src)}" alt="${esc(item.alt || "")}" draggable="false" style="${style}">`;
}

// Update just the transform (cheap, no video restart) while dragging a crop.
function applyMediaTransform(item) {
  const t = mediaTransform(mediaOf(item));
  document
    .querySelectorAll(`#canvas .item[data-id="${item.id}"] .media-frame > *, #crop-box .crop-inner > *`)
    .forEach((n) => { n.style.transform = t; });
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
    el.style.aspectRatio = m.aspect === "auto" ? "" : m.aspect;
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

function projectCard(p) {
  return `
    <article class="card">
      <div class="thumb">
        <img src="${esc(p.thumb)}" alt="${esc(p.title)}">
        ${p.preview ? `<video src="${esc(p.preview)}" muted loop playsinline></video>` : ""}
      </div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.desc)}</p>
      <div class="tags">${(p.tags || []).map((t) => `<span>${esc(t)}</span>`).join("")}</div>
      ${p.link ? `<a href="${esc(p.link)}" target="_blank" rel="noopener">watch project →</a>` : ""}
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
    link.href = id.favicon;
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
  updateSelection();
  if (editing) refreshPanel();
}

/* ============================================================
   HISTORY (undo / redo) + DRAFT SAVING
   ============================================================ */
function saveDraft() {
  try {
    localStorage.setItem(CONFIG.draftKey, JSON.stringify(C));
  } catch {
    alert("Your draft is too big for browser storage (big uploaded files). Export now so nothing gets lost, then move big files into assets/.");
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
   POINTER GESTURES: move, resize, rotate (canvas) + crop pan (panel)
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

// Dragging inside the crop preview pans the picture within its frame.
function onPanelDown(e) {
  const box = e.target.closest("#crop-box");
  if (!box) return;
  const it = findItem(selectedId);
  if (!it) return;
  e.preventDefault();
  const m = mediaOf(it);
  cropDrag = { item: it, box, sx: e.clientX, sy: e.clientY, ox: m.panX, oy: m.panY, moved: false };
}

function onMove(e) {
  if (cropDrag) {
    const c = cropDrag;
    const r = c.box.getBoundingClientRect();
    const m = mediaOf(c.item);
    m.panX = r1(c.ox + ((e.clientX - c.sx) / r.width) * 100);
    m.panY = r1(c.oy + ((e.clientY - c.sy) / r.height) * 100);
    c.item.media = m;
    c.moved = true;
    applyMediaTransform(c.item);
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
  if (f.size > 5 * 1024 * 1024) {
    alert("Heads up: that's a big file. It'll work, but compress it if the page feels slow.");
  }
  const url = await new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(f); // keeps GIF animation intact
  });
  const kind = f.type.startsWith("video/") ? "video" : "image";

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
    it.media = { ...mediaOf(it), panX: 0, panY: 0, zoom: 1 }; // new file starts uncropped
  } else if (p.mode === "project") {
    C.projects[p.index][p.field] = url;
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

function cropEditor(it) {
  const m = mediaOf(it);
  const ratio = m.aspect === "auto" ? "4 / 3" : m.aspect;
  return `
    <div class="crop-wrap">
      <h4>Crop &amp; position</h4>
      <div id="crop-box" class="crop-box" style="aspect-ratio:${ratio}" title="drag to reposition">
        <div class="crop-inner">${mediaInnerHTML(it, true)}</div>
      </div>
      <p class="hint">Drag the picture inside the frame to choose what's visible. Your file isn't changed.</p>
      <label>Zoom
        <input type="range" min="1" max="4" step="0.05" data-target="item" data-key="media.zoom" value="${m.zoom}">
      </label>
      <div class="row">
        <label>Pan X %<input type="number" step="1" data-target="item" data-key="media.panX" value="${m.panX}"></label>
        <label>Pan Y %<input type="number" step="1" data-target="item" data-key="media.panY" value="${m.panY}"></label>
      </div>
      <div class="row"><button data-act="crop-reset">reset crop</button></div>
    </div>`;
}

function mediaControls(it) {
  const m = mediaOf(it);
  const t = 'data-target="item"';
  const fits = [["cover", "fill frame (cover)"], ["contain", "fit inside (contain)"], ["fill", "stretch (fill)"], ["none", "original size"]];
  return `
    <h4>Frame &amp; picture</h4>
    <label>Frame shape (aspect ratio)
      <input list="aspect-list" ${t} data-key="media.aspect" value="${esc(m.aspect)}">
    </label>
    <datalist id="aspect-list">${FRAME_ASPECTS.map((a) => `<option value="${a}">`).join("")}</datalist>
    <label>Picture fit
      <select ${t} data-key="media.fit">${fits.map(([v, l]) =>
        `<option value="${v}" ${m.fit === v ? "selected" : ""}>${l}</option>`).join("")}</select>
    </label>
    <label>Empty-space background (for "fit inside")
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
                   <select ${t} data-key="kind">${["image", "sticker"].map((k) =>
                     `<option ${k === it.kind ? "selected" : ""}>${k}</option>`).join("")}</select>
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
      <label>Font<select ${t} data-key="style.fontFamily">${FONTS.map((f) =>
        `<option value="${esc(f.value)}" ${f.value === s.fontFamily ? "selected" : ""}>${f.label}</option>`).join("")}</select></label>
      <label>Weight<select ${t} data-key="style.weight">${[400, 700, 900].map((w) =>
        `<option value="${w}" ${Number(s.weight) === w ? "selected" : ""}>${w}</option>`).join("")}</select></label>
      <label>Alignment<select ${t} data-key="style.align">${["left", "center", "right"].map((a) =>
        `<option ${s.align === a ? "selected" : ""}>${a}</option>`).join("")}</select></label>
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

function projectsForm() {
  const rows = C.projects.map((p, i) => `
    <div class="card-form">
      <strong>${i + 1}. ${esc(p.title)}</strong>
      <label>Title<input data-target="project" data-index="${i}" data-key="title" value="${esc(p.title)}"></label>
      <label>Description<textarea rows="2" data-target="project" data-index="${i}" data-key="desc">${esc(p.desc)}</textarea></label>
      <label>External link<input data-target="project" data-index="${i}" data-key="link" value="${esc(p.link)}"></label>
      <label>Tags (comma separated)<input data-target="project" data-index="${i}" data-key="tags" value="${esc((p.tags || []).join(", "))}"></label>
      <div class="row">
        <img class="mini" src="${esc(p.thumb)}" alt="">
        <button data-act="proj-thumb" data-index="${i}">replace thumbnail</button>
        <button data-act="proj-preview" data-index="${i}">${p.preview ? "replace" : "add"} GIF/video preview</button>
      </div>
      <div class="row">
        <button data-act="proj-up" data-index="${i}">↑ up</button>
        <button data-act="proj-down" data-index="${i}">↓ down</button>
        <button data-act="proj-del" data-index="${i}">remove</button>
      </div>
    </div>`).join("");
  return `${rows}<button data-act="proj-add">+ add project</button>`;
}

function identityForm() {
  const id = C.identity;
  const tabTitle = id.title || C.site.title;
  return `
    <h4>Browser tab preview</h4>
    <div class="fake-tab">
      <img src="${esc(id.favicon || ph("A", "#1d1d1d", "#fff"))}" alt="">
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
      ${id.shareImage ? `<img src="${esc(id.shareImage)}" alt="">` : `<em>no share image yet</em>`}
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
    <label>Hero canvas shape<select data-target="site" data-key="canvasAspect">${ASPECTS.map((a) =>
      `<option value="${a}" ${a === C.canvasAspect ? "selected" : ""}>${a}</option>`).join("")}</select></label>
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
}

// Any form field change: write it into the data, then save.
function onPanelChange(e) {
  const el = e.target;
  if (!el.dataset.key) return;
  const t = el.dataset.target;
  const idx = Number(el.dataset.index);
  const obj =
    t === "item" ? findItem(selectedId) :
    t === "project" ? C.projects[idx] :
    t === "link" ? C.links[idx] : C;
  if (!obj) return;

  let v = el.type === "checkbox" ? el.checked
        : (el.type === "number" || el.type === "range") ? Number(el.value)
        : el.value;
  if ((el.type === "number" || el.type === "range") && Number.isNaN(v)) return;
  if (el.dataset.key === "tags") v = v.split(",").map((s) => s.trim()).filter(Boolean);
  if (el.dataset.key === "style.bg" && !String(v).trim()) v = "transparent";
  if (el.dataset.key === "media.bg" && !String(v).trim()) v = "transparent";
  if (el.dataset.key === "media.aspect" && !String(v).trim()) v = "auto";

  setPath(obj, el.dataset.key, v);
  // Keep the crop preview and canvas in sync when zoom or pan changes.
  if (t === "item" && el.dataset.key.startsWith("media.")) {
    const it = findItem(selectedId);
    if (it) {
      const el2 = elOf(it.id);
      if (el2) {
        el2.querySelector(".media-frame")?.style.setProperty("background", mediaOf(it).bg);
      }
      applyMediaTransform(it);
    }
  }
  commit(!el.dataset.key.startsWith("media.zoom") && !el.dataset.key.startsWith("media.pan"));
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
      selectedId = d.id;
      updateSelection();
      return refreshPanel();
    case "undo": return undo();
    case "redo": return redo();
    case "export": return exportSite();
    case "exit": return exitEditor();
    case "reset":
      if (confirm("Throw away the draft and go back to the published site?")) {
        C = clone(CONTENT);
        selectedId = null;
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
      if (url) { it.src = url.trim(); commit(true); }
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

    case "crop-reset":
      if (it) { it.media = { ...mediaOf(it), panX: 0, panY: 0, zoom: 1 }; commit(true); }
      return;

    case "id-favicon": return askFile({ mode: "identity", field: "favicon" });
    case "id-favicon-clear": C.identity.favicon = ""; return commit(true);
    case "id-share": return askFile({ mode: "identity", field: "shareImage" });
    case "id-share-clear": C.identity.shareImage = ""; return commit(true);

    case "proj-add":
      C.projects.push({ id: uid("p"), title: "New project", desc: "", thumb: ph("NEW PROJECT", "#b8f2e6"), preview: "", link: "", tags: [] });
      return commit(true);
    case "proj-up": moveIn(C.projects, idx, -1); return commit(true);
    case "proj-down": moveIn(C.projects, idx, 1); return commit(true);
    case "proj-del":
      if (confirm("Remove this project from the site?")) { C.projects.splice(idx, 1); commit(true); }
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
   ============================================================ */
async function exportSite() {
  const data = clone(C);
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
  panel.addEventListener("pointerdown", onPanelDown);
  document.addEventListener("keydown", onKey);

  updateSelection();
  refreshPanel();
  updateToolbar();
}

function exitEditor() {
  editing = false;
  selectedId = null;
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
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
  document.addEventListener("click", onAct);

  renderPage();
  if (new URLSearchParams(location.search).has("edit")) openOwnerMode();
}

init();
