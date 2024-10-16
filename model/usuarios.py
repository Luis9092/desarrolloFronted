import requests
from flask import session
import json


class Usuarios:
    def __init__(self) -> None:
        pass

    def autenticarusuario(self, correo, pasw):

        url = "http://127.0.0.1:8000/autenticarUsuario"
        parametros = {"correo": correo, "passw": pasw}
        retorno = requests.post(url, data=json.dumps(parametros))

        if retorno.status_code == 200:
            per = retorno.json()

            session["correo"] = per["correo"]
            session["id"] = per["id"]
            session["nombres"] = per["nombres"] +" " +per["apellidos"]
            session["menu"] = per["menu"]
            return 1
        else:
            return 0

    def crearCuenta(self, nombres, apellidos, correo, pasw, nit, direccion):
        url = "http://127.0.0.1:8000/crearUsuario"
        response = {}
        parametros = {
            "id": 0,
            "nombres": str(nombres),
            "apellidos": str(apellidos),
            "correo": str(correo),
            "contrasenia": str(pasw),
            "nit": str(nit),
            "direccion": str(direccion),
            "fechaCreacion": "string",
            "idrole": 0,
        }
        retorno = requests.post(url, data=json.dumps(parametros))

        if retorno.status_code == 201:
            response = {"estado": 1, "mensaje": "Usuario Creado Correctamente"}
        else:
            response = {"estado": 0, "mensaje": "Por Favor Verificar Los Datos"}
        return response
