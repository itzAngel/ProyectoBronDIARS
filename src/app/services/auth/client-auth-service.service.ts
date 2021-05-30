import { HttpClient } from '@angular/common/http';
import { CoreEnvironment } from '@angular/compiler/src/compiler_facade_interface';
import { Injectable } from '@angular/core';
import { Cliente } from 'src/app/models/cliente';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientAuthServiceService {

  enviroment : CoreEnvironment; 
  urlbase = environment.url;
  Url=this.urlbase + "/cliente/login";
  isLoggedCliente:boolean = false;
  clienteSesion: Cliente = new Cliente();
  constructor(public http:HttpClient) { }

  auth(user: string, pass: string){
    return this.http.get<Cliente>(this.Url+"/"+user+"/"+pass);
  }

}
