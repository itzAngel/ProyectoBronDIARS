import { Cliente } from "./cliente";
import { DetalleVenta } from "./detalle-venta";

export class Venta {
    id_venta: number = null;
    fecha_venta: Date = null;
    precio_total: number = null;
	cliente: Cliente = new Cliente();
    listaDetalleVenta: DetalleVenta[] = [];
}
