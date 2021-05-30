import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/base/base.service';
import { Categoria } from 'src/app/models/categoria';
import { Producto } from 'src/app/models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends BaseService{
  listaCarrito: Producto[] = [];
  producto:Producto = new Producto();
  constructor(public http: HttpClient,public router : Router) {
    super(http,router);
    this.Url = this.Url + "producto"
  }

  listarxModelo(modelo:string){
    return this.http.get<Producto[]>(this.Url + "/listarxModelo/" + modelo);
  }

  listarxCategoria(categoria:Categoria){
    return this.http.put<Producto[]>(this.Url + "/listarxCategoria/",categoria);
  }

}
