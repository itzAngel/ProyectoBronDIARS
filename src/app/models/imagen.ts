import { Producto } from "./producto";

export class Imagen {
    id_imagen: number = null;
    producto: Producto = new Producto();
    base64: string = null;
	contentType: string = null;
}
