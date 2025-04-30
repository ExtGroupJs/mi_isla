// Variable con el token
const csrfToken = document.cookie
  .split(";")
  .find((c) => c.trim().startsWith("csrftoken="))
  ?.split("=")[1];
axios.defaults.headers.common["X-CSRFToken"] = csrfToken;
// url del endpoint principal
const url = "/business-gestion/category/";

$(function () {
  bsCustomFileInput.init();
  // poblarListas();
});

$(document).ready(function () {
  $("table")
    .addClass("table table-hover")
    .DataTable({
      responsive: true,
      dom: '<"top"l>Bfrtip',
      buttons: [
        {
          text: "Crear",
          className: " btn btn-primary btn-info",
          action: function (e, dt, node, config) {
            $("#modal-crear-category").modal("show");
          },
        },
        {
          extend: "excel",
          text: "Excel",
        },
        {
          extend: "pdf",
          text: "PDF",
        },
        {
          extend: "print",
          text: "Print",
        },
      ],
      //Adding server-side processing
      serverSide: true,
      processing: true,
      ajax: function (data, callback, settings) {
        dir = "";

        if (data.order[0].dir == "desc") {
          dir = "-";
        }

        axios
          .get(`${url}`, {
            params: {
              page_size: data.length,
              page: data.start / data.length + 1,
              search: data.search.value,
              ordering: dir + data.columns[data.order[0].column].data,
            },
          })
          .then((res) => {
            callback({
              recordsTotal: res.data.count,
              recordsFiltered: res.data.count,
              data: res.data.results,
            });
          })
          .catch((error) => {
            alert(error);
          });
      },
      columns: [
        { data: "name", title: "Nombre" },
        { data: "price_by_weight", title: "Precio por peso" },
      ],
      //  esto es para truncar el texto de las celdas
      columnDefs: [],
    });
});

let selected_id;

$("#modal-crear-category").on("hide.bs.modal", (event) => {
  const form = event.currentTarget.querySelector("form");
  form.reset();
  edit_category = false;
  const elements = [...form.elements];
  elements.forEach((elem) => elem.classList.remove("is-invalid"));
});

let edit_category = false;
$("#modal-crear-category").on("show.bs.modal", function (event) {
  var button = $(event.relatedTarget); // Button that triggered the modal

  var modal = $(this);
  if (button.data("type") == "edit") {
    var dataName = button.data("name"); // Extract info from data-* attributes
    selected_id = button.data("id"); // Extract info from data-* attributes
    edit_category = true;

    modal.find(".modal-title").text("Editar modelo " + dataName);

    // Realizar la petición con Axios
    axios
      .get(`${url}` + selected_id + "/")
      .then(function (response) {
        // Recibir la respuesta
        const category = response.data;
        console.log(category.extra_info);
        console.log(form.elements);

        form.elements.name.value = category.name;
        console.log("✌️category.brands --->", category.brand);
        form.elements.extra_info.value = category.extra_info;
        form.elements.selectbrands.value = category.brand;

        // document.getElementById("selectbrands").select= category.brand;
      })
      .catch(function (error) {});
  } else {
    modal.find(".modal-title").text("Crear Modelo");
  }
});

// form validator
$(function () {
  $.validator.setDefaults({
    language: "es",
    submitHandler: function () {
      // alert("Form successful submitted!");
    },
  });

  $("#form-create-category").validate({
    rules: {
      name: {
        required: true,
      },
    },
    submitHandler: function (form) {},

    messages: {},
    errorElement: "span",
    errorPlacement: function (error, element) {
      error.addClass("invalid-feedback");
      element.closest(".form-group").append(error);
    },
    highlight: function (element, errorClass, validClass) {
      $(element).addClass("is-invalid");
    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).removeClass("is-invalid");
    },
  });
});

// crear Modelo

let form = document.getElementById("form-create-category");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  var table = $("#tabla-de-Datos").DataTable();
  const csrfToken = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith("csrftoken="))
    ?.split("=")[1];
  axios.defaults.headers.common["X-CSRFToken"] = csrfToken;
  let data = new FormData();
  data.append("name", document.getElementById("name").value);
  data.append("brand", document.getElementById("selectbrands").value);
  data.append("extra_info", document.getElementById("extra_info").value);

  if (edit_category) {
    axios
      .patch(`${url}` + selected_id + "/", data)
      .then((response) => {
        if (response.status === 200) {
          $("#modal-crear-category").modal("hide");
          Swal.fire({
            icon: "success",
            title: "Modelo actualizado con éxito  ",
            showConfirmButton: false,
            timer: 1500,
          });
          table.ajax.reload();

          edit_category = false;
        }
      })
      .catch((error) => {
        let dict = error.response.data;
        let textError = "Revise los siguientes campos: ";
        for (const key in dict) {
          textError = textError + ", " + key;
        }

        Swal.fire({
          icon: "error",
          title: "Error al crear el Modelo",
          text: textError,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  } else {
    axios
      .post(`${url}`, data)
      .then((response) => {
        if (response.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Modelo creado con exito",
            showConfirmButton: false,
            timer: 1500,
          });
          table.ajax.reload();
          $("#modal-crear-category").modal("hide");
        }
      })
      .catch((error) => {
        let dict = error.response.data;
        let textError = "Revise los siguientes campos: ";
        for (const key in dict) {
          textError = textError + ", " + key;
        }

        Swal.fire({
          icon: "error",
          title: "Error al crear el Modelo",
          text: textError,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  }
});

function poblarListas() {
  var $brands = document.getElementById("selectbrands");
  axios.get("../../business-gestion/brands/").then(function (response) {
    response.data.results.forEach(function (element) {
      var option = new Option(element.name, element.id);
      $brands.add(option);
    });
  });
}

function function_delete(id, name, brand_name) {
  const table = $("#tabla-de-Datos").DataTable();
  Swal.fire({
    title: "Eliminar",
    text: `¿Está seguro que desea eliminar el modelo ${name} de la marca ${brand_name}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Eliminar",
  }).then((result) => {
    if (result.isConfirmed) {
      axios.defaults.headers.common["X-CSRFToken"] = csrfToken;
      axios
        .delete(`${url}${id}/`)
        .then((response) => {
          if (response.status === 204) {
            table.row(`#${id}`).remove().draw();
            Swal.fire({
              icon: "success",
              title: "Eliminar Marca",
              text: "Marca eliminada satisfactoriamente ",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error eliminando elemento",
            text: error.response.data.detail,
            showConfirmButton: false,
            timer: 3000,
          });
        });
    }
  });
}
