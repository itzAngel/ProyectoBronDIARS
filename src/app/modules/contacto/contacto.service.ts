import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/base/base.service';
import { Contacto } from 'src/app/models/contacto';

@Injectable({
  providedIn: 'root'
})
export class ContactoService extends BaseService{

  contacto:Contacto = new Contacto();
  constructor(public http: HttpClient,public router : Router) {
    super(http,router);
    this.Url = this.Url + "contacto"
  }
}
