import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/base/base.service';
import { Venta } from 'src/app/models/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService extends BaseService{

  venta:Venta = new Venta();
  constructor(public http: HttpClient,public router : Router) {
    super(http,router);
    this.Url = this.Url + "venta"
  }

  listarxCliente(id:number){
    return this.http.get<Venta[]>(this.Url + "/listarxCliente/" + id);
  }
}
