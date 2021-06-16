import { HttpClient } from '@angular/common/http';
import { CoreEnvironment } from '@angular/compiler/src/compiler_facade_interface';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SendEmailService {

  enviroment : CoreEnvironment; 
  urlbase = environment.url;
  Url=this.urlbase + "sendEmail";
  constructor(public http:HttpClient) { }

  enviarCorreoCompra(email: string){
    return this.http.post<string>(this.Url+"/confirmacionCompra",email);
  }

  enviarCorreoQueja(email: string){
    return this.http.post<string>(this.Url+"/confirmacionQueja",email);
  }
}
