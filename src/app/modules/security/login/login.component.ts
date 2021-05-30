import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { BaseService } from 'src/app/base/base.service';
import { Cliente } from 'src/app/models/cliente';
import { Usuario } from 'src/app/models/usuario';
import { ClientAuthServiceService } from 'src/app/services/auth/client-auth-service.service';
import { UserAuthServiceService } from 'src/app/services/auth/user-auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent implements OnInit {

  username:string = '';
  password:string = '';
  usernameClient:string = '';
  passwordClient:string = '';
  usuario: Usuario = new Usuario();
  cliente: Cliente = new Cliente();
  @Input() error: string | null;

  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,
    public router:Router, public route: ActivatedRoute, public userservice: UserAuthServiceService,
    public clientservice:ClientAuthServiceService, public baseService: BaseService) {
    super(dialog,_snackBar,router,route);
  }
  ngOnInit(): void {
    
  }
  check(){
    if(this.clientservice.isLoggedCliente){
      localStorage.removeItem('isLoggedCliente');
    }
    this.userservice.auth(this.username,this.password).subscribe(
      data => {
        this.usuario = data;
        if(this.usuario!=null){
          this.openSnackBar("Bienvenido " + this.usuario.nombre);
          this.router.navigate(['dashboard']);
          this.userservice.isLogged = true;
          localStorage.setItem('isLogged', JSON.stringify(this.userservice.isLogged));
        }else{
          this.openSnackBar("Usuario o contraseña incorrectos");
          this.userservice.isLogged = false;
        }
      },
      error => {
        this.openSnackBar("Usuario o contraseña incorrectos");
        this.userservice.isLogged = false;
      });
  }

  checkClient(){
    if(this.userservice.isLogged){
      localStorage.removeItem('isLogged');
    }
    this.clientservice.auth(this.usernameClient,this.passwordClient).subscribe(
      data => {
        this.cliente = data;
        if(this.cliente!=null){
          this.openSnackBar("Bienvenido " + this.cliente.nombre);
          this.router.navigate(['home']);
          this.clientservice.isLoggedCliente = true;
          this.clientservice.clienteSesion = this.cliente;
          localStorage.setItem('isLoggedCliente', JSON.stringify(this.clientservice.isLoggedCliente));
          localStorage.setItem('clienteSesion', JSON.stringify(this.clientservice.clienteSesion));
        }else{
          this.openSnackBar("Usuario o contraseña incorrectos");
          this.clientservice.isLoggedCliente = false;
        }
      },
      error => {
        this.openSnackBar("Usuario o contraseña incorrectos");
        this.clientservice.isLoggedCliente = false;
      });
  }

}
