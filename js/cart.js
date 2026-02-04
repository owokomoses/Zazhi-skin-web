let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add to cart buttons
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", function (e) {
    e.preventDefault();

    const product = {
      id: this.dataset.id,
      name: this.dataset.name,
      price: parseFloat(this.dataset.price),
      image: this.dataset.image,
      quantity: 1
    };

    addToCart(product);
  });
});

// Add or update item in cart
function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push(product);
    }
    saveCart();
    alert("Added to cart 🛒");
}

// Save cart and update UI
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCartModal();
}

// Update all cart badges
function updateCartCount() {
    document.querySelectorAll(".cart-badge").forEach(badge => {
        badge.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    });
}

// Render cart modal items
function renderCartModal() {
    const container = document.getElementById("cart-modal-items");
    const totalEl = document.getElementById("cart-modal-total");

    if (!container || !totalEl) return;

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        totalEl.innerText = "0.00";
        return;
    }

    cart.forEach(item => {
        container.innerHTML += `
<div class="cart-item d-flex align-items-center mb-3">
    <img src="${item.image}" alt="${item.name}" class="me-3" style="width:60px; height:60px; object-fit:cover;">
    <div class="flex-grow-1">
        <strong>${item.name}</strong>
        <div>$${item.price}</div>
    </div>
    <div class="cart-qty d-flex align-items-center">
        <button class="btn btn-sm btn-outline-dark me-1" onclick="decreaseQty('${item.id}')">−</button>
        <span>${item.quantity}</span>
        <button class="btn btn-sm btn-outline-dark ms-1" onclick="increaseQty('${item.id}')">+</button>
    </div>
    <button class="btn btn-sm btn-danger ms-2" onclick="removeItem('${item.id}')">
        <i class="fa fa-trash"></i>
    </button>
</div>`;
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalEl.innerText = total.toFixed(2);
}

// Quantity functions
function increaseQty(id) {
    const item = cart.find(p => p.id === id);
    if (item) item.quantity++;
    saveCart();
}

function decreaseQty(id) {
    const item = cart.find(p => p.id === id);
    if (item && item.quantity > 1) item.quantity--;
    saveCart();
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
}

// Modal handling
const cartModal = document.getElementById("cart-modal");
const checkoutModal = document.getElementById("checkout-modal");

document.querySelectorAll(".cart-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        renderCartModal();
        cartModal.style.display = "flex";
    });
});

cartModal.querySelectorAll(".close-cart").forEach(btn => {
    btn.addEventListener("click", () => { cartModal.style.display = "none"; });
});

cartModal.addEventListener("click", e => {
    if (e.target === cartModal) cartModal.style.display = "none";
});

function openCheckout() {
    cartModal.style.display = "none";
    checkoutModal.style.display = "flex";

    const checkoutTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById("checkout-total").innerText = checkoutTotal.toFixed(2);
}

function closeCheckout() {
    checkoutModal.style.display = "none";
}

// Initial render
updateCartCount();
renderCartModal();
