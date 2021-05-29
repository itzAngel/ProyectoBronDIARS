import { Usuario } from "./usuario";

export class Tienda {
    id_tienda: number = null;
	nombre_tienda: string = null;
    distrito: string = null;
    usuario: Usuario = new Usuario();
}
