import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/base/base.service';
import { Imagen } from 'src/app/models/imagen';

@Injectable({
  providedIn: 'root'
})
export class ImagenService extends BaseService{

  imagen:Imagen = new Imagen();
  constructor(public http: HttpClient,public router : Router) {
    super(http,router);
    this.Url = this.Url + "imagen"
  }

  obtenerlistaporid(id:number){
    return this.http.get<Imagen[]>(this.Url + "/obtenerlistaporid/" + id);
  }
}
