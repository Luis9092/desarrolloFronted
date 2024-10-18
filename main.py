import os
from flask import Flask
from flask import render_template, url_for, request, session, redirect
from werkzeug.utils import secure_filename
import requests

import json

from model.usuarios import Usuarios
from model.productos import Producto
from datetime import datetime


app = Flask(__name__)
app.secret_key = "dotaexterminador9912"


@app.route("/")
def root():
    return render_template("home.html")


@app.route("/salir")
def salir():
    session.clear()
    return redirect(url_for("root"))


@app.route("/iniciarSesion")
def renderIniciarSesion():
    return render_template("iniciarSesion.html")


@app.route("/crearCuenta")
def renderCrearCuenta():
    return render_template("crearCuenta.html")


@app.route("/crearUsuario", methods=["POST"])
def crearUsuario():
    us = Usuarios()
    nombres = request.form["txtnombres"]
    apellidos = request.form["txtapellidos"]
    correo = request.form["txtCorreoUsuario"]
    pasw = request.form["txtPassword"]
    txtnit = request.form["txtnit"]
    txtdireccion = request.form["txtdireccion"]

    retorno = us.crearCuenta(nombres, apellidos, correo, pasw, txtnit, txtdireccion)

    return json.dumps(retorno)


@app.route("/iniciarsesion", methods=["POST"])
def iniciarSesion():
    correo = request.form["txtCorreoUsuario"]
    pasw = request.form["txtPassword"]
    respuesta = {"estado": 0, "mensaje": "Por Favor Verificar Los Datos"}
    respuestasi = {"estado": 1, "mensaje": "Credenciales autenticadas correctamente. "}
    us = Usuarios()
    retorno = us.autenticarusuario(correo=correo, pasw=pasw)
    if retorno != 0:
        return json.dumps(respuestasi)

    return json.dumps(respuesta)


@app.route("/home")
def inicioApp():
    per = session.get("menu")
    if "menu" not in session or not session["menu"]:
        return redirect(url_for("root"))

    url = "http://127.0.0.1:8000/verProductos"
    url2 = "http://127.0.0.1:8000/vercategoria"

    response = requests.get(url)
    response2 = requests.get(url2)

    if response.status_code == 200:
        tableProductos = response.json()
        cat = response2.json()

        return render_template(
            "inicioapp.html", tableProductos=tableProductos, per=per, cat=cat
        )

    return render_template("inicioapp.html", tableProductos=[], per=per, cat=[])


@app.route("/productos")
def renderProductos():
    per = session.get("menu")
    if "menu" not in session or not session["menu"]:
        return redirect(url_for("root"))

    url = "http://127.0.0.1:8000/verProductos"

    response = requests.get(url)

    if response.status_code == 200:
        tableProductos = response.json()

        return render_template("productos.html", tableProductos=tableProductos, per=per)

    return render_template("productos.html", tableProductos=[], per=per)


@app.route("/productosOperaciones/<string:accion>", methods=["POST"])
def operacionesProducto(accion):
    operacion = accion
    nombreproducto = request.form["nombreproducto"]
    file = request.files["imagenProducto"]
    txtprecio = request.form["txtprecio"]
    txtproveedor = request.form["txtProveedor"]
    txtcategoria = request.form["txtcategoria"]
    txtdescripcion = request.form["txtdescripcion"]
    txtid = request.form["txtid"]
    txtexistencia = request.form["txtexistencia"]
    txtnameAnterior = request.form["txtnameAnterior"]
    tiempo = datetime.now()
    horaActual = tiempo.strftime("%Y%H%M%S")
    nm = ""
    try:
        if file.filename != "":
            nm = horaActual + "_" + file.filename
            file.save("static/servidorImg/" + nm)

            if os.path.exists("static/servidorImg/" + txtnameAnterior):
                os.remove("static/servidorImg/" + txtnameAnterior)
        else:
            nm = txtnameAnterior
    except Exception as e:
        print(f"Ocurrió un error: {e}")

    pr = Producto()
    pr.ConsProducto(
        txtid,
        nombreproducto,
        txtdescripcion,
        nm,
        txtcategoria,
        txtexistencia,
        txtprecio,
        0,
        "",
        txtproveedor,
    )
    if operacion == "agregar":
        retorno = pr.agregarProducto()
        return json.dumps(retorno)

    if operacion == "actualizar":

        retorno = pr.modificarPrpoducto()
        return json.dumps(retorno)
    if operacion == "eliminar":
        if os.path.exists("static/servidorImg/" + txtnameAnterior):
            os.remove("static/servidorImg/" + txtnameAnterior)
        retorno = pr.eliminarProducto()
        return json.dumps(retorno)


if __name__ == "__main__":
    app.run(debug=True)
