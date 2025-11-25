// Controls for enlarging the hero logo inline and in a zoomable modal
document.addEventListener("DOMContentLoaded", function () {
  var zoomableImage = document.getElementById("zoomable-image");
  if (!zoomableImage) {
    return;
  }

  // Inline "make this bigger" controls
  var sizeIncreaseBtn = document.getElementById("increase-size-btn");
  var resetSizeBtn = document.getElementById("reset-size-btn");
  var sizeIndicator = document.getElementById("size-indicator");

  var baseWidth =
    parseInt(zoomableImage.getAttribute("data-base-width"), 10) ||
    zoomableImage.clientWidth ||
    600;
  var maxWidth =
    parseInt(zoomableImage.getAttribute("data-max-width"), 10) || 1200;
  var widthStep = parseInt(zoomableImage.getAttribute("data-step"), 10) || 120;
  var currentWidth = baseWidth;

  function updateSizeDisplay() {
    zoomableImage.style.maxWidth = currentWidth + "px";
    if (sizeIndicator) {
      sizeIndicator.textContent = currentWidth + "px wide";
    }
    if (resetSizeBtn) {
      resetSizeBtn.classList.toggle("hidden", currentWidth === baseWidth);
    }
    if (sizeIncreaseBtn) {
      sizeIncreaseBtn.disabled = currentWidth >= maxWidth;
    }
  }

  if (sizeIncreaseBtn) {
    sizeIncreaseBtn.addEventListener("click", function () {
      currentWidth = Math.min(maxWidth, currentWidth + widthStep);
      updateSizeDisplay();
    });
  }

  if (resetSizeBtn) {
    resetSizeBtn.addEventListener("click", function () {
      currentWidth = baseWidth;
      updateSizeDisplay();
      if (sizeIncreaseBtn) {
        sizeIncreaseBtn.disabled = false;
      }
    });
  }

  updateSizeDisplay();

  // Zoom modal controls
  var modal = document.getElementById("zoom-modal");
  var modalImage = document.getElementById("zoom-modal-img");
  var zoomInBtn = document.getElementById("zoom-in-btn");
  var zoomOutBtn = document.getElementById("zoom-out-btn");
  var resetZoomBtn = document.getElementById("zoom-reset-btn");

  if (!modal || !modalImage || !zoomInBtn || !zoomOutBtn || !resetZoomBtn) {
    return;
  }

  var scale = 1;
  var STEP = 0.2;
  var MIN_SCALE = 1;
  var MAX_SCALE = 3;

  function applyScale() {
    modalImage.style.transform = "scale(" + scale + ")";
  }

  function openModal() {
    scale = 1;
    applyScale();
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }

  zoomableImage.addEventListener("click", openModal);

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.style.display === "flex") {
      closeModal();
    }
  });

  zoomInBtn.addEventListener("click", function () {
    scale = Math.min(MAX_SCALE, scale + STEP);
    applyScale();
  });

  zoomOutBtn.addEventListener("click", function () {
    scale = Math.max(MIN_SCALE, scale - STEP);
    applyScale();
  });

  resetZoomBtn.addEventListener("click", function () {
    scale = 1;
    applyScale();
  });
});

//START OF HEADER
(function () {
  const html = document.documentElement;
  const storageKey = "fw-theme";
  const themeToggle = document.getElementById("themeToggle");
  const themeDropdown = document.getElementById("themeDropdown");
  const systemMedia = window.matchMedia("(prefers-color-scheme: dark)");

  function applyTheme(theme) {
    const useDark =
      theme === "dark" || (theme === "system" && systemMedia.matches);

    if (useDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }

  function setTheme(theme) {
    localStorage.setItem(storageKey, theme);
    applyTheme(theme);
  }

  const savedTheme = localStorage.getItem(storageKey) || "system";
  applyTheme(savedTheme);

  systemMedia.addEventListener("change", () => {
    const current = localStorage.getItem(storageKey) || "system";
    if (current === "system") {
      applyTheme("system");
    }
  });

  if (!themeToggle || !themeDropdown) return;

  themeToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    themeDropdown.classList.toggle("hidden");
  });

  themeDropdown.addEventListener("click", (e) => {
    const button = e.target.closest("button[data-theme]");
    if (!button) return;

    const theme = button.getAttribute("data-theme");
    setTheme(theme);
    themeDropdown.classList.add("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!themeDropdown.contains(e.target) && !themeToggle.contains(e.target)) {
      themeDropdown.classList.add("hidden");
    }
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      const isOpen = !mobileMenu.classList.contains("hidden");
      mobileMenu.classList.toggle("hidden");
      mobileMenuToggle.setAttribute("aria-expanded", String(!isOpen));
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }
});
//END OF HEADER
