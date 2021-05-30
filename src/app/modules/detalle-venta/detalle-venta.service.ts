import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/base/base.service';
import { DetalleVenta } from 'src/app/models/detalle-venta';

@Injectable({
  providedIn: 'root'
})
export class DetalleVentaService extends BaseService{

  detalleVenta:DetalleVenta = new DetalleVenta();
  listaDetallesCarrito: DetalleVenta[] = [];
  constructor(public http: HttpClient,public router : Router) {
    super(http,router);
    this.Url = this.Url + "detalleventa"
  }

  obtenerlistaporid(id:number){
    return this.http.get<DetalleVenta[]>(this.Url + "/obtenerlistaporid/" + id);
  }
}
