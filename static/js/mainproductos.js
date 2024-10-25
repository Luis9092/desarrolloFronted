const btnAgregarProducto = document.querySelector("#btnAgregarProductos");
const modalProductos = document.querySelector("#modalProductos");
const btn_cancelarProducto = document.querySelector("#btn_cancelarProducto");
const btnenviardProducto = document.querySelector("#btnenviardProducto");
const btnEliminarProducto = document.querySelector("#btnEliminarProducto");
const btnActualizarProducto = document.querySelector("#btnActualizarProducto");



// INPUTS
const nombreproducto = document.querySelector("#nombreproducto");
const imagenProducto = document.querySelector("#imagenProducto");
const txtprecio = document.querySelector("#txtprecio");
const txtProveedor = document.querySelector("#txtProveedor");
const txtcategoria = document.querySelector("#txtcategoria");
const txtdescripcion = document.querySelector("#txtdescripcion");
const txtfecha = document.querySelector("#txtfecha");
const verImagen = document.querySelector("#verImagen");
const hideFecha = document.querySelector(".hidefecha");
const txtexistencia = document.querySelector("#txtexistencia");
const txtid = document.querySelector("#txtid");
const txtnameAnterior = document.querySelector("#txtnameAnterior");


if (btnAgregarProducto) {
    btnAgregarProducto.addEventListener("click", (e) => {
        limpiarForm();
        modalProductos.showModal();
    })
}

if (btn_cancelarProducto) {
    btn_cancelarProducto.addEventListener("click", (e) => {
        modalProductos.close();


    })
}

function validarArchivo(archivo) {
    const tiposValidos = ['image/jpeg', 'image/png', 'image/jpg'];
    return tiposValidos.includes(archivo.type);
}

// PRIMER PASO VALIDAR LAS ENTRADAS DE ARCHIVOS
const inputarchivoFoto = document.querySelector('#imagenProducto');
let estadoProductoForm = 0;

if (inputarchivoFoto) {
    inputarchivoFoto.addEventListener('change', function () {
        const archivo = this.files[0];
        if (archivo) {
            if (validarArchivo(archivo)) {
                const fileReader = new FileReader();

                fileReader.onload = function (event) {
                    verImagen.src = event.target.result;
                    estadoProductoForm = 1;
                    btnenviardProducto.disabled = false;
                    alertModal("#00dfdf", "Imagen Agregada correctamente!!", "success",)
                };

                fileReader.readAsDataURL(archivo);
            } else {
                estadoProductoForm = 0;
                alertModal("#ff0055", "El archivo no es válido. Debe ser JPG, PNG o JPEG.", "error",)
            }
        }
    });
}


let boton = document.getElementsByName("accion");

for (const btn of boton) {
    btn.addEventListener("click", function (e) {
        let valor = this.value;

        if (valor == "agregar") {
            if (estadoProductoForm == 1) {
                notificarProceso(valor);
            }
        } else {
            notificarProceso(valor);
        }

    });
}


function notificarProceso(valor) {
    Swal.fire({
        target: document.querySelector("#modalProductos"),
        title: `Desea ${valor} el producto?`,
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0080ff",
        cancelButtonColor: "#D2122E",
        cancelButtonText: "Cancelar",
        confirmButtonText: `Si, ${valor}`,
    }).then((result) => {
        if (result.isConfirmed) {
            enviarformProducto(valor);
        }
    });
}


function enviarformProducto(valor) {

    let formProducto = $("#formProducto");

    formProducto.submit(function (e) {
        e.preventDefault();

        $.ajax({
            type: formProducto.attr("method"),
            url: formProducto.attr("action") + "/" + valor,
            data: new FormData(this),
            processData: false,
            contentType: false,
            success: function (response) {
                const respuesta = JSON.parse(response);

                modalProductos.close();

                if (respuesta.estado == 0) {
                    Swal.fire({
                        title: "Error",
                        text: respuesta.mensaje,
                        icon: "error",
                        confirmButtonColor: "#ff004c",
                    }).then(function () {

                    });
                } else {
                    Swal.fire({
                        title: "Excelente!!",
                        text: respuesta.mensaje,
                        icon: "success",
                        confirmButtonColor: "#0080ff",
                    }).then(function () {
                        window.location.replace("/productos");
                    });
                }
            },
            error: function (error) {
                alert(error);
            },
        });
    });
    formProducto.trigger("submit");

}

function alertModal(color, mensaje, icon) {

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        iconColor: color,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: icon,
        title: mensaje
    });
}

$(document).ready(function () {
    $("#tableProductos").DataTable({
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
        },
        scrollY: true,
        scrollX: true,
    });
});



$("#tableProductos").on("click", "tr td", function (evt) {
    let id, descripcion, idProveedor, idcategoria,
        nombre,
        precio,
        cantidad,
        precioVenta,
        imagen,
        fechaIngreso;

    target = $(event.target);
    id = target.parent("tr").find("td").eq(0).html();
    descripcion = target.parent("tr").find("td").eq(1).html();
    idcategoria = target.parent("tr").find("td").eq(2).html();

    nombre = target.parent("tr").find("td").eq(4).html();
    precio = target.parent("tr").find("td").eq(5).html();

    cantidad = target.parent("tr").find("td").eq(6).html();
    precioVenta = target.parent("tr").find("td").eq(7).html();
    fechaIngreso = target.parent("tr").find("td").eq(9).html();
    imagen = target.parent("tr").find("td").eq(10).html();
    idProveedor = target.parent("tr").find("td").eq(11).html();

    nombreproducto.value = nombre;
    hideFecha.style.display = "block";
    txtprecio.value = precio; txtProveedor.value = idProveedor; txtcategoria.value = idcategoria; txtdescripcion.value = descripcion;
    txtfecha.value = fechaIngreso;
    verImagen.src = "/static/servidorImg/" + imagen;
    txtexistencia.value = cantidad;
    txtid.value = id;
    txtnameAnterior.value = imagen;
    btnEliminarProducto.style.display = "block";
    btnActualizarProducto.style.display = "block";
    btnenviardProducto.style.display = "none";

    modalProductos.showModal();
});

function limpiarForm() {
    nombreproducto.value = "";
    hideFecha.style.display = "none";
    txtprecio.value = 0;
    txtProveedor.value = 1;
    txtcategoria.value = 1;
    txtdescripcion.value = "";
    txtexistencia.value = 0;
    verImagen.src = "/static/servidorImg/calzado2.jpg";
    btnEliminarProducto.style.display = "none";
    btnActualizarProducto.style.display = "none";
    btnenviardProducto.style.display = "block";

}


var swiper = new Swiper(".featured-slider", {
    spaceBetween: 10,
    loop: true,
    centeredSlides: true,
    autoplay: {
        delay: 9500,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        450: {
            slidesPerView: 2,
        },
        768: {
            slidesPerView: 3,
        },
        1024: {
            slidesPerView: 4,
        },
    },
});