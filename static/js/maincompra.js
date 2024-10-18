let btnagregarPro = document.querySelectorAll("#btnagregarPro");
const modalAgregarProducto = document.querySelector("#modalAgregarProducto");
const txtidcompra = document.querySelector("#txtidcompra");
const verImagencompra = document.querySelector("#verImagencompra");
const nombreproductocompra = document.querySelector("#nombreproductocompra");
const txtpreciocompra = document.querySelector("#txtpreciocompra");
const txtdescripcioncompra = document.querySelector("#txtdescripcioncompra");
const txtcantidadcompra = document.querySelector("#txtcantidadcompra");
const txtsubtotal = document.querySelector("#txtsubtotal");
const txtnameimg = document.querySelector("#txtnameimg");
const btnagregarlocal = document.querySelector("#btnagregarcar");
const btncerraModalcar = document.querySelector("#btncerraModalcar");
const buttonlimpiar = document.querySelector("#buttonlimpiar");

const btnmodificarCarrito = document.querySelector("#btnmodificarCarrito");
const btnEliminarCarrito = document.querySelector("#btnEliminarCarrito");
const btncancerlaPedido = document.querySelector("#btncancerlaPedido");
const txttotal = document.querySelector("#txttotal");

if (btncerraModalcar) {
    btncerraModalcar.addEventListener("click", () => {
        modalAgregarProducto.close();
    })
}
for (element of btnagregarPro) {
    element.addEventListener("click", function (e) {
        const id = this.value;
        limpiarFormProducto();
        ObtenerProducto(id);
        modalAgregarProducto.showModal();

    });
}

const modalCarrito = document.querySelector("#modalCarrito");
const btnCarrito = document.querySelector("#btnCarrito");
const btn_cancelarcarrito = document.querySelector("#btn_cancelarcarrito");
if (btnCarrito) {
    btnCarrito.addEventListener("click", (e) => {
        e.preventDefault();
        modalCarrito.showModal();
        ListarProductos();

    });
}

if (btn_cancelarcarrito) {
    btn_cancelarcarrito.addEventListener("click", (e) => {
        modalCarrito.close();
    });
}



async function ObtenerProducto(id) {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/buscarproducto/<id>`, {
            params: {
                id: id,
            },
        });

        txtidcompra.value = response.data["id"];
        nombreproductocompra.value = response.data["nombre"];
        txtdescripcioncompra.value = response.data["descripcion"];
        txtpreciocompra.value = response.data["precio"];
        verImagencompra.src = "/static/servidorImg/" + response.data["imagen"];
        txtnameimg.value = response.data["imagen"];

    } catch (error) {
        console.error("Error al obtener el producto:", error);
    }
}

txtcantidadcompra.addEventListener("change", function () {
    let sub = txtcantidadcompra.value * txtpreciocompra.value;
    txtsubtotal.value = sub;
});

let dataCarrito = localStorage.getItem("dataCarrito"); //Obtener datos de localStorage
dataCarrito = JSON.parse(dataCarrito);


if (dataCarrito === null) {
    dataCarrito = [];
}


if (btnagregarlocal) {
    btnagregarlocal.addEventListener("click", (e) => {
        let retorno = AgregarCarrito();
        if (retorno === 1) {
            modalAgregarProducto.close();
        }
    });
}

function AgregarCarrito() {
    // Seleccionamos los datos de los inputs de formulario
    let datos_cliente = JSON.stringify({
        id: txtidcompra.value,
        producto: nombreproductocompra.value,
        descripcion: txtdescripcioncompra.value,
        precio: txtpreciocompra.value,
        cantidad: txtcantidadcompra.value,
        subtotal: txtsubtotal.value,
        imagen: txtnameimg.value
    });

    dataCarrito.push(datos_cliente); // Guardar datos en el array definido globalmente
    localStorage.setItem("dataCarrito", JSON.stringify(dataCarrito));
    return 1;
}
let tabla = $("#tablecarrito").DataTable({
    language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
    },
    scrollY: true,
    scrollX: true,
    "bDestroy": true // Cambia a true para permitir la destrucción de la tabla
});

function ListarProductos() {
    // Inicializa la tabla
    // Limpia la tabla antes de agregar nuevos datos
    tabla.clear();
    let total = 0;
    let contador = 0;
    for (let i in dataCarrito) {
        contador++;
        let d = JSON.parse(dataCarrito[i]);
        tabla.row.add([
            contador,
            d.id,
            d.producto,
            d.descripcion,
            d.precio,
            d.cantidad,
            d.subtotal,
            d.imagen
        ]);

        total += Number(d.subtotal);
    }

    txttotal.value = total;

    console.log(total);

    // Dibuja la tabla con los nuevos datos
    tabla.draw();

    ocultarColumna(7)

}


$("#tablecarrito").on("click", "tr td", function (evt) {
    let id, nombre, descripcion,
        precio,
        cantidad,
        imagen,
        subtotal;

    target = $(event.target);
    id = target.parent("tr").find("td").eq(1).html();
    nombre = target.parent("tr").find("td").eq(2).html();
    descripcion = target.parent("tr").find("td").eq(3).html();
    precio = target.parent("tr").find("td").eq(4).html();
    cantidad = target.parent("tr").find("td").eq(5).html();
    subtotal = target.parent("tr").find("td").eq(6).html();
    imagen = target.parent("tr").find("td").eq(7).html();

    txtidcompra.value = id;
    nombreproductocompra.value = nombre;
    txtdescripcioncompra.value = descripcion;
    verImagencompra.src = "/static/servidorImg/" + imagen;
    txtpreciocompra.value = precio;
    txtcantidadcompra.value = cantidad;
    txtsubtotal.value = subtotal;

    btnmodificarCarrito.style.display = "block";
    btnEliminarCarrito.style.display = "block";
    btnagregarlocal.style.display = "none";

    modalCarrito.close();
    modalAgregarProducto.showModal();

});


// MODIFICAR EL PRODUCTO DEL CARRITO

if (btnmodificarCarrito) {
    btnmodificarCarrito.addEventListener("click", (e) => {
        e.preventDefault();
        const id = txtidcompra.value;
        alert(id);

        const index = dataCarrito.findIndex(item => JSON.parse(item).id === id);
        if (index !== -1) {
            dataCarrito[index] = JSON.stringify({
                id: txtidcompra.value,
                producto: nombreproductocompra.value,
                descripcion: txtdescripcioncompra.value,
                precio: txtpreciocompra.value,
                cantidad: txtcantidadcompra.value,
                subtotal: txtsubtotal.value,
                imagen: txtnameimg.value
            });
            localStorage.setItem("dataCarrito", JSON.stringify(dataCarrito));
            modalAgregarProducto.close();
            // mostrartotal();
        } else {
            console.error("ID no encontrado en el carrito");
        }
    });
}


if (btnEliminarCarrito) {
    btnEliminarCarrito.addEventListener("click", (e) => {
        e.preventDefault();
        const id = txtidcompra.value;
        const index = dataCarrito.findIndex(item => JSON.parse(item).id === id);
        if (index !== -1) {
            Eliminarproductocarrito(index);
        }
        modalAgregarProducto.close();
    });
}




function Eliminarproductocarrito(e) {
    dataCarrito.splice(e, 1); // Args (posición en el array, numero de items a eliminar)
    localStorage.setItem("dataCarrito", JSON.stringify(dataCarrito));
}

if (btncancerlaPedido) {
    btncancerlaPedido.addEventListener("click", (e) => {
        localStorage.removeItem("dataCarrito");
        location.reload();

    });
}

//VALIDACIONES
const validateNit = (e) => {
    const fieldValue = e.target.value;
    const regex = new RegExp(/^\d{8}-[0-9kK]$/);
    const field_id = e.target.id;


    if (fieldValue.trim().length === 0) {
        ValidacionLogin("warning", "#FF0000", "Por favor el campo nit*");
        verificar_input[field_id] = true;

    } else if (!regex.test(fieldValue)) {
        ValidacionLogin("warning", "#FF0000", "No cumple con un nit valido*");
        verificar_input[field_id] = true;

    } else {
        verificar_input[field_id] = false;
        ValidacionLogin("success", "#17b100", "*Nit Llenado correctamente");
    }

    if (fieldValue == "cf") {
        ValidacionLogin("success", "#17b100", "*Nit Llenado correctamente");
        verificar_input[field_id] = false;

    }

    // submitController();
};









function mostrartotal() {
    let uno = document.querySelectorAll("#txtsubtotal");
    let total = 0;

    uno.forEach((item) => {
        if (isNaN(parseFloat(item.value))) {
            total += 0;
        } else {
            total += parseFloat(item.value);
        }
    });

    document.getElementById("total").value = total;
}


function ocultarColumna(index) {
    const tabla = document.getElementById("tablecarrito");

    // Ocultar encabezado
    const encabezado = tabla.getElementsByTagName("th")[index];
    if (encabezado) {
        encabezado.style.display = "none";
    }

    // Ocultar celdas en cada fila
    for (let i = 0; i < tabla.rows.length; i++) {
        const celda = tabla.rows[i].cells[index];
        if (celda) {
            celda.style.display = "none";
        }
    }
}


function limpiarFormProducto() {
    btnmodificarCarrito.style.display = "none";
    btnEliminarCarrito.style.display = "none";
    btnagregarlocal.style.display = "block";
    txtcantidadcompra.value = 0;
    txtsubtotal.value = 0;
    txtdescripcioncompra.value = "";
    nombreproductocompra.value = "";
    txtpreciocompra.value = 0;

}

// FUNCIONES CREAR COMPRA SISTEMA DB
let fechaActual = function () {
    let hoy = new Date();
    let fecha =
        hoy.getDate() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getFullYear();
    let hora = hoy.getHours() + ":" + hoy.getMinutes() + ":" + hoy.getSeconds();

    return (fechaYHora = fecha + " " + hora);
};

const btnrealizarPedido = document.querySelector("#btnrealizarPedido");

if (btnrealizarPedido) {
    btnrealizarPedido.addEventListener("click", (e) => {
        AlertaAceptarCompra();
    });
}


function AlertaAceptarCompra() {
    Swal.fire({
        target: document.querySelector("#modalCarrito"),
        title: "¿Desea aceptar el pedido?",
        text: "Se validara la compra primero que todo.",
        icon: "info",
        background: "#ffffff",
        showCancelButton: true,
        confirmButtonColor: "#0072ff",
        cancelButtonColor: "#D2122E",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sí, deseo comprar",
    }).then((result) => {
        if (result.value) {
            const idCliente = document.querySelector("#iduser").value;
            const serie = "A";
            const fecha = fechaActual();
            enviarDataApi(idCliente, serie, fecha);
        }
    });
}

async function enviarDataApi(idCliente, serie, fecha) {
    const retorno1 = await crearVenta(idCliente, serie, fecha)
    console.log(retorno1);
    if (retorno1 == 1) {
        const idfinal = await obtenerVentaid(fecha);
        console.log(idfinal);
        const retorno2 = await crearVentaDetalle(idfinal);
        if (retorno2 == 1) {
            await crearEstadoPedido(idCliente, idfinal, fecha);
            localStorage.removeItem("dataCarrito");
            modalCarrito.close();
            Swal.fire({
                title: "Pedido",
                text: "Pedido Enviado Correctamente.",
                icon: "success"
            });
        }
    }
}

async function crearVenta(idCliente, serie, fecha) {
    let retorno = 0;
    try {
        const response = await axios.post("http://127.0.0.1:8000/agregarVenta", {
            "id": 0,
            "serie": String(serie),
            "iduser": Number(idCliente),
            "fechaCompra": String(fecha)
        });

        if (response.status === 200) {
            retorno = 1;
        }
    } catch (error) {
        console.log(error);
        retorno = 0;
    }

    return retorno; // Devuelve el valor de retorno
}
async function crearVentaDetalle(idventa) {
    let retorno = 0;
    for (let i in dataCarrito) {
        let enviar = JSON.parse(dataCarrito[i]);
        try {
            const response = await axios.post("http://127.0.0.1:8000/agregarVentaDetalle", {
                "id": 0,
                "idventa": Number(idventa),
                "idproducto": Number(enviar.id),
                "cantidad": Number(enviar.cantidad),
                "preciounitario": Number(enviar.precio)
            });

            if (response.status === 200) {
                retorno = 1;
            }
        } catch (error) {
            console.log(error);
            retorno = 0;
        }
    }

    return retorno; // Devuelve el valor de retorno
}

async function crearEstadoPedido(iduser, idventa, fechaPedido) {
    let retorno = 0;
    try {
        const response = await axios.post("http://127.0.0.1:8000/estadopedido", {
            "id": 0,
            "iduser": Number(iduser),
            "idventa": Number(idventa),
            "estado": "",
            "fechaPedido": String(fechaPedido)
        });

        if (response.status === 200) {
            retorno = 1;
        }
    } catch (error) {
        console.log(error);
        retorno = 0;
    }

    return retorno;  // Devuelve el valor de retorno
}
async function obtenerVentaid(fechapedido) {
    let retorno = 0;
    try {
        const response = await axios.get("http://127.0.0.1:8000/obteneridVenta/<fecha>", {
            params: {
                fecha: fechapedido,
            },
        });
        if (response.status === 200) {
            retorno = response.data.id;
            console.log(retorno);
        }
    } catch (e) {
        console.log(e);
        return 0;
    }
    return retorno;
}
