import { Producto } from "./producto";

export class DetalleProducto {
    id_detalle_producto: number = null;
    producto: Producto = new Producto();
	talla: number = null;
    color: string = null;
    descripcion: string = null;
}
