// const modalCliente = document.querySelector("#modalCliente");
const btn_cancelarcliente = document.querySelector("#btn_cancelarcliente");

const abrircliente = document.querySelector("#abrircliente");

// if (abrircliente) {
//     abrircliente.addEventListener("click", (e) => {
//         modalCliente.showModal();
//     });
// }

if (btn_cancelarcliente) {
    btn_cancelarcliente.addEventListener("click", (e) => {
        e.preventDefault();
        modalCliente.close();

    })
}


const txtnombresc = document.querySelector("#txtnombresc");
const txtapellidosc = document.querySelector("#txtapellidosc");
const txtnitc = document.querySelector("#txtnitc");
const txtCorreoc = document.querySelector("#txtCorreoc");
const txtdireccionc = document.querySelector("#txtdireccionc");
const txtfechac = document.querySelector("#txtfechac");
const txtidcc = document.querySelector("#txtidcc");

const btnEliminarCliente = document.querySelector("#btnEliminarCliente");
const btnActualizarCliente = document.querySelector("#btnActualizarCliente");



$("#tableClientes").on("click", "tr td", function (evt) {
    let id, nombres, apellidos, correo,
        nit,
        direccion,
        fecha;
    target = $(event.target);

    id = target.parent("tr").find("td").eq(0).html();
    nombres = target.parent("tr").find("td").eq(2).html();
    apellidos = target.parent("tr").find("td").eq(3).html();
    correo = target.parent("tr").find("td").eq(4).html();
    nit = target.parent("tr").find("td").eq(5).html();
    direccion = target.parent("tr").find("td").eq(6).html();
    fecha = target.parent("tr").find("td").eq(7).html();

    txtidcc.value = id;
    txtnombresc.value = nombres;
    txtapellidosc.value = apellidos;
    txtnitc.value = nit;
    txtCorreoc.value = correo;
    txtdireccionc.value = direccion;
    txtfechac.value = fecha;
    modalCliente.showModal();
});







let boton2 = document.getElementsByName("accionCliente");

for (const btn of boton2) {
    btn.addEventListener("click", function (e) {
        let valor = this.value;
        notificarProcesoC(valor);

    });
}


function notificarProcesoC(valor) {
    Swal.fire({
        target: document.querySelector("#modalCliente"),
        title: `Desea ${valor} el cliente?`,
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0080ff",
        cancelButtonColor: "#D2122E",
        cancelButtonText: "Cancelar",
        confirmButtonText: `Si, ${valor}`,
    }).then((result) => {
        if (result.isConfirmed) {
            enviarformCliente(valor);
        }
    });
}


function enviarformCliente(valor) {

    let formcliente = $("#formCliente");

    formcliente.submit(function (e) {
        e.preventDefault();

        $.ajax({
            type: formcliente.attr("method"),
            url: formcliente.attr("action") + "/" + valor,
            data: new FormData(this),
            processData: false,
            contentType: false,
            success: function (response) {
                const respuesta = JSON.parse(response);

                modalCliente.close();

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
                        window.location.replace("/clientes");
                    });
                }
            },
            error: function (error) {
                alert(error);
            },
        });
    });
    formcliente.trigger("submit");

}




$(document).ready(function () {
    $("#tableClientes").DataTable({
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
        },
        scrollY: true,
        scrollX: true,
    });
});
