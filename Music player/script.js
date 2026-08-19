// ============================================================
// DATA — swap seeds for your own images, or replace imgUrl()
// with a function that returns your real photo URLs.
// ============================================================
const photos = [
  { seed: "alps-ridge",     cat: "Landscape",    title: "Ridge Line at Dawn" },
  { seed: "fjord-mist",     cat: "Landscape",    title: "Fjord in Low Fog" },
  { seed: "dune-fields",    cat: "Landscape",    title: "Dune Fields, Noon" },
  { seed: "pine-forest",    cat: "Landscape",    title: "Pine Corridor" },
  { seed: "glacier-blue",   cat: "Landscape",    title: "Glacier Blue" },
  { seed: "salt-flats",     cat: "Landscape",    title: "Salt Flat Horizon" },
  { seed: "facade-lines",   cat: "Architecture", title: "Facade, Repeating" },
  { seed: "stairwell-spir", cat: "Architecture", title: "Stairwell Spiral" },
  { seed: "skyline-dusk",   cat: "Architecture", title: "Skyline at Dusk" },
  { seed: "bridge-truss",   cat: "Architecture", title: "Truss Bridge Study" },
  { seed: "lobby-marble",   cat: "Architecture", title: "Marble Lobby" },
  { seed: "tower-glass",    cat: "Architecture", title: "Glass Tower" },
  { seed: "fox-snow",       cat: "Wildlife",     title: "Fox in Snowlight" },
  { seed: "owl-branch",     cat: "Wildlife",     title: "Owl on Branch" },
  { seed: "horse-field",    cat: "Wildlife",     title: "Horses, Open Field" },
  { seed: "wolf-treeline",  cat: "Wildlife",     title: "Wolf at Treeline" },
  { seed: "deer-clearing",  cat: "Wildlife",     title: "Deer in Clearing" },
  { seed: "heron-shallow",  cat: "Wildlife",     title: "Heron in Shallows" },
  { seed: "alley-neon",     cat: "Urban",        title: "Alley, Neon Hour" },
  { seed: "market-stalls",  cat: "Urban",        title: "Market Stalls" },
  { seed: "transit-plat",   cat: "Urban",        title: "Transit Platform" },
  { seed: "crossing-rain",  cat: "Urban",        title: "Crossing in Rain" },
  { seed: "rooftop-line",   cat: "Urban",        title: "Rooftop Line" },
  { seed: "storefront-old", cat: "Urban",        title: "Old Storefront" },
];

// Returns an image URL for a given seed at a given size.
// Replace this with your own hosting logic if you have real photos.
function imgUrl(seed, w, h) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

// ============================================================
// BUILD FILTER BUTTONS
// ============================================================
const categories = ["All", ...new Set(photos.map(p => p.cat))];
const grid = document.getElementById("grid");
const filtersEl = document.getElementById("filters");

categories.forEach(cat => {
  const count = cat === "All" ? photos.length : photos.filter(p => p.cat === cat).length;
  const btn = document.createElement("button");
  btn.className = "filter-btn" + (cat === "All" ? " active" : "");
  btn.dataset.cat = cat;
  btn.innerHTML = `${cat}<span class="count">${count}</span>`;
  btn.addEventListener("click", () => setFilter(cat));
  filtersEl.appendChild(btn);
});

function setFilter(cat) {
  document.querySelectorAll(".filter-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.cat === cat);
  });
  document.querySelectorAll("figure.frame").forEach(f => {
    const show = cat === "All" || f.dataset.cat === cat;
    f.classList.toggle("hide", !show);
  });
}

// ============================================================
// BUILD GALLERY GRID
// ============================================================
const heightPool = [560, 640, 480, 720, 600]; // varies card height for a contact-sheet feel

photos.forEach((p, i) => {
  const h = heightPool[i % heightPool.length];
  const fig = document.createElement("figure");
  fig.className = "frame";
  fig.dataset.cat = p.cat;
  fig.dataset.index = i;
  fig.style.animationDelay = i * 0.03 + "s";
  fig.innerHTML = `
    <div class="frame-index">FRAME ${String(i + 1).padStart(2, "0")}</div>
    <img src="${imgUrl(p.seed, 600, h)}" loading="lazy" alt="${p.title}">
    <figcaption>
      <div class="cat">${p.cat}</div>
      <div class="ttl">${p.title}</div>
    </figcaption>
  `;
  fig.addEventListener("click", () => openLightbox(i));
  grid.appendChild(fig);
});

// ============================================================
// LIGHTBOX LOGIC
// ============================================================
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCat = document.getElementById("lbCat");
const lbTtl = document.getElementById("lbTtl");
const lbCounter = document.getElementById("lbCounter");
let currentIndex = 0;

// Only navigate between photos that match the active filter
function visibleIndices() {
  const activeCat = document.querySelector(".filter-btn.active").dataset.cat;
  return photos.map((p, i) => i).filter(i => activeCat === "All" || photos[i].cat === activeCat);
}

function openLightbox(index) {
  currentIndex = index;
  renderLightbox();
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden"; // lock background scroll
}

function renderLightbox() {
  const p = photos[currentIndex];

  // restart the pop-in animation on the image each time it changes
  lbImg.style.animation = "none";
  void lbImg.offsetWidth; // force reflow
  lbImg.style.animation = "";

  lbImg.src = imgUrl(p.seed, 1400, 950);
  lbImg.alt = p.title;
  lbCat.textContent = p.cat;
  lbTtl.textContent = p.title;
  lbCounter.textContent = `FRAME ${String(currentIndex + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;
}

function step(dir) {
  const vis = visibleIndices();
  let pos = vis.indexOf(currentIndex);
  if (pos === -1) pos = 0;
  pos = (pos + dir + vis.length) % vis.length;
  currentIndex = vis[pos];
  renderLightbox();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("lbNext").addEventListener("click", () => step(1));
document.getElementById("lbPrev").addEventListener("click", () => step(-1));
document.getElementById("lbClose").addEventListener("click", closeLightbox);

// click outside the image (on the dark backdrop) closes the lightbox
lightbox.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});

// keyboard navigation: Esc closes, arrows move prev/next
document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") step(1);
  if (e.key === "ArrowLeft") step(-1);
});