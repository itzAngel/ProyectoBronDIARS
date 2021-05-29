import { AsignaProductoTienda } from "./asigna-producto-tienda";
import { Venta } from "./venta";

export class DetalleVenta {
    id_detalle_venta: number = null;
	cantidad: number = null;
    precio: number = null;
    venta: Venta = new Venta();
    asignaProductoTienda: AsignaProductoTienda = new AsignaProductoTienda();
}
