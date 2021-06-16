import { Venta } from "./venta";

export class Queja {
    id_queja: number = null;
    queja:string = null;
    fecha: Date = null;
	venta: Venta = new Venta();
}