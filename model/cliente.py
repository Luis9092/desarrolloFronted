import requests
import json


class Cliente:
    def __init__(self) -> None:
        pass

    def constructorCliente(
        self,
        id,
        nombres,
        apellidos,
        nit,
        direccion,
    ):
        self.id = id
        self.nombres = nombres
        self.apellidos = apellidos
        self.nit = nit
        self.direccion = direccion

    def acualizarCliente(self):
        url = "http://127.0.0.1:8000/modificarCliente"
        data = {
            "id": self.id,
            "nombres": self.nombres,
            "apellidos": self.apellidos,
            "correo": "",
            "nit": self.nit,
            "direccion": self.direccion,
            "fechacreacion": "",
        }
        respuesta = {
            "mensaje": "Error al modificar Cliente.",
            "estado": 0,
        }

        try:
            response = requests.put(url, data=json.dumps(data))
            if response.status_code == 200:
                respuesta = {
                    "mensaje": "Cliente Modificado Correctamente En El Sistema.",
                    "estado": 1,
                }
                return respuesta

        except Exception as e:
            print(f"Ocurrió un error: {e}")
            return respuesta

    def eliminarCliente(self):
        url = "http://127.0.0.1:8000/eliminarCliente/<id>"
        # urlfinal = f"{url}/{self.idproducto}"
        respuesta = {
            "mensaje": "Error al eliminar el cliente.",
            "estado": 0,
        }
        try:
            response = requests.delete(url, params={"id": self.id})
            if response.status_code == 200:
                respuesta = {
                    "mensaje": "Cliente Eliminado Correctamente.",
                    "estado": 1,
                }
            return respuesta
        except Exception as e:
            print(f"Ocurrió un error: {e}")
            return respuesta
