import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/base/base.service';
import { AsignaProductoTienda } from 'src/app/models/asigna-producto-tienda';

@Injectable({
  providedIn: 'root'
})
export class AsignaProductoTiendaService extends BaseService{

  asignaProductoTienda:AsignaProductoTienda = new AsignaProductoTienda();
  listaAsignaFinal: AsignaProductoTienda[] = [];
  constructor(public http: HttpClient,public router : Router) {
    super(http,router);
    this.Url = this.Url + "asignaproductotienda"
  }

  obtenerlistaporid(id:number){
    return this.http.get<AsignaProductoTienda[]>(this.Url + "/obtenerlistaporid/" + id);
  }
  obtenerlistaporidDetalleProducto(id:number){
    return this.http.get<AsignaProductoTienda[]>(this.Url + "/obtenerlistaporidDetalleProducto/" + id);
  }
}
