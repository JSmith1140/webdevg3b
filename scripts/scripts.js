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
  const THEME_KEY = "fw-theme";
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
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }

  const savedTheme = localStorage.getItem(THEME_KEY) || "system";
  applyTheme(savedTheme);

  systemMedia.addEventListener("change", () => {
    const current = localStorage.getItem(THEME_KEY) || "system";
    if (current === "system") {
      applyTheme("system");
    }
  });

  if (!themeToggle || !themeDropdown) return;

  themeToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    themeDropdown.classList.toggle("hidden");
  });

  const FONT_KEY = "fw-font-size";
  const MIN_FONT = 0.9;
  const MAX_FONT = 1.3;
  const STEP = 0.05;

  const fontSmaller = document.getElementById("fontSmaller");
  const fontLarger = document.getElementById("fontLarger");
  const fontReset = document.getElementById("fontReset");
  const fontSizeValue = document.getElementById("fontSizeValue");

  let savedFont = parseFloat(localStorage.getItem(FONT_KEY));

  let currentFont =
    !isNaN(savedFont) && savedFont >= MIN_FONT && savedFont <= MAX_FONT
      ? savedFont
      : 1;

  function applyFontSize() {
    html.style.fontSize = currentFont + "rem";
    localStorage.setItem(FONT_KEY, currentFont.toFixed(2));
    if (fontSizeValue) {
      fontSizeValue.textContent = Math.round(currentFont * 100) + "%";
    }
  }

  applyFontSize();

  if (fontSmaller && fontLarger && fontReset) {
    fontSmaller.addEventListener("click", (e) => {
      e.stopPropagation();
      currentFont = Math.max(MIN_FONT, currentFont - STEP);
      applyFontSize();
    });

    fontLarger.addEventListener("click", (e) => {
      e.stopPropagation();
      currentFont = Math.min(MAX_FONT, currentFont + STEP);
      applyFontSize();
    });

    fontReset.addEventListener("click", (e) => {
      e.stopPropagation();
      currentFont = 1;
      applyFontSize();
    });
  }

  themeDropdown.addEventListener("click", (e) => {
    const themeButton = e.target.closest("button[data-theme]");
    if (themeButton) {
      const theme = themeButton.getAttribute("data-theme");
      setTheme(theme);
      themeDropdown.classList.add("hidden");
      return;
    }
  });

  document.addEventListener("click", (e) => {
    if (!themeDropdown.contains(e.target) && !themeToggle.contains(e.target)) {
      themeDropdown.classList.add("hidden");
    }
  });
})();
//END OF HEADER


// =========================
// CHECKOUT PAGE LOGIC
// =========================

const TAX_RATE = 0.1; // 10% tax
const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
const summaryList = document.getElementById("orderSummary");

// Run ONLY if checkout elements exist
if (summaryList) {
  let subtotal = 0;

  savedCart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const li = document.createElement("li");
    li.className = "order-item flex items-center justify-between gap-3";

    li.innerHTML = `
      <img src="${item.img}" alt="${
      item.name
    }" class="w-16 h-16 object-cover rounded-md" />
      <div class="flex-1 text-lg font-medium">${item.name} × ${
      item.quantity
    }</div>
      <div class="font-semibold">$${itemTotal.toFixed(2)}</div>
    `;

    summaryList.appendChild(li);
  });

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  document.getElementById("orderSubtotal").textContent = `$${subtotal.toFixed(
    2
  )}`;
  document.getElementById("orderTax").textContent = `$${tax.toFixed(2)}`;
  document.getElementById("orderTotal").textContent = `$${total.toFixed(2)}`;
}

// Payment form (only exists on checkout page)
const form = document.getElementById("paymentForm");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    document.getElementById("paymentMessage").textContent =
      "This is a simulation only — no real payment is processed.";
  });
}

// =========================
// SHOP PAGE CART LOGIC
// =========================

let cart = [];

function toggleCart() {
  const drawer = document.getElementById("cartDrawer");
  const icon = document.getElementById("cartIconContainer");
  const isOpen = drawer.classList.contains("open");

  if (isOpen) {
    drawer.classList.remove("open");
    icon.style.display = "block";
  } else {
    drawer.classList.add("open");
    icon.style.display = "none";
  }
}

function addToCart(name, price, img) {
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ name, price, img, quantity: 1 });
  }
  updateCart();
}

function updateCart() {
  const list = document.getElementById("cartItems");
  const totalSpan = document.getElementById("cartTotal");
  const count = document.getElementById("cartCount");
  const checkoutBtn = document.getElementById("checkout-btn");

  // If cart elements don't exist (like on checkout page), stop here
  if (!list) return;

  list.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    list.innerHTML += `
      <li class="cart-item">
        <img class="cart-item-img" src="${item.img}" alt="${item.name}">
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name} — $${item.price.toFixed(
      2
    )}</span>
          <div class="quantity-controls">
            <button onclick="changeQuantity(${index}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity(${index}, 1)">+</button>
          </div>
        </div>
        <span class="cart-item-remove" onclick="removeItem(${index})">Remove</span>
      </li>
    `;
  });

  totalSpan.textContent = total.toFixed(2);
  count.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Enable/Disable checkout button
  if (cart.length === 0) {
    checkoutBtn.disabled = true;
    checkoutBtn.style.opacity = "0.5";
    checkoutBtn.style.cursor = "not-allowed";
  } else {
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = "1";
    checkoutBtn.style.cursor = "pointer";
  }
}

function changeQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  updateCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

function goToCheckout() {
  localStorage.setItem("cart", JSON.stringify(cart));
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartIconContainer").style.display = "block";
  window.location.href = "checkout.html";
}

// =========================
// PRODUCT INFO OVERLAY
// =========================

function openInfo(name, price, img) {
  document.getElementById("infoOverlay").classList.add("active");
  document.getElementById("infoImg").src = img;
  document.getElementById("infoName").textContent = name;
  document.getElementById("infoPrice").textContent = price;

  let description = "";
  switch (name) {
    case "Cherry - 3 Pack":
      description =
        "Experience the sweet, natural taste of ripe cherries in every sip. This 3-pack keeps you refreshed with 0 calories and a burst of fruity delight!";
      break;
    case "Lemon - 3 Pack":
      description =
        "Brighten your day with crisp, zesty lemon flavor! 0 calories, all refreshment.";
      break;
    case "Blue Raspberry - 3 Pack":
      description =
        "Dive into playful, tangy blue raspberry flavor — This 0 Calorie drink is bold, sweet, and refreshing!";
      break;
    case "Variety 3 Pack":
      description =
        "Can't Decide? Get a taste of Cherry, Lemon, and Blue Raspberry in this 0 Calorie Variety Pack!";
      break;
    default:
      description =
        "Delicious flavored water with 0 calories — stay refreshed all day!";
  }

  document.getElementById("infoDescription").textContent = description;

  const btn = document.getElementById("infoAddToCart");
  btn.onclick = () => addToCart(name, parseFloat(price.replace("$", "")), img);
}

function closeInfo() {
  document.getElementById("infoOverlay").classList.remove("active");
}


