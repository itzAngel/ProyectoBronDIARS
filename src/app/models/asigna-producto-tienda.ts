import { DetalleProducto } from "./detalle-producto";
import { Tienda } from "./tienda";

export class AsignaProductoTienda {
    id_asigna_producto_tienda: number = null;
	detalleProducto: DetalleProducto = new DetalleProducto();
    tienda: Tienda = new Tienda();
    cantidad: number = null;
}
