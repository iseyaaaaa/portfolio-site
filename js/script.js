// --- Global: Swup & Lenis references ---
let lenis;

// If the browser tries to remember scroll, override it
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// --- Lenis Smooth Scroll Setup ---
function initLenis() {
  if (lenis) return; // only create once

  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({
      autoRaf: true,
      autoToggle: true,
      anchors: true,
      allowNestedScroll: true,
      naiveDimensions: true,
      stopInertiaOnNavigate: true,
    });
  }
}

// Always scroll new views to top
function resetScrollToTop() {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
}

// --- Card Hover Logic ---
function initCardHover() {
  const cards = document.querySelectorAll(".card");
  if (!cards.length) return;

  cards.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      cards.forEach((other) => {
        if (other !== item) {
          other.classList.add("dimmed");
        }
      });
    });

    item.addEventListener("mouseleave", () => {
      cards.forEach((other) => {
        other.classList.remove("dimmed");
      });
    });
  });
}

function initRevealAnimation() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  revealElements.forEach((el) => el.classList.remove("visible"));

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // animate once per view
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

// --- Dark Mode Toggle Logic ---
function initDarkMode() {
  const root = document.documentElement;
  const button = document.querySelector(".toggle-button");

  if (!button) return;


  const savedTheme = localStorage.getItem("theme");
  const isDark = savedTheme === "dark";

  root.classList.toggle("active", isDark);
  button.classList.toggle("active", isDark);


  const newButton = button.cloneNode(true);
  button.replaceWith(newButton);

  newButton.addEventListener("click", () => {
    const nowDark = !root.classList.contains("active");
    root.classList.toggle("active", nowDark);
    newButton.classList.toggle("active", nowDark);
    localStorage.setItem("theme", nowDark ? "dark" : "light");
  });
}


function initPage() {
  resetScrollToTop();
  initCardHover();
  initRevealAnimation();
  initDarkMode();
}


document.addEventListener("DOMContentLoaded", () => {
  initLenis();
  initPage();


  if (window.swup && window.swup.hooks) {
    window.swup.hooks.on("page:view", () => {
      initPage();
    });
  } else {

    window.addEventListener("swup:page:view", () => {
      initPage();
    });
  }
});
