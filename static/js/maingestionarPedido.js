const modalVerGestionUser = document.querySelector("#modalVerGestionUser");
const btn_cancelargestion = document.querySelector("#btn_cancelargestion");

const txtnombreClientef = document.querySelector("#txtnombreClientef");
const txtdireccionf = document.querySelector("#txtdireccionf");
const txtestadof = document.querySelector("#txtestadof");
const txtfechaf = document.querySelector("#txtfechaf");
const btnsalirf = document.querySelector("#btnsalirf");
const txttotalff = document.querySelector("#txttotalff");
const idventaf = document.querySelector("#idventaf");
const btnProductoEntregado = document.querySelector("#btnProductoEntregado");

const btnproductoenviado = document.querySelector("#btnproductoenviado");

if (btn_cancelargestion) {
    btn_cancelargestion.addEventListener("click", (e) => {
        modalVerGestionUser.close();
    })
}

if (btnsalirf) {
    btnsalirf.addEventListener("click", (e) => {
        modalVerGestionUser.close();
    });
}

$("#tablegestionPedido").on("click", "tr td", function (evt) {
    let id, nombres, apellidos,
        direccion, idventa,
        fecha;
    target = $(event.target);

    id = target.parent("tr").find("td").eq(0).html();
    nombres = target.parent("tr").find("td").eq(2).html();
    apellidos = target.parent("tr").find("td").eq(3).html();
    direccion = target.parent("tr").find("td").eq(4).html();
    idventa = target.parent("tr").find("td").eq(5).html();
    estado = target.parent("tr").find("td").eq(6).html();
    fecha = target.parent("tr").find("td").eq(7).html();

    txtnombreClientef.value = nombres + " " + apellidos;
    txtdireccionf.value = direccion;
    txtestadof.value = estado;
    txtfechaf.value = fecha;
    idventaf.value = idventa;
    btnProductoEntregado.style.display = "none";

    if (estado == "No Entregado") {
        btnproductoenviado.style.display = "block";

    } else {
        btnproductoenviado.style.display = "none";

    }


    modalVerGestionUser.showModal();
    obtenerDetalle(idventa);
});


$("#tablegestionPedidoUser").on("click", "tr td", function (evt) {
    let id, nombres, apellidos,
        direccion, idventa,
        fecha;
    target = $(event.target);

    id = target.parent("tr").find("td").eq(0).html();
    nombres = target.parent("tr").find("td").eq(2).html();
    apellidos = target.parent("tr").find("td").eq(3).html();
    direccion = target.parent("tr").find("td").eq(4).html();
    idventa = target.parent("tr").find("td").eq(5).html();
    estado = target.parent("tr").find("td").eq(6).html();
    fecha = target.parent("tr").find("td").eq(7).html();

    txtnombreClientef.value = nombres + " " + apellidos;
    txtdireccionf.value = direccion;
    txtestadof.value = estado;
    txtfechaf.value = fecha;
    idventaf.value = idventa;
    btnproductoenviado.style.display = "none";

    if (estado == "En Proceso") {
        btnProductoEntregado.style.display = "block";
    } else {
        btnProductoEntregado.style.display = "none";

    }


    modalVerGestionUser.showModal();
    obtenerDetalle(idventa);
});


let tablaff = $("#tableverdet").DataTable({
    language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
    },
    scrollY: true,
    scrollX: true,
    "bDestroy": true // Cambia a true para permitir la destrucción de la tabla
});



async function obtenerDetalle(id) {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/listarCompraDetalle/<id>`, {
            params: {
                id: Number(id),
            },
        });
        let contador = 0;
        let total = 0;
        tablaff.clear();
        Object.entries(response.data).forEach(([key, value]) => {
            contador++;
            tablaff.row.add([
                contador,
                value.nombre,
                value.descripcion,
                value.cantidad,
                value.precio,
                (value.cantidad * value.precio)
            ]);

            total += Number(value.precio * value.cantidad);
        });
        txttotalff.value = total;
        tablaff.draw();

        console.log(response);
    } catch (error) {
        console.error("Error al obtener el producto:", error);
    }
}


if (btnproductoenviado) {
    btnproductoenviado.addEventListener("click", (e) => {
        e.preventDefault();
        const id = idventaf.value;
        Swal.fire({
            target: document.querySelector("#modalVerGestionUser"),
            title: "Enviar Pedido",
            text: "Se validara la compra primero que todo.",
            icon: "info",
            background: "#ffffff",
            showCancelButton: true,
            confirmButtonColor: "#0072ff",
            cancelButtonColor: "#D2122E",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Sí, producto enviado",
        }).then((result) => {
            if (result.value) {
                validarestadop(id);
            }
        });
    });
}

async function validarestadop(id) {
    retorno = await ModificarEstadoProd(id);
    console.log(retorno);
    modalVerGestionUser.close();
    window.location.replace("/gestionPedidos");

    if (retorno == 1) {
        Swal.fire({
            title: "Pedido",
            text: "Pedido Enviado Correctamente.",
            icon: "success"
        });
    } else {
        Swal.fire({
            title: "Pedido",
            text: "Al parecer ocurrio un error al enviar el producto.",
            icon: "info"
        });
    }
}


async function ModificarEstadoProd(id) {
    let retorno = 0;
    try {
        const response = await axios.put(`http://127.0.0.1:8000/actualizarEstadoPedidoUser/${id}`, {

        });

        if (response.status === 200) {
            retorno = 1;
        }
    } catch (error) {
        console.log(error);
        retorno = 0;
    }

    return retorno;
}

// INICIANDO A VALIDAR SI SE ENTREGO EL PRODUCTO AL CLIENTE


if (btnProductoEntregado) {
    btnProductoEntregado.addEventListener("click", (e) => {
        e.preventDefault();
        const id = idventaf.value;
        Swal.fire({
            target: document.querySelector("#modalVerGestionUser"),
            title: "Producto Entregado",
            text: "Ha recibido su producto correctamente?",
            icon: "info",
            background: "#ffffff",
            showCancelButton: true,
            confirmButtonColor: "#0072ff",
            cancelButtonColor: "#D2122E",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Sí, tengo mi producto.",
        }).then((result) => {
            if (result.value) {
                validarestadop4(id);
            }
        });
    });
}

async function validarestadop4(id) {
    retorno = await ModificarEstadoProd4(id);
    console.log(retorno);
    modalVerGestionUser.close();
    if (retorno == 1) {

        window.location.replace("/mispedidos");


        Swal.fire({
            title: "Pedido",
            text: "Pedido Recibido Correctamente.",
            icon: "success"
        });
    }
}


async function ModificarEstadoProd4(id) {
    let retorno = 0;
    try {
        const response = await axios.put(`http://127.0.0.1:8000/actualizarEstadoPedidoUserrecibido/${id}`, {

        });

        if (response.status === 200) {
            retorno = 1;
        }
    } catch (error) {
        console.log(error);
        retorno = 0;
    }

    return retorno;
}


$(document).ready(function () {
    $("#tablegestionPedido").DataTable({
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
        },
        scrollY: true,
        scrollX: true,
    });
});

$(document).ready(function () {
    $("#tablegestionPedidoUser").DataTable({
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
        },
        scrollY: true,
        scrollX: true,
    });
});

