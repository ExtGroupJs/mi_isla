// Variables globales
let currentPage = 1;
let productsPerPage = 12;
let totalProducts = 0; // Cambia esto si deseas mostrar más o menos productos por página
let totalPages = 0; // Variable global para almacenar la cantidad de páginas
let product__category = "";
let searchValue = "";
let orderingValue = "";
let currentViewMode = "grid";

// Función para cargar productos
function loadProducts(page) {
  currentPage = page;
  const url = "/business-gestion/products/"; // Asegúrate de que esta URL sea correcta
  const params = {
    page_size: productsPerPage === "all" ? Infinity : productsPerPage, // Ajustar según la selección
    page: page,
    search: searchValue, // Aquí puedes agregar la lógica para manejar la búsqueda si es necesario
    ordering: orderingValue, // Aquí puedes agregar la lógica para manejar el ordenamiento si es necesario
    category: product__category,
  };

  axios
    .get(url, { params })
    .then((res) => {
      const { count, results } = res.data; // Desestructuramos la respuesta
      totalProducts = count;
      renderProducts(results); // Renderiza los productos

      // Calcular el número total de páginas
      totalPages = Math.ceil(
        totalProducts / (productsPerPage === "all" ? 1 : productsPerPage)
      );

      // Actualizar el conteo de productos mostrados
      const start = (page - 1) * productsPerPage + 1;
      const end = Math.min(start + results.length - 1, count);
      updatePagination(); // Actualiza la paginación

      document.getElementById(
        "product-count"
      ).innerText = `mostrando ${start}-${end} de ${count} productos`;
    })
    .catch((error) => {
      alert("Error al cargar los productos: " + error.message);
    });
}

function renderProducts(products) {
  const productArea = document.querySelector(".shop-products-wrapper .row");
  productArea.innerHTML = ""; // Limpiar productos existentes

  products.forEach((product) => {
    let productHTML;
    if (currentViewMode === "grid") {
      productHTML = renderGridProduct(product);
    } else {
      productHTML = renderListProduct(product);
    }
    productArea.insertAdjacentHTML("beforeend", productHTML);
  });
}

function renderGridProduct(product) {
  return `
    <div class="col-lg-4 col-md-4 col-sm-6 mt-40">
      <div class="single-product-wrap">
        <div class="product-image">
          <a>
            <img src="${
              product.image ||
              "/static_output/assets/dist/img/producto-sin-imagen.jpg"
            }" 
                 alt="${product.name}"
                 onerror="this.src='/static_output/assets/dist/img/producto-sin-imagen.jpg'">
          </a>
          ${product.is_new ? '<span class="sticker">New</span>' : ""}
        </div>
        <div class="product_desc">
          <div class="product_desc_info">
            <div class="product-review">
              <h5 class="manufacturer">
               <span class="new-price">$${product.sell_price}</span>
              </h5>
              <div class="rating-box">
                  <ul class="rating">
                     <li><i class="fa fa-star-o"></i></li>
                     <li><i class="fa fa-star-o"></i></li>
                     <li><i class="fa fa-star-o"></i></li>
                     <li class="no-star"><i class="fa fa-star-o"></i></li>
                     <li class="no-star"><i class="fa fa-star-o"></i></li>
                 </ul>
              </div>
            </div>
            <h4><a class="product_name" href="#">${product.name}</a></h4>
            <div class="price-box">
              <span class="new-price">${product.weight} lbs</span>
            </div>
          </div>
          <div class="add-actions">
            <ul class="add-actions-link" style="display: flex; gap: 5px; justify-content: center;">
              <li class="add-cart active"><a href="#" onclick="addToCart({id: ${
                product.id
              }, name: '${product.name}', image: '${
    product.image
  }', sell_price: ${product.sell_price}})">Add to cart</a></li>
              <li class="li-btn"><a href="#" title="ver detalles" class="quick-view-btn" data-toggle="modal" data-target="#exampleModalCenter" onclick="showProductDetails(${
                product.id
              })"><i class="fa fa-eye"></i></a></li>
              <li class="li-btn"><a href="#" title="contactar por WhatsApp" class="quick-view-btn" onclick="contactWhatsApp('${
                product.name
              }', ${
    product.sell_price
  })"><i class="fa fa-whatsapp"></i></a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>`;
}

function renderListProduct(product) {
  return `
    <div class="col-12 mt-40">
      <div class="single-product-wrap d-flex">
        <div class="product-image">
          <a>
            <img src="${
              product.image ||
              "/static_output/assets/dist/img/producto-sin-imagen.jpg"
            }" 
                 alt="${product.name}" style="max-width:281px"
                 onerror="this.src='/static_output/assets/dist/img/producto-sin-imagen.jpg'">
          </a>
          ${product.is_new ? '<span class="sticker">New</span>' : ""}
        </div>
        <div class="product_desc flex-grow-1 ml-4">
          <div class="product_desc_info">
             <div class="product-review">
              <h5 class="manufacturer">
               <span class="new-price">$${product.sell_price}</span>
              </h5>
              <div class="rating-box">
                  <ul class="rating">
                     <li><i class="fa fa-star-o"></i></li>
                     <li><i class="fa fa-star-o"></i></li>
                     <li><i class="fa fa-star-o"></i></li>
                     <li class="no-star"><i class="fa fa-star-o"></i></li>
                     <li class="no-star"><i class="fa fa-star-o"></i></li>
                 </ul>
              </div>
            </div>
            <h4><a class="product_name" href="#">${product.name}</a></h4>
            <div class="price-box">
               <span class="new-price">${product.weight} lbs</span>
            </div>
             <div class="product-description">
            <p>${product.description || "Sin descripción"}</p>
          </div>
          <div >
            <ul class="add-actions-link" style="display: flex; gap: 5px; justify-content: center;">
              <li class="add-cart active"><a href="#" onclick="addToCart({id: ${
                product.id
              }, name: '${product.name}', image: '${
    product.image
  }', sell_price: ${product.sell_price}})">Add to cart</a></li>
              <li class="li-btn"><a href="#" title="ver detalles" class="quick-view-btn" data-toggle="modal" data-target="#exampleModalCenter" onclick="showProductDetails(${
                product.id
              })"><i class="fa fa-eye"></i></a></li>
              <li class="li-btn"><a href="#" title="contactar por WhatsApp" class="quick-view-btn" onclick="contactWhatsApp('${
                product.name
              }', ${
    product.sell_price
  })"><i class="fa fa-whatsapp"></i></a></li>
            </ul>
          </div>
          </div>       
         </div>
      </div>
    </div>`;
}

// Función para generar las estrellas basadas en las ventas
function generateStarsHTML(sales) {
  // Aseguramos un mínimo de 2 estrellas
  const minStars = 2;
  // Calculamos estrellas adicionales basadas en ventas (máximo 3 estrellas adicionales)
  const additionalStars = Math.min(Math.floor(sales / 5), 3);
  const totalStars = Math.max(minStars, additionalStars);

  let starsHTML = "";
  for (let i = 0; i < 5; i++) {
    if (i < totalStars) {
      starsHTML += '<li><i class="fa fa-star"></i></li>';
    } else {
      starsHTML += '<li><i class="fa fa-star-o"></i></li>';
    }
  }
  return starsHTML;
}

// Función para actualizar la paginación
function updatePagination() {
  const paginationArea = document.querySelector(".pagination-box");
  paginationArea.innerHTML = ""; // Limpiar paginación existente

  // Mostrar botón "Previous" si no estamos en la primera página
  if (currentPage > 1) {
    paginationArea.insertAdjacentHTML(
      "beforeend",
      `<li><a href="#" class="Previous" onclick="loadProducts(${
        currentPage - 1
      })"><i class="fa fa-chevron-left"></i> Anterior</a></li>`
    );
  }

  // Mostrar tres botones de página
  for (
    let i = Math.max(1, currentPage - 1);
    i <= Math.min(totalPages, Math.max(3, currentPage + 1));
    i++
  ) {
    const isActive = i === currentPage ? 'class="active"' : "";
    paginationArea.insertAdjacentHTML(
      "beforeend",
      `<li ${isActive}><a href="#" onclick="loadProducts(${i})">${i}</a></li>`
    );
  }

  // Mostrar botón "Siguiente" si hay más páginas
  if (currentPage < totalPages) {
    paginationArea.insertAdjacentHTML(
      "beforeend",
      `<li><a href="#" class="Next" onclick="loadProducts(${
        currentPage + 1
      })"> Siguiente <i class="fa fa-chevron-right"></i></a></li>`
    );
  }
}

// Cargar productos al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
  loadProducts(currentPage);
  loadCategory();
  updateMiniCart()
});

function updateProductsPerPage() {
  const selectElement = document.getElementById("products-per-page");
  const selectedValue = selectElement.value;

  // Ajustar la cantidad de productos por página
  productsPerPage =
    selectedValue === "all" ? Infinity : parseInt(selectedValue);

  // Reiniciar a la primera página
  currentPage = 1;

  // Cargar productos de la primera página con el nuevo valor
  loadProducts(currentPage);

  // Mantener el valor seleccionado en el select
  selectElement.value = selectedValue;
}

function populateCategorysList(categorys) {
  const categoryList = document.getElementById("category-list");
  categoryList.innerHTML = ""; // Limpiar opciones anteriores

  // Opción para mostrar todos los modelos
  const showAllItem = document.createElement("li");
  const showAllLink = document.createElement("a");
  showAllLink.href = "#"; // Prevenir el comportamiento por defecto
  showAllLink.textContent = "Todos";

  // Agregar evento para mostrar todos los productos
  showAllLink.addEventListener("click", (e) => {
    e.preventDefault(); // Prevenir el enlace por defecto
    selectCategoryInit("");
  });

  showAllItem.appendChild(showAllLink);
  categoryList.appendChild(showAllItem);

  categorys.forEach((category) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#"; // Prevenir el comportamiento por defecto
    link.textContent = category.name;

    // Agregar evento para filtrar productos por modelo
    link.addEventListener("click", (e) => {
      e.preventDefault(); // Prevenir el enlace por defecto
      selectCategoryInit(category.id);
    });

    listItem.appendChild(link);
    categoryList.appendChild(listItem);
  });
}

function searchProducts() {
  currentPage = 1;
  searchValue = document.getElementById("searchInput").value;
  loadProducts(currentPage);
}

function loadCategory() {
  axios
    .get("/business-gestion/category/")
    .then((res) => {
      const category = res.data.results;
      populateCategorysSelect(category);
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error al cargar las Categorías",
        text: error.message,
        showConfirmButton: false,
        timer: 1500,
      });
    });
}

function populateCategorysSelect(categorys) {
  const categorysSelect = document.getElementById("categorysSelect");
  const categorysSelectUL = document.querySelector(".hm-searchbox .list");
  categorysSelect.innerHTML =
    '<option value="">Seleccione una Categoría</option>'; // Limpiar opciones anteriores

  populateCategorysList(categorys);

  const option_todos = document.createElement("li");
  option_todos.setAttribute("class", "option");
  option_todos.textContent = "Todos"; // Asignar el nombre de la category como texto
  option_todos.class = "option"; // Asignar el nombre de la category como texto
  option_todos.addEventListener("click", () => {
    selectCategoryInit("");
  });
  categorysSelectUL.appendChild(option_todos);

  categorys.forEach((category) => {
    const option = document.createElement("li");
    option.setAttribute("data-value", category.id);
    option.setAttribute("class", "option");
    option.textContent = category.name; // Asignar el nombre de la category como texto
    option.class = "option"; // Asignar el nombre de la category como texto
    option.addEventListener("click", () => {
      selectCategoryInit(category.id);
    });
    categorysSelectUL.appendChild(option);
  });
}

function selectCategoryInit(categoryId) {
  product__category = categoryId;
  currentPage = 1;
  loadProducts(currentPage);
}

// Función para capturar el valor seleccionado
function captureOrderingValue() {
  // Obtener el elemento select
  const selectElement = document.getElementById("selectOrdering");
  orderingValue = selectElement.value;
  currentPage = 1;
  loadProducts(currentPage);
}

function toggleViewMode(event, element) {
  event.preventDefault();
  const viewMode = element.getAttribute("data-view");
  const icon = document.getElementById("view-mode-icon");

  // Cambiar el modo de vista
  if (viewMode === "grid") {
    element.setAttribute("data-view", "list");
    icon.classList.remove("fa-th");
    icon.classList.add("fa-list");
  } else {
    element.setAttribute("data-view", "grid");
    icon.classList.remove("fa-list");
    icon.classList.add("fa-th");
  }

  // Actualizar modo de vista y volver a renderizar
  currentViewMode = viewMode;
  loadProducts(currentPage);
}

// Función para mostrar los detalles del producto
async function showProductDetails(productId) {
  try {
    // Realizar la petición al endpoint
    const response = await axios.get(
      `/business-gestion/products/${productId}/`
    );
    const product = response.data;
    // Actualizar los elementos de la modal con los datos del producto
    const quantityInput = document.getElementById("quantityInput");
    quantityInput.value = 1;
    document.getElementById("modalProductImage").src = product.image;
    document.getElementById("modalProductName").textContent = product.name;
    document.getElementById("modalCategoryName").textContent =
      "Categoría: " + product.category_info.name;
    // document.getElementById("modalModelName").textContent =
    //   product.product.model.__str__;
    document.getElementById(
      "modalPrice"
    ).textContent = `$${product.sell_price}`;
    document.getElementById(
      "modalWeight"
    ).textContent = `${product.weight} Lbs`;
    document.getElementById("modalDescription").textContent =
      product.description || "Sin descripción";
    const addToCartDetail = document.getElementById("addToCartDetail");
    addToCartDetail.onclick = () => {
      addToCart({
        id: product.id,
        name: product.name,
        image: product.image,
        sell_price: product.sell_price,
        detail: true,
      });
    };
    // Agregar botón de WhatsApp en el modal
    const whatsappButton = document.createElement("button");
    whatsappButton.className = "btn btn-success mt-3";
    whatsappButton.innerHTML =
      '<i class="fa fa-whatsapp"></i> Contactar por WhatsApp';
    whatsappButton.onclick = () =>
      contactWhatsApp(product.name, product.sell_price);

    const modalFooter = document.querySelector(
      "#productDetailModal .product-social-sharing"
    );
    // Limpiar footer anterior
    modalFooter.innerHTML = "";
    modalFooter.appendChild(whatsappButton);

    // Mostrar la modal
    const productModal = new bootstrap.Modal(
      document.getElementById("productDetailModal")
    );
    productModal.show();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error al cargar los detalles del producto",
      text: error.message,
      showConfirmButton: false,
      timer: 1500,
    });
  }
}

// Función para contactar por WhatsApp
function contactWhatsApp(productName, price) {
  const STORE_PHONE = "+13058770178"; // Número fijo de la tienda

  // Formatear el mensaje
  const message = `Hola, estoy interesado en el producto: ${productName} - Precio: $${price}`;
  const encodedMessage = encodeURIComponent(message);

  // Detectar si es dispositivo móvil
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Crear el enlace de WhatsApp según el dispositivo
  const whatsappUrl = isMobile
    ? `whatsapp://send?phone=${STORE_PHONE}&text=${encodedMessage}` // Enlace para app móvil
    : `https://wa.me/${STORE_PHONE}?text=${encodedMessage}`; // Enlace para web

  // Abrir WhatsApp
  window.location.href = whatsappUrl;
}

// Función para agregar un producto al carrito
function addToCart(product) {
  const quantityInput = document.getElementById("quantityInput");
  // Obtener el carrito del localStorage o inicializarlo si no existe
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  // Verificar si el producto ya está en el carrito
  const existingProductIndex = cart.findIndex((item) => item.id === product.id);
 
  if (product.detail) {
    if (existingProductIndex !== -1) {
      // Si el producto ya está en el carrito, incrementar la cantidad
      cart[existingProductIndex].quantity += parseInt(quantityInput.value);
    } else {
      // Si el producto no está en el carrito, agregarlo con cantidad 1
      cart.push({ ...product, quantity: parseInt(quantityInput.value) });
    }
  } else {
    if (existingProductIndex !== -1) {
      // Si el producto ya está en el carrito, incrementar la cantidad
      cart[existingProductIndex].quantity += 1;
    } else {
      // Si el producto no está en el carrito, agregarlo con cantidad 1
      cart.push({ ...product, quantity: 1 });
    }
  }

  // Guardar el carrito actualizado en el localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Actualizar el minicart
  updateMiniCart();
}

// Función para actualizar el contenido del minicart
function updateMiniCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const minicartProductList = document.querySelector(".minicart-product-list");
  const minicartTotal = document.querySelector(".minicart-total span");
  const minicartTotalItems = document.querySelector(
    ".hm-minicart-trigger .cart-item-count"
  );
  const minicartTotalMoneyQuantity = document.querySelector(
    ".hm-minicart-trigger .item-text.money-quantity"
  );

  // Limpiar el contenido actual del minicart
  minicartProductList.innerHTML = "";

  // Calcular el total
  let total = 0;
  let totalQuantity = 0;

  // Agregar cada producto al minicart
  cart.forEach((product) => {
    const productHTML = `
      <li>
        <a href="#" class="minicart-product-image">
          <img src="${product.image}" alt="${product.name}">
        </a>
        <div class="minicart-product-details">
          <h6><a href="#">${product.name}</a></h6>
          <span>$${product.sell_price} x ${product.quantity}</span>
        </div>
        <button class="close" title="Remove" onclick="removeFromCart(${product.id})">
          <i class="fa fa-close"></i>
        </button>
      </li>`;
    minicartProductList.insertAdjacentHTML("beforeend", productHTML);
    total += product.sell_price * product.quantity;
    totalQuantity += product.quantity;
  });
    // Actualizar el total en el minicart
  minicartTotalItems.textContent = totalQuantity;
  minicartTotal.textContent = `$${total.toFixed(2)}`;
  // Actualizar solo el texto de la cantidad de dinero
  const moneyQuantityText = minicartTotalMoneyQuantity.firstChild;
  moneyQuantityText.textContent = `$${total.toFixed(2)}`;
}

// Función para eliminar un producto del carrito
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((product) => product.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateMiniCart();
}

// Modificar el evento del botón "Add to cart"
document.querySelectorAll(".add-cart a").forEach((button) => {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    const productElement = this.closest(".single-product-wrap");
    const product = {
      id: productElement.dataset.productId,
      name: productElement.querySelector(".product_name").textContent,
      image: productElement.querySelector(".product-image img").src,
      sell_price: parseFloat(
        productElement.querySelector(".new-price").textContent.replace("$", "")
      ),
    };
    addToCart(product);
  });
});
