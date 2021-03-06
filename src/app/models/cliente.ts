import { Venta } from "./venta";

export class Cliente {
    id_cliente: number = null;
    dni_cliente: string = null;
	nombre: string = null;
	apellido: string = null;
    telefono: string = null;
	provincia: string = null;
    distrito: string = null;
	direccion: string = null;
    contrasena: string = null;
    correo: string = null;
    listaVentas: Venta[] = [];
    cantidadCompras: number = 0;
    totalCompra: number = 0;
}
