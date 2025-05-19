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

function renderCartItemsListMobile(cart) {
 
  const cartItemsList = document.getElementById("cart-items-list");
  cartItemsList.innerHTML = "";
  cart.forEach((product) => {
    const productWeightTotal = (product.weight * product.quantity).toFixed(2);
    const productTotal = (product.sell_price * product.quantity).toFixed(2);
    const productHTML = `
      <div class="row product-layout-list mb-3" style="border:1px solid #eee; border-radius:8px; padding:10px; align-items:center;">
        <div class="col-4">
          <div class="product-image">
            <a href="#">
              <img src="${product.image}" alt="${product.name}" style="max-width:100%; border-radius:6px;">
            </a>
            ${product.is_new ? '<span class="sticker">New</span>' : ""}
          </div>
        </div>
        <div class="col-8">
          <div class="product_desc">
            <div class="product_desc_info">
              <h4><a class="product_name" href="#">${product.name}</a></h4>
              <div class="price-box mb-1">
                <span class="new-price">$${parseFloat(product.sell_price).toFixed(2)}</span>
              </div>
              <div class="mb-1">
                <label style="margin-top: 8px; margin-bottom: 12px;">Cantidad</label>  
                <div class="cart-plus-minus" style="display:inline-flex;align-items:center;gap:5px;">
                  <button class="dec qtybutton btn btn-light btn-sm" onclick="changeQuantity(${product.id}, -1)"><i class="fa fa-angle-down"></i></button>
                  <input class="cart-plus-minus-box" value="${product.quantity}" type="number" min="1" readonly style="width:40px;text-align:center;">
                  <button class="inc qtybutton btn btn-light btn-sm" onclick="changeQuantity(${product.id}, 1)"><i class="fa fa-angle-up"></i></button>
                </div>
              </div>
              
              <div class="mb-1"><strong>Peso total:</strong> ${productWeightTotal} lbs</div>
              <div class="mb-1"><strong>Total:</strong> $${productTotal}</div>
              <div class="mb-1"><button class="btn btn-danger btn-sm" onclick="removeFromCart(${product.id})"><i class="fa fa-trash"></i> Eliminar</button></div>
            </div>
          </div>
        </div>
      </div>
    `;
    cartItemsList.insertAdjacentHTML("beforeend", productHTML);
  });
  
}

// Modifica loadCartItems para renderizar la lista en móvil
function loadCartItems() {
   document.getElementById("loading-overlay").removeAttribute("hidden");
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

  // Renderizar lista móvil
  renderCartItemsListMobile(cart);

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
  document.getElementById("loading-overlay").setAttribute("hidden", true);
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
  Toast.fire({
        icon: 'error',
        title: 'Producto eliminado del carrito'
      })
}

function loadShippingCategories() {
   document.getElementById("loading-overlay").removeAttribute("hidden");
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
          } else {
            if (category.id == 4) {
              selectElement.options[4].disabled = true;
            }
          }
        }
      });
      loadCartItems();
      document.getElementById("loading-overlay").setAttribute("hidden", true);
    })
    .catch((error) => {
      console.error("Error al cargar las categorías de envío:", error);
      document.getElementById("loading-overlay").setAttribute("hidden", true);
    });
}

function displayShippingDetails(categoryId) {
   document.getElementById("loading-overlay").removeAttribute("hidden");
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
      document.getElementById("loading-overlay").setAttribute("hidden", true);
    })
    .catch((error) => {
      document.getElementById("loading-overlay").setAttribute("hidden", true);
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
