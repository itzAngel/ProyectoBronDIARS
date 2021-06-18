import { Categoria } from "./categoria";
import { DetalleProducto } from "./detalle-producto";
import { DetalleVenta } from "./detalle-venta";
import { Imagen } from "./imagen";

export class Producto {
    id_producto: number = null;
	modelo: string = null;
	genero: string = null;
    precio: number = null;
    categoria: Categoria = new Categoria();
    foto: string = null;
    listaDetalleProducto: DetalleProducto[] = [];
    listaImagen: Imagen[] = [];
    listaDetalleVenta: DetalleVenta[] = [];
}
