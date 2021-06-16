import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/base/base.service';
import { Queja } from 'src/app/models/queja';

@Injectable({
  providedIn: 'root'
})
export class QuejaService extends BaseService{

  queja:Queja = new Queja();
  constructor(public http: HttpClient,public router : Router) {
    super(http,router);
    this.Url = this.Url + "queja"
  }
}
