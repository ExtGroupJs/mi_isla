// Variables globales
let currentPage = 1;
let productsPerPage = 12;
let totalProducts = 0; // Cambia esto si deseas mostrar más o menos productos por página
let totalPages = 0; // Variable global para almacenar la cantidad de páginas
let product__model = "";
let searchValue = "";
let shopValue = "";
let orderingValue = "";
let product__model__brand = "";
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
    product__model: product__model,
    product__model__brand: product__model__brand,
    shop: shopValue,
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
    console.log("%c⧭", "color: #ffa640", product);
    if (currentViewMode === "grid") {
      const productHTML = `
        <div class="col-lg-4 col-md-4 col-sm-6 mt-40">
          <div class="single-product-wrap">
            <div class="product-image">
              <a>
                <img src="${
                  product.image ||
                  "/static_output/assets/dist/img/producto-sin-imagen.jpg"
                }" 
                     alt="${product.name} "
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
                <h4><a class="product_name" href="#">${product.name}--> ${product.category}</a></h4>
                <div class="price-box">
                  <span class="new-price">${product.weight} lbs</span>
                </div>
              </div>
              <div class="add-actions">
                <ul class="add-actions-link" style="display: flex; gap: 5px; justify-content: center;">
                  <li class="li-btn"><a href="#" title="ver detalles" class="quick-view-btn" data-toggle="modal" data-target="#exampleModalCenter" onclick="viewProductDetails(${
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
      productArea.insertAdjacentHTML("beforeend", productHTML);
    } else {
      const productHTML = `
        <div class="col-12 mt-40">
          <div class="single-product-wrap d-flex">
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
            <div class="product_desc flex-grow-1 ml-4">
              <div class="product_desc_info">
                <div class="product-review">
                  <h5 class="manufacturer">
                    <a>otra cosa </a>
                  </h5>
                  <div class="rating-box">
                    <ul class="rating">
                    otra
                    </ul>
                  </div>
                </div>
                <h4><a class="product_name" href="#">${product.name}--> ${product.category}</a></h4>
                <div class="price-box">
                  <span class="new-price">$${product.sell_price}</span>
                </div>
              </div>
              <div class="add-actions">
                <ul class="add-actions-link" style="display: flex; gap: 5px; justify-content: center;">
                  <li class="li-btn"><a href="#" title="ver detalles" class="quick-view-btn" data-toggle="modal" data-target="#exampleModalCenter" onclick="viewProductDetails(${
                    product.id
                  })"><i class="fa fa-eye"></i></a></li>
                  <li class="li-btn" style="color: red"><a href="#" title="contactar por WhatsApp" class="quick-view-btn" onclick="contactWhatsApp('${
                    product.name 
                  }', ${
        product.sell_price
      })"><i class="fa fa-whatsapp"></i></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>`;
      productArea.insertAdjacentHTML("beforeend", productHTML);
    }
  });
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

// Función para ver detalles del producto
function viewProductDetails(productId) {
  // Aquí puedes implementar la lógica para mostrar los detalles del producto en un modal
  showProductDetails(productId);
  // Puedes cargar los detalles del producto y mostrarlos en el modal correspondiente
}

// Cargar productos al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
  loadProducts(currentPage);
  loadModels("");
  loadCategory();
  // populateShopsList();
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

function loadModels(id) {
  const params = {
    brand: id,
  };
  axios
    .get(`/business-gestion/models/catalog/`, { params })
    .then((res) => {
      const models = res.data.results;
      populateCategorysList(models);
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error al cargar los modelos",
        text: error.message,
        showConfirmButton: false,
        timer: 1500,
      });
    });
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
    loadProductsByModel(""); // Cargar todos los productos
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
      loadProductsByModel(category.id); // Cargar productos por el modelo seleccionado
    });

    listItem.appendChild(link);
    categoryList.appendChild(listItem);
  });
}

function loadProductsByModel(modelId) {
  const url = "/business-gestion/shop-products/catalog/";
  currentPage = 1;
  product__model = modelId;
  loadProducts(currentPage);
  // updatePagination();
}
function loadProductsByModel(modelId) {
  currentPage = 1;
  product__model = modelId;
  loadProducts(currentPage);
}
function searchProducts() {
  currentPage = 1;
  searchValue = document.getElementById("searchInput").value;
  loadProducts(currentPage);
}

function loadCategory() {
  axios
    .get("/business-gestion/category/catalog/")
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

  categorys.forEach((category) => {
    const option = document.createElement("li");
    option.setAttribute("data-value", category.id);
    option.setAttribute("class", "option");
    option.textContent = category.name; // Asignar el nombre de la category como texto
    option.class = "option"; // Asignar el nombre de la category como texto
    option.addEventListener("click", () => {
      console.log("Valor seleccionado:", option.getAttribute("data-value"));
    });
    categorysSelectUL.appendChild(option);
  });
}

function selectCategoryInit(categoryId) {
  product__model__brand = categoryId;
  product__model = "";
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
    console.log("product", product);
    // Actualizar los elementos de la modal con los datos del producto
    document.getElementById("modalProductImage").src = product.image;
    document.getElementById("modalProductName").textContent =
      product.name;
    // document.getElementById("modalBrandName").textContent =
    //   product.product.model.brand.name;
    // document.getElementById("modalModelName").textContent =
    //   product.product.model.__str__;
    document.getElementById(
      "modalPrice"
    ).textContent = `$${product.sell_price}`;
    document.getElementById("modalShopName").textContent = product.shop_name;
    document.getElementById("modalDescription").textContent =
      product.description || "Sin descripción";

    // Agregar botón de WhatsApp en el modal
    const whatsappButton = document.createElement("button");
    whatsappButton.className = "btn btn-success mt-3";
    whatsappButton.innerHTML =
      '<i class="fa fa-whatsapp"></i> Contactar por WhatsApp';
    whatsappButton.onclick = () =>
      contactWhatsApp(product.name, product.sell_price);

    const modalFooter = document.querySelector(
      "#productDetailModal .modal-footer"
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
