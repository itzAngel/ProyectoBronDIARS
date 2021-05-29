import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/base/base.service';
import { Usuario } from 'src/app/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends BaseService{

  usuario:Usuario = new Usuario();
  constructor(public http: HttpClient,public router : Router) {
    super(http,router);
    this.Url = this.Url + "usuario"
  }
}
