import requests
import json

class Producto:
    def __init__(self) -> None:
        pass

    def ConsProducto(
        self,
        idproducto,
        nombre,
        descripcion,
        imagen,
        idcategoria,
        cantidad,
        preciocompra,
        precioventa,
        fechacreacion,
    ):
        self.idproducto = idproducto
        self.nombre = nombre
        self.descripcion = descripcion
        self.imagen = imagen
        self.idcategoria = idcategoria
        self.cantidad = cantidad
        self.preciocompra = preciocompra
        self.precioventa = precioventa
        self.fechacreacion = fechacreacion

    def agregarProducto(self):
        url = "http://127.0.0.1:8000/crearProducto"
        data = {
            {
                "id": 0,
                "nombre": self.nombre,
                "descripcion": self.descripcion,
                "imagen": self.imagen,
                "idcategoria": self.idcategoria,
                "cantidad": self.cantidad,
                "preciocompra": self.preciocompra,
                "precioventa": 0,
                "fechacreacion": "",
            }
        }
        respuesta = {
            "mensaje": "Error al agregar producto.",
            "estado": 0,
        }

        try:
            response = requests.post(url, data=json.dumps(data))
            if response.status_code == 200:
                respuesta = {
                    "mensaje": "Producto Agregado Correctamente Al Sistema.",
                    "estado": 1,
                }
                return respuesta

        except Exception as e:
            print(f"Ocurrió un error: {e}")
            return respuesta

    def modificarPrpoducto(self):
        url = "http://127.0.0.1:8000/modificarProducto"
        data = {
               "id": self.idproducto,
                "nombre": self.nombre,
                "descripcion": self.descripcion,
                "imagen": self.imagen,
                "idcategoria": self.idcategoria,
                "cantidad": self.cantidad,
                "preciocompra": self.preciocompra,
                "precioventa": 0,
                "fechacreacion": "",
        }
        respuesta = {
            "mensaje": "Error al modificar producto.",
            "estado": 0,
        }

        try:
            response = requests.put(url, data=json.dumps(data))
            if response.status_code == 200:
                respuesta = {
                    "mensaje": "Producto Modificado Correctamente En El Sistema.",
                    "estado": 1,
                }
                return respuesta

        except Exception as e:
            print(f"Ocurrió un error: {e}")
            return respuesta

    def eliminarProducto(self):
        url = "http://127.0.0.1:8000/eliminarProducto/<id>"
        urlfinal = f"{url}/{self.idproducto}"
        respuesta = {
            "mensaje": "Error al eliminar el producto.",
            "estado": 0,
        }
        try:
            response = requests.delete(urlfinal)
            if response.status_code == 200:
                respuesta = {
                    "mensaje": "Producto Eliminado Correctamente.",
                    "estado": 1,
                }
            return respuesta
        except Exception as e:
            print(f"Ocurrió un error: {e}")
            return respuesta
