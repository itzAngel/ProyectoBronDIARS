import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/base/base.service';
import { Tienda } from 'src/app/models/tienda';

@Injectable({
  providedIn: 'root'
})
export class TiendaService extends BaseService{

  tienda:Tienda = new Tienda();
  constructor(public http: HttpClient,public router : Router) {
    super(http,router);
    this.Url = this.Url + "tienda"
  }
}
