import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/base/base.service';
import { DetalleProducto } from 'src/app/models/detalle-producto';

@Injectable({
  providedIn: 'root'
})
export class DetalleProductoService extends BaseService{

  detalleProducto:DetalleProducto = new DetalleProducto();
  listaDetallesCarrito: DetalleProducto[] = [];
  constructor(public http: HttpClient,public router : Router) {
    super(http,router);
    this.Url = this.Url + "detalleproducto"
  }

  obtenerlistaporid(id:number){
    return this.http.get<DetalleProducto[]>(this.Url + "/obtenerlistaporid/" + id);
  }
}
