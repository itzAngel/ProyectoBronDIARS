import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/base/base.service';
import { Categoria } from 'src/app/models/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService extends BaseService{
  categoria:Categoria = new Categoria();
  constructor(public http: HttpClient,public router : Router) {
    super(http,router);
    this.Url = this.Url + "categoria"
  }
}
