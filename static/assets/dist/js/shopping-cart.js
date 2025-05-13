document.addEventListener("DOMContentLoaded", () => {
  loadShippingCategories();
  document
    .getElementById("proceed-to-checkout")
    .addEventListener("click", (event) => {
      event.preventDefault();
      sendWhatsAppMessage();
    });


  document
    .getElementById("shipping-category")
    .addEventListener("change", (event) => {
      const selectedCategoryId = event.target.value;
      displayShippingDetails(selectedCategoryId);
    });
});

function loadCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = "";

  let subtotal = 0;
  let totalWeight = 0;
  let shippingCost = 0;

  const selectedShippingCategory =
    document.getElementById("shipping-category").value;
  const shippingDetails =
    JSON.parse(localStorage.getItem("shippingDetails")) || {};
  let categorylocal = JSON.parse(localStorage.getItem("category")) || {};
  console.log("✌️categorylocal --->", categorylocal);

  cart.forEach((product) => {
    const productTotal = product.sell_price * product.quantity;
    const productWeightTotal = product.weight * product.quantity;
    subtotal += productTotal;
    totalWeight += productWeightTotal;

    const productHTML = `
      <tr>
        <td class="li-product-remove"><a href="#" onclick="removeFromCart(${
          product.id
        })"><i class="fa fa-times"></i></a></td>
        <td class="li-product-thumbnail"><a href="#"><img src="${
          product.image
        }" alt="${product.name}" style="max-width: 100px;"></a></td>
        <td class="li-product-name"><a href="#">${product.name}</a></td>
        <td class="li-product-price"><span class="amount">$${product.sell_price.toFixed(
          2
        )}</span></td>
        <td class="quantity">
          <label>Cantidad</label>
          <div class="cart-plus-minus">
            <input class="cart-plus-minus-box" value="${
              product.quantity
            }" type="number" min="1" readonly>
            <div class="dec qtybutton" onclick="changeQuantity(${
              product.id
            }, -1)"><i class="fa fa-angle-down"></i></div>
            <div class="inc qtybutton" onclick="changeQuantity(${
              product.id
            }, 1)"><i class="fa fa-angle-up"></i></div>
          </div>
        </td>
        <td class="product-weight"><span class="amount">${productWeightTotal.toFixed(
          2
        )} lbs</span></td>
        <td class="product-subtotal"><span class="amount">$${productTotal.toFixed(
          2
        )}</span></td>
      </tr>`;

    cartItemsContainer.insertAdjacentHTML("beforeend", productHTML);
  });

  if (selectedShippingCategory == 1) {
    shippingCost = cart.reduce((acc, product) => {
      return (
        acc + product.weight * product.data_price_by_weight * product.quantity
      );
    }, 0);
  } else {
    categorylocal = JSON.parse(localStorage.getItem("category")) || {};
    shippingCost = totalWeight * categorylocal.price_by_weight_unit;
  }

  const total = subtotal + shippingCost;
  document.getElementById("cart-subtotal").textContent = `$${subtotal.toFixed(
    2
  )}`;
  document.getElementById("cart-total").textContent = `$${total.toFixed(2)}`;

  // Actualizar o añadir fila para el peso total
  const cartTotalTable = document.querySelector(".cart-page-total ul");
  let weightRow = document.querySelector(".cart-page-total ul .weight-row");
  if (!weightRow) {
    weightRow = document.createElement("li");
    weightRow.classList.add("weight-row");
    cartTotalTable.insertBefore(weightRow, cartTotalTable.firstChild);
  }
  weightRow.innerHTML = `Peso Total <span>${totalWeight.toFixed(2)} lbs</span>`;

  toggleCheckoutButton(); // Llamar aquí
}

function changeQuantity(productId, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const productIndex = cart.findIndex((product) => product.id === productId);
  if (productIndex !== -1) {
    cart[productIndex].quantity = Math.max(
      1,
      cart[productIndex].quantity + change
    );
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartItems();
  }
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((product) => product.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems();
}

function loadShippingCategories() {
  axios
    .get("/business-gestion/shipping-type/")
    .then((response) => {
      const categories = response.data.results;
      const selectElement = document.getElementById("shipping-category");

      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        selectElement.appendChild(option);

        const cartProductState = JSON.parse(
          localStorage.getItem("cartProductState")
        );
       

        if (cartProductState) {
          if (category.id == 4) {
            selectElement.value = category.id;
            selectElement.disabled = true;
            displayShippingDetails(category.id);
          }
        } else {
          if (category.id == 1) {
            selectElement.value = category.id;
            displayShippingDetails(category.id);
          }
        }
      });
      loadCartItems();
    })
    .catch((error) => {
      console.error("Error al cargar las categorías de envío:", error);
    });
}

function displayShippingDetails(categoryId) {
  if (!categoryId) {
    document.getElementById("shipping-details").innerHTML = "";
    return;
  }

  axios
    .get(`/business-gestion/shipping-type/${categoryId}/`)
    .then((response) => {
      const category = response.data;
      localStorage.setItem("category", JSON.stringify(category));
      categorylocal = JSON.parse(localStorage.getItem("category")) || {};
      let detailsHTML = `<div class="contact-page-side-content">
        <h3 class="contact-page-title">${category.name}</h3>
        <p class="contact-page-message mb-25">${category.description}</p>`;

      if (category.min_weight_allowed !== null) {
        detailsHTML += `<div class="single-contact-block">
          <h4><i class="fa fa-weight"></i> Peso mínimo permitido</h4>
          <p>${category.min_weight_allowed} lbs</p>
        </div>`;
      }

      if (category.price_by_weight_unit !== null) {
        detailsHTML += `<div class="single-contact-block">
          <h4><i class="fa fa-money"></i> Precio por unidad de peso</h4>
          <p>$${category.price_by_weight_unit}</p>
        </div>`;
      }

      if (category.time_to_delivery !== null) {
        detailsHTML += `<div class="single-contact-block last-child">
          <h4><i class="fa fa-clock-o"></i> Tiempo de entrega</h4>
          <p>${category.time_to_delivery}</p>
        </div>`;
      }

      detailsHTML += `</div>`;
      document.getElementById("shipping-details").innerHTML = detailsHTML;
      loadCartItems();
      toggleCheckoutButton(); // Llamar aquí
    })
    .catch((error) => {
      console.error(
        "Error al cargar los detalles de la categoría de envío:",
        error
      );
    });
}

function toggleCheckoutButton() {
  const weightRow = document.querySelector(".cart-page-total ul .weight-row");
  console.log("✌️weightRow --->", weightRow);
  const proceedButton = document.getElementById("proceed-to-checkout");
  const category = JSON.parse(localStorage.getItem("category")) || {};
  console.log(
    "✌️category.min_weight_allowed --->",
    category.min_weight_allowed + "<" + category.min_weight_allowed
  );

  if (weightRow && category.min_weight_allowed != null) {
    const totalWeight = parseFloat(
      weightRow.textContent.match(/\d+(\.\d+)?/)[0]
    );
    if (parseInt(totalWeight) < parseInt(category.min_weight_allowed)) {
      console.log("✌️totalWeight iff --->", totalWeight);
      proceedButton.classList.add("enlace-deshabilitado");
      proceedButton.textContent = `El peso total debe ser al menos ${category.min_weight_allowed} lbs para ordenar.`;
    } else {
      console.log("✌️totalWeight else --->", totalWeight);
      proceedButton.classList.remove("enlace-deshabilitado");
      proceedButton.textContent = "Crear Orden de Compra";
    }
  }
}
