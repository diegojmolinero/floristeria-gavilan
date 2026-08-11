const header = document.getElementById("site-header");
const mobileToggle = document.querySelector(".mobile-toggle");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.getElementById("lightbox-close");
const galleryItems = document.querySelectorAll(".gallery-item");
const contactForm = document.getElementById("contact-form");

const CONTACT_EMAIL = "hola@floristeriagavilan.com";

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

function closeMobileMenu() {
  header.classList.remove("open");
  mobileToggle.setAttribute("aria-expanded", "false");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.classList.remove("lightbox-open");
  lightboxImage.removeAttribute("src");
  lightboxImage.alt = "";
  lightboxCaption.textContent = "";
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

mobileToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("open");
  mobileToggle.setAttribute("aria-expanded", String(isOpen));
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    entry.target.classList.add("reveal-visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal-card, .reveal-text, .reveal-image").forEach((element) => {
  revealObserver.observe(element);
});

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    const imageUrl = item.dataset.full;
    const imageAlt = item.querySelector("img")?.alt || "Proyecto floral";
    const captionText = item.querySelector("span")?.textContent || "";

    lightboxImage.src = imageUrl;
    lightboxImage.alt = imageAlt;
    lightboxCaption.textContent = captionText;
    lightbox.classList.add("open");
    document.body.classList.add("lightbox-open");
    lightboxClose.focus();
  });
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
    closeLightbox();
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const type = String(formData.get("event-type") || "").trim();
  const date = String(formData.get("date") || "").trim();
  const budget = String(formData.get("budget") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !type) {
    alert("Por favor completa los campos obligatorios: nombre, email y tipo de evento.");
    return;
  }

  const subject = encodeURIComponent(`Solicitud de presupuesto - ${type}`);
  const body = encodeURIComponent([
    `Nombre: ${name}`,
    `Email: ${email}`,
    `Teléfono: ${phone || "No indicado"}`,
    `Tipo de evento: ${type}`,
    `Fecha: ${date || "No indicada"}`,
    `Presupuesto aproximado: ${budget || "No indicado"}`,
    "",
    "Mensaje:",
    message || "No indicado",
  ].join("\n"));

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
});
