let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add to cart buttons
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", function(e) {
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

// Update cart count badges
function updateCartCount() {
    document.querySelectorAll(".cart-badge").forEach(badge => {
        badge.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    });
}

// Render cart items in modal
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
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <div>$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-qty">
                <button onclick="decreaseQty('${item.id}')">−</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQty('${item.id}')">+</button>
            </div>
            <button class="remove-btn" onclick="removeItem('${item.id}')">
                <i class="fa fa-trash"></i>
            </button>
        </div>`;
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalEl.innerText = total.toFixed(2);
    document.getElementById("checkout-total").innerText = total.toFixed(2);
}

// Quantity controls
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

// Remove item
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
}

// Save cart and refresh UI
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCartModal();
}

// Cart modal open/close
const cartModal = document.getElementById("cart-modal");
document.querySelectorAll(".cart-btn").forEach(btn => {
    btn.addEventListener("click", e => {
        e.preventDefault();
        renderCartModal();
        cartModal.style.display = "flex";
    });
});

document.querySelectorAll("#cart-modal .close-cart").forEach(btn => {
    btn.addEventListener("click", () => {
        cartModal.style.display = "none";
    });
});

cartModal.addEventListener("click", e => {
    if (e.target === cartModal) cartModal.style.display = "none";
});

// Checkout modal
function openCheckout() {
    cartModal.style.display = "none";
    document.getElementById("checkout-modal").style.display = "flex";
}

function closeCheckout() {
    document.getElementById("checkout-modal").style.display = "none";
}

// Initial update
updateCartCount();
renderCartModal();
