import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  Url=environment.url;
  constructor(public http: HttpClient,public router : Router) {
  }
  getList(){
    return this.http.get<any[]>(this.Url);
  }
  createObj(obj: any){
    return this.http.post<any>(this.Url,obj);
  }
  getObjById(id: number){
    return this.http.get<any>(this.Url+"/"+id);
  }
  updateObj(obj: any){
    return this.http.put<any>(this.Url,obj);
  }
  deleteObj(id: number){
    return this.http.delete(this.Url + "/" + id);
  }

  generarPk(){
      return Math.floor((Math.random() * (9999999999 - 1 + 1)) + 1);
  }
}
