// ====== Project data (edit freely) ======
const projects = [
  {
    id: "next-law",
    title: "NEXT Law Office",
    type: "commercial",
    meta: "Workplace concept • Comfort + adaptability • Revit / Enscape",
    desc:
      "A contemporary workplace concept centered on comfort, flexibility, and human-scale detail. Designed with restorative zones, warm materials, and clear circulation to support focused work without feeling sterile.",
    tools: ["Revit", "Enscape", "Photoshop"],
    images: [
      "assets/project-next.jpg",
      "assets/project-next.jpg",
      "assets/project-next.jpg"
    ]
  },
  {
    id: "hermes-lounge",
    title: "Hermès Airport Lounge",
    type: "commercial",
    meta: "Hospitality/lounge • Heritage-inspired material story",
    desc:
      "A lounge concept that balances elevated luxury with grounded warmth. Material choices and detailing are inspired by brand heritage while maintaining a calm, inviting atmosphere for travelers.",
    tools: ["Revit", "Enscape", "Photoshop"],
    images: [
      "assets/project-hermes.jpg",
      "assets/project-hermes.jpg",
      "assets/project-hermes.jpg"
    ]
  },
  {
    id: "midcentury-manor",
    title: "Mid-Century Manor",
    type: "residential",
    meta: "Residential update • Mid-century cues • Calm palette",
    desc:
      "A residential concept blending mid-century inspired detailing with clean modern updates. The focus is cohesive material rhythm, functional layouts, and a comfortable, lived-in feel.",
    tools: ["Revit", "Enscape", "Photoshop"],
    images: [
      "assets/project-midcentury.jpg",
      "assets/project-midcentury.jpg",
      "assets/project-midcentury.jpg"
    ]
  }
];

// ====== Helpers ======
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function setYear() {
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function renderProjects(list) {
  const grid = $("#projectGrid");
  if (!grid) return;

  grid.innerHTML = list.map(p => `
    <article class="project" tabindex="0" role="button" aria-label="Open ${p.title}" data-id="${p.id}">
      <div class="project-media" style="background-image:url('${p.images[0]}')"></div>
      <div class="project-body">
        <h3 class="project-title serif">${p.title}</h3>
        <p class="project-meta">${p.meta}</p>
      </div>
      <div class="project-footer">
        <span class="tag">${p.type === "commercial" ? "Commercial" : "Residential"}</span>
        ${p.tools.slice(0,2).map(t => `<span class="tag">${t}</span>`).join("")}
      </div>
    </article>
  `).join("");
}

function setupFilters() {
  const filterBtns = $$(".filter");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const f = btn.dataset.filter;
      const filtered = f === "all" ? projects : projects.filter(p => p.type === f);
      renderProjects(filtered);
    });
  });
}

function setupModal() {
  const modal = $("#projectModal");
  if (!modal) return;

  const closeBtn = $(".modal-close", modal);
  const media = $("#modalMedia");
  const type = $("#modalType");
  const title = $("#modalTitle");
  const meta = $("#modalMeta");
  const desc = $("#modalDesc");
  const tools = $("#modalTools");

  function openProject(p) {
    media.innerHTML = p.images.map((img, index) => `
      <div class="modal-image" role="img" aria-label="${p.title} image ${index + 1}" style="background-image:url('${img}')"></div>
    `).join("");
    type.textContent = p.type === "commercial" ? "Commercial" : "Residential";
    title.textContent = p.title;
    meta.textContent = p.meta;
    desc.textContent = p.desc;

    tools.innerHTML = p.tools.map(t => `<span class="pill">${t}</span>`).join("");
    modal.showModal();
  }

  function closeModal() {
    modal.close();
  }

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".project");
    if (!card) return;

    const id = card.dataset.id;
    const p = projects.find(x => x.id === id);
    if (p) openProject(p);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const active = document.activeElement;
    if (!active || !active.classList.contains("project")) return;

    const id = active.dataset.id;
    const p = projects.find(x => x.id === id);
    if (p) openProject(p);
  });

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    const dialogRect = modal.getBoundingClientRect();
    const clickedOutside =
      e.clientX < dialogRect.left || e.clientX > dialogRect.right ||
      e.clientY < dialogRect.top  || e.clientY > dialogRect.bottom;
    if (clickedOutside) closeModal();
  });
}

function setupCopyEmail() {
  const btn = $("#copyEmail");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const email = btn.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      const old = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = old), 900);
    } catch {
      // fallback: open mail client
      window.location.href = `mailto:${email}`;
    }
  });
}

function setupActiveNav() {
  const links = $$("[data-link]");
  const sections = ["home", "about", "projects"].map(id => document.getElementById(id)).filter(Boolean);

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0.01 });

  sections.forEach(s => obs.observe(s));
}

function setupMobileNav() {
  const toggle = $(".nav-toggle");
  const menu = $("[data-nav]");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // close menu after click
  $$("a", menu).forEach(a => a.addEventListener("click", () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));
}

// ====== Init ======
setYear();
renderProjects(projects);
setupFilters();
setupModal();
setupCopyEmail();
setupActiveNav();
setupMobileNav();
