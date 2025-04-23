document.addEventListener("DOMContentLoaded", () => {
  loadCartItems();

  document.getElementById("proceed-to-checkout").addEventListener("click", (event) => {
    event.preventDefault();
    sendWhatsAppMessage();
  });
});

function loadCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = "";

  let subtotal = 0;

  cart.forEach((product) => {
    const productTotal = product.sell_price * product.quantity;
    subtotal += productTotal;

    const productHTML = `
      <tr>
        <td class="li-product-remove"><a href="#" onclick="removeFromCart(${product.id})"><i class="fa fa-times"></i></a></td>
        <td class="li-product-thumbnail"><a href="#"><img src="${product.image}" alt="${product.name}" style="max-width: 100px;"></a></td>
        <td class="li-product-name"><a href="#">${product.name}</a></td>
        <td class="li-product-price"><span class="amount">$${product.sell_price.toFixed(2)}</span></td>
        <td class="quantity">
          <label>Cantidad</label>
          <div class="cart-plus-minus">
            <input class="cart-plus-minus-box" value="${product.quantity}" type="number" min="1" readonly>
            <div class="dec qtybutton" onclick="changeQuantity(${product.id}, -1)"><i class="fa fa-angle-down"></i></div>
            <div class="inc qtybutton" onclick="changeQuantity(${product.id}, 1)"><i class="fa fa-angle-up"></i></div>
          </div>
        </td>
        <td class="product-subtotal"><span class="amount">$${productTotal.toFixed(2)}</span></td>
      </tr>`;

    cartItemsContainer.insertAdjacentHTML("beforeend", productHTML);
  });

  document.getElementById("cart-subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("cart-total").textContent = `$${subtotal.toFixed(2)}`;
}

function changeQuantity(productId, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const productIndex = cart.findIndex((product) => product.id === productId);
  if (productIndex !== -1) {
    cart[productIndex].quantity = Math.max(1, cart[productIndex].quantity + change);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartItems();
  }
}

function sendWhatsAppMessage() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const STORE_PHONE = "+13058770178";

  let message = "Hola, estoy interesado en los siguientes productos:\n";

  cart.forEach((product) => {
    message += `- ${product.name}: $${product.sell_price.toFixed(2)} x ${product.quantity}\n`;
  });

  const subtotal = cart.reduce((acc, product) => acc + product.sell_price * product.quantity, 0);
  message += `\nTotal de la compra: $${subtotal.toFixed(2)}`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${STORE_PHONE}?text=${encodedMessage}`;

  window.location.href = whatsappUrl;
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((product) => product.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems();
}
