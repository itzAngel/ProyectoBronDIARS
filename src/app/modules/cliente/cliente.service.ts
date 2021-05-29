import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/base/base.service';
import { Cliente } from 'src/app/models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends BaseService{

  cliente:Cliente = new Cliente();
  constructor(public http: HttpClient,public router : Router) {
    super(http,router);
    this.Url = this.Url + "cliente"
  }
}
