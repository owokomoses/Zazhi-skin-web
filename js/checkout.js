const cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderSummary() {
    const summary = document.getElementById("checkout-summary");
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        summary.innerHTML += `
            <div class="d-flex justify-content-between mb-2">
                <span>${item.name} × ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });

    document.getElementById("checkout-total").innerText = total.toFixed(2);
}

renderSummary();

document.getElementById("checkout-form").addEventListener("submit", function(e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty");
        return;
    }

    alert("Order placed successfully 🎉");

    localStorage.removeItem("cart");
    window.location.href = "index.html";
});


