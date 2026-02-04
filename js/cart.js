let cart = JSON.parse(localStorage.getItem("cart")) || [];

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


function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Added to cart 🛒");
}


function updateCartCount() {
  const counter = document.getElementById("cart-count");
  if (!counter) return;

  counter.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}


updateCartCount();


function renderCart() {
    const container = document.getElementById("cart-items");
    if (!container) return;

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        document.getElementById("cart-total").innerText = "0.00";
        return;
    }

    cart.forEach(item => {
        container.innerHTML += `
        <div class="row align-items-center border-bottom py-3">
            <div class="col-md-2">
                <img src="${item.image}" class="img-fluid" />
            </div>
            <div class="col-md-3">
                <h6>${item.name}</h6>
                <small>$${item.price}</small>
            </div>
            <div class="col-md-3">
                <button class="btn btn-sm btn-outline-dark" onclick="decreaseQty('${item.id}')">−</button>
                <span class="mx-2">${item.quantity}</span>
                <button class="btn btn-sm btn-outline-dark" onclick="increaseQty('${item.id}')">+</button>
            </div>
            <div class="col-md-2">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
            <div class="col-md-2">
                <button class="btn btn-sm btn-danger" onclick="removeItem('${item.id}')">Remove</button>
            </div>
        </div>`;
    });

    updateTotal();
}

function increaseQty(id) {
    const item = cart.find(p => p.id === id);
    item.quantity++;
    saveCart();
}

function decreaseQty(id) {
    const item = cart.find(p => p.id === id);
    if (item.quantity > 1) {
        item.quantity--;
    }
    saveCart();
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
}

function updateTotal() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById("cart-total").innerText = total.toFixed(2);
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

renderCart();

const cartModal = document.getElementById("cart-modal");
const cartIcon = document.querySelector(".nav-cart");
const closeCartBtn = document.querySelector(".close-cart");

cartIcon.addEventListener("click", (e) => {
    e.preventDefault();
    renderCartModal();
    cartModal.style.display = "flex";
});

closeCartBtn.addEventListener("click", () => {
    cartModal.style.display = "none";
});

cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = "none";
    }
});

function renderCartModal() {
    const container = document.getElementById("cart-modal-items");
    const totalEl = document.getElementById("cart-modal-total");

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
        <div>$${item.price}</div>
    </div>

    <div class="cart-qty">
        <button onclick="decreaseQty('${item.id}')">−</button>
        <span>${item.quantity}</span>
        <button onclick="increaseQty('${item.id}')">+</button>
    </div>

    <button class="remove-btn" onclick="removeItem('${item.id}')">
        <i class="fa fa-trash"></i>
    </button>
</div>
`;

    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalEl.innerText = total.toFixed(2);
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCartModal();
}

