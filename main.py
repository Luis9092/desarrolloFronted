from flask import Flask
from flask import render_template, url_for, request, session, redirect
from werkzeug.utils import secure_filename
import requests

import json

from model.usuarios import Usuarios
from model.productos import Producto


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
    return render_template("inicioapp.html", per=per)

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
    



if __name__ == "__main__":
    app.run(debug=True)
