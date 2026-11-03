const data = window.SITE_DATA;

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatAuthors(authors, self) {
  return authors
    .split(",")
    .map((name) => name.trim())
    .map((name) =>
      name.toLowerCase() === self.toLowerCase()
        ? `<strong>${esc(name)}</strong>`
        : esc(name)
    )
    .join(", ");
}

function renderProfile() {
  const p = data.profile;
  document.getElementById("profile-name").textContent = p.name;
  document.getElementById("profile-intro").textContent = p.intro;
  document.getElementById("profile-closing").textContent = p.closing;

  document.getElementById("interest-tags").innerHTML = p.interests
    .map((tag) => `<li class="tag">${esc(tag)}</li>`)
    .join("");

  document.getElementById("hero-actions").innerHTML = `
    <a class="btn btn-primary" href="mailto:${esc(p.email)}">Email</a>
    <a class="btn btn-ghost" href="${esc(p.scholar)}" target="_blank" rel="noreferrer">Google Scholar</a>
  `;

  document.getElementById("honor-list").innerHTML = p.honors
    .map((honor) => `<li>${esc(honor)}</li>`)
    .join("");
}

function renderNews() {
  document.getElementById("news-list").innerHTML = data.news
    .map(
      (item) => `
        <li class="news-item">
          <time class="news-date">${esc(item.date)}</time>
          <p class="news-text">${esc(item.text)}</p>
        </li>
      `
    )
    .join("");
}

function renderPublications() {
  document.getElementById("publication-list").innerHTML = data.publications
    .map(
      (pub) => `
        <article class="pub-card">
          <a class="pub-media" href="${esc(pub.doi)}" target="_blank" rel="noreferrer">
            <img src="${esc(pub.image)}" alt="${esc(pub.title)}" loading="lazy" />
            <span class="pub-venue">${esc(pub.venue)} ${esc(pub.date.slice(0, 4))}</span>
            ${pub.badge ? `<span class="pub-badge">${esc(pub.badge)}</span>` : ""}
          </a>
          <div class="pub-body">
            <h3 class="pub-title">${esc(pub.title)}</h3>
            <p class="pub-venue-full">${esc(pub.venueFull)}</p>
            <time class="pub-date" datetime="${esc(pub.date)}">${esc(pub.date)}</time>
            <p class="pub-authors">${formatAuthors(pub.authors, pub.self)}</p>
            <a class="pub-link" href="${esc(pub.doi)}" target="_blank" rel="noreferrer">
              Paper / DOI
            </a>
          </div>
        </article>
      `
    )
    .join("");
}

function renderTimeline() {
  document.getElementById("timeline").innerHTML = data.timeline
    .map(
      (item) => `
        <div class="timeline-item timeline-${esc(item.kind)}">
          <div class="timeline-node"></div>
          <div class="timeline-card">
            <img class="timeline-logo ${esc(item.logoClass || "")}" src="${esc(item.logo)}" alt="${esc(item.title)}" loading="lazy" />
            <div>
              <span class="timeline-period">${esc(item.period)}</span>
              <h3>${esc(item.title)}</h3>
              <p>${esc(item.detail)}</p>
            </div>
          </div>
        </div>
      `
    )
    .join("");
}

function renderLogos() {
  const university = data.acknowledgements.universities
    .map(
      (item) => `
        <figure class="logo-item ${esc(item.itemClass || "")}">
          <img src="${esc(item.logo)}" alt="${esc(item.name)}" loading="lazy" />
          <figcaption>${esc(item.name)}</figcaption>
        </figure>
      `
    )
    .join("");

  const industry = data.acknowledgements.industry
    .map(
      (item) => `
        <figure class="logo-item ${esc(item.itemClass || "")}">
          <img src="${esc(item.logo)}" alt="${esc(item.name)}" loading="lazy" />
          <figcaption>${esc(item.name)}</figcaption>
        </figure>
      `
    )
    .join("");

  document.getElementById("university-logos").innerHTML = university;
  document.getElementById("industry-logos").innerHTML = industry;
}

function renderContact() {
  const p = data.profile;
  document.getElementById("contact-grid").innerHTML = `
    <a class="contact-card" href="mailto:${esc(p.email)}">
      <span class="contact-icon">✉</span>
      <span>
        <strong>Email</strong>
        <small>${esc(p.email)}</small>
      </span>
    </a>
    <a class="contact-card" href="${esc(p.scholar)}" target="_blank" rel="noreferrer">
      <span class="contact-icon">G</span>
      <span>
        <strong>Google Scholar</strong>
        <small>Publications &amp; citations</small>
      </span>
    </a>
  `;
}

function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  const links = document.querySelectorAll('.site-nav a[href^="#"]');
  const sections = [...links]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        links.forEach((link) =>
          link.classList.toggle("is-active", link.getAttribute("href") === id)
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

renderProfile();
renderNews();
renderPublications();
renderTimeline();
renderLogos();
renderContact();
setupNavigation();
document.getElementById("year").textContent = new Date().getFullYear();

const orangeTrack = document.querySelector(".orangecat-track");
if (orangeTrack) {
  orangeTrack.innerHTML += orangeTrack.innerHTML;
}
