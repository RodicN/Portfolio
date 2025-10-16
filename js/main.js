// ================================ CORE FUNCTIONALITY ================================

// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme") || "dark";

document.documentElement.setAttribute("data-theme", currentTheme);
if (currentTheme === "dark") {
  themeToggle.classList.add("dark");
}

themeToggle.addEventListener("click", () => {
  const theme = document.documentElement.getAttribute("data-theme");
  const newTheme = theme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  themeToggle.classList.toggle("dark");
});

// Navigation Smooth Scrolling
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    // Update active link
    document
      .querySelectorAll(".nav-link")
      .forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});

// Header Scroll Effect
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ================================ ANIMATIONS ================================

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");

      // Animate progress bars
      if (entry.target.querySelector(".progress-fill")) {
        const progressBars = entry.target.querySelectorAll(".progress-fill");
        progressBars.forEach((bar) => {
          const width = bar.getAttribute("data-width");
          setTimeout(() => {
            bar.style.width = width;
          }, 500);
        });
      }
    }
  });
}, observerOptions);

document.querySelectorAll(".animate-in").forEach((el) => {
  observer.observe(el);
});

// ================================ 3D PROJECTS CAROUSEL ================================

// 3D Perspective Carousel with Infinite Right-Only Loop
class Projects3DCarousel {
  constructor() {
    this.container = document.getElementById("carousel-3d-container");
    this.slides = Array.from(document.querySelectorAll(".project-3d-slide"));
    this.nextButton = document.querySelector(".carousel-3d-btn-next");
    this.prevButton = document.querySelector(".carousel-3d-btn-prev");
    this.progressBar = document.getElementById("progress-bar");

    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.isAutoPlaying = true;
    this.autoPlayInterval = null;
    this.progressInterval = null;
    this.autoPlayDuration = 3000; // 3 seconds

    this.init();
  }

  init() {
    // Set up event listeners
    this.nextButton.addEventListener("click", () => this.nextSlide());
    this.prevButton.addEventListener("click", () => this.prevSlide());

    // Pause autoplay on hover
    const carouselElement = document.querySelector(".projects-carousel-3d");
    carouselElement.addEventListener("mouseenter", () => this.pauseAutoPlay());
    carouselElement.addEventListener("mouseleave", () => this.resumeAutoPlay());

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.prevSlide();
      if (e.key === "ArrowRight") this.nextSlide();
    });

    // Touch/swipe support
    this.addSwipeSupport();

    // Initialize carousel
    this.updateSlidePositions();
    this.startAutoPlay();
  }

  nextSlide() {
    // Always move to next (right direction), infinite loop
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.updateSlidePositions();
    this.resetAutoPlay();
  }

  prevSlide() {
    // Move to previous (left direction), infinite loop
    this.currentIndex =
      (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlidePositions();
    this.resetAutoPlay();
  }

  updateSlidePositions() {
    this.slides.forEach((slide, index) => {
      // Calculate relative position
      let position = index - this.currentIndex;

      // Handle wrap-around for infinite loop
      if (position > this.totalSlides / 2) {
        position -= this.totalSlides;
      } else if (position < -this.totalSlides / 2) {
        position += this.totalSlides;
      }

      // Set position attributes
      if (position === 0) {
        slide.setAttribute("data-position", "center");
      } else if (position === -1) {
        slide.setAttribute("data-position", "left");
      } else if (position === 1) {
        slide.setAttribute("data-position", "right");
      } else {
        slide.setAttribute("data-position", "hidden");
      }
    });
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      if (this.isAutoPlaying) {
        this.nextSlide(); // Only move right automatically
      }
    }, this.autoPlayDuration);

    this.startProgress();
  }

  startProgress() {
    let progress = 0;
    this.progressBar.style.width = "0%";

    this.progressInterval = setInterval(() => {
      if (this.isAutoPlaying) {
        progress += 100 / (this.autoPlayDuration / 50); // Update every 50ms
        this.progressBar.style.width = `${Math.min(progress, 100)}%`;

        if (progress >= 100) {
          progress = 0;
        }
      }
    }, 50);
  }

  pauseAutoPlay() {
    this.isAutoPlaying = false;
  }

  resumeAutoPlay() {
    this.isAutoPlaying = true;
  }

  resetAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    this.startAutoPlay();
  }

  addSwipeSupport() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    const viewport = document.querySelector(".carousel-3d-viewport");

    viewport.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      },
      { passive: true }
    );

    viewport.addEventListener(
      "touchend",
      (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;

        const deltaX = endX - startX;
        const deltaY = endY - startY;

        // Only register horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
          if (deltaX > 0) {
            this.prevSlide();
          } else {
            this.nextSlide();
          }
        }
      },
      { passive: true }
    );
  }
}

// ================================ EXPERIENCE FILTER SYSTEM ================================

class ExperienceFilter {
  constructor() {
    this.currentFilter = "all";
    this.sortOrder = "descending"; // descending = plus récent en premier
    this.initializeElements();
    this.bindEvents();
  }

  initializeElements() {
    this.timeline = document.getElementById("timeline");
    this.items = Array.from(document.querySelectorAll(".timeline-item"));
    this.filterBtns = document.querySelectorAll(".filter-btn");
    this.sortBtn = document.getElementById("sort-btn");
    this.sortIcon = document.getElementById("sort-icon");
  }

  bindEvents() {
    // Filtres
    this.filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => this.handleFilter(btn));

      // Support clavier
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.handleFilter(btn);
        }
      });
    });

    // Bouton de tri
    this.sortBtn.addEventListener("click", () => this.handleSort());
    this.sortBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.handleSort();
      }
    });
  }

  handleFilter(clickedBtn) {
    // Mettre à jour l'état actif
    this.filterBtns.forEach((btn) => btn.classList.remove("active"));
    clickedBtn.classList.add("active");

    const newFilter = clickedBtn.dataset.filter;
    if (newFilter !== this.currentFilter) {
      this.currentFilter = newFilter;
      this.applyFilter();
    }
  }

  handleSort() {
    // Basculer l'ordre de tri
    this.sortOrder =
      this.sortOrder === "descending" ? "ascending" : "descending";

    // Mettre à jour l'apparence du bouton
    if (this.sortOrder === "ascending") {
      this.sortBtn.classList.add("ascending");
      this.sortBtn.setAttribute("title", "Trier du plus récent au plus ancien");
    } else {
      this.sortBtn.classList.remove("ascending");
      this.sortBtn.setAttribute("title", "Trier du plus ancien au plus récent");
    }

    this.applyFilter();
  }

  applyFilter() {
    let visibleItems = [];

    // Filtrer les éléments
    this.items.forEach((item) => {
      const type = item.dataset.type;
      let shouldShow = false;

      switch (this.currentFilter) {
        case "all":
          shouldShow = true;
          break;
        case "formation":
          shouldShow = type === "formation";
          break;
        case "experience":
          shouldShow = type === "experience";
          break;
      }

      if (shouldShow) {
        visibleItems.push(item);
      }
    });

    // Trier les éléments visibles par date
    visibleItems.sort((a, b) => {
      const dateA = parseInt(a.dataset.date);
      const dateB = parseInt(b.dataset.date);

      if (this.sortOrder === "descending") {
        return dateB - dateA; // Plus récent en premier
      } else {
        return dateA - dateB; // Plus ancien en premier
      }
    });

    // Masquer tous les éléments d'abord
    this.items.forEach((item) => {
      item.classList.add("hidden");
      item.classList.remove("filtering-in");
    });

    // Réorganiser et afficher les éléments visibles
    visibleItems.forEach((item, index) => {
      // Réinsérer dans l'ordre trié
      this.timeline.appendChild(item);

      // Afficher avec animation
      setTimeout(() => {
        item.classList.remove("hidden");
        item.classList.add("filtering-in");
      }, index * 100); // Délai progressif pour un effet cascade
    });

    // Nettoyer les classes d'animation après un délai
    setTimeout(() => {
      this.items.forEach((item) => {
        item.classList.remove("filtering-in");
      });
    }, visibleItems.length * 100 + 500);
  }
}

// ================================ CONTACT FORM ================================ */
document.getElementById("contact-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const btn = document.getElementById("submit-btn");
  const message = document.getElementById("success-message");
  const form = this;

  // Validation simple
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const messageText = document.getElementById("message").value.trim();

  if (!name || !email || !messageText) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  if (messageText.length < 10) {
    alert("Votre message doit contenir au moins 10 caractères.");
    return;
  }

  // État de chargement
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Envoi...</span>';

  try {
    // Envoi réel à Formspree
    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      // Succès : afficher le message et réinitialiser
      message.classList.add("show");
      form.reset();
      
      setTimeout(() => {
        message.classList.remove("show");
      }, 5000);
    } else {
      // Erreur serveur
      const data = await response.json();
      alert(data.error || "Une erreur est survenue. Veuillez réessayer.");
    }
  } catch (error) {
    // Erreur réseau
    alert("Impossible d'envoyer le message. Vérifiez votre connexion.");
    console.error("Erreur:", error);
  } finally {
    // Réactiver le bouton
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Envoyer</span>';
  }
});

// ================================ INITIALIZATION ================================

document.addEventListener("DOMContentLoaded", () => {
  // Initialiser le carrousel 3D des projets
  new Projects3DCarousel();

  // Initialiser le système de filtrage des expériences
  new ExperienceFilter();

  // Animation des éléments flottants
  document.querySelectorAll(".floating-element").forEach((element, index) => {
    element.style.animationDelay = `${index * 2}s`;
  });

  // Mise à jour de l'année dans le footer
  const footerText = document.querySelector("footer p");
  if (footerText) {
    footerText.innerHTML = footerText.innerHTML.replace(
      "2024",
      new Date().getFullYear()
    );
  }
});

// ================================ PERFORMANCE OPTIMIZATION ================================

// Optimisation du scroll
let ticking = false;

function updateScrollElements() {
  ticking = false;
}

function requestTick() {
  if (!ticking) {
    requestAnimationFrame(updateScrollElements);
    ticking = true;
  }
}

window.addEventListener("scroll", requestTick, { passive: true });

// Gestion de la navigation au clavier
document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    document.body.classList.add("keyboard-navigation");
  }
});

document.addEventListener("mousedown", () => {
  document.body.classList.remove("keyboard-navigation");
});

// Handle window resize
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Force re-render on resize
    const carousel = document.querySelector(".projects-carousel-3d");
    if (carousel) {
      carousel.style.display = "none";
      carousel.offsetHeight; // Trigger reflow
      carousel.style.display = "";
    }
  }, 250);
});


