import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from './usuario.service';
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent extends BaseComponent implements OnInit {

  usuario: Usuario = new Usuario();
  usuarios: Usuario[] = [];
  editar: boolean = false;
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,
    public router:Router, public route: ActivatedRoute,public service: UsuarioService) { 
      super(dialog,_snackBar,router,route);
  }

  ngOnInit(): void {
    this.listar();
    this.limpiar();
  }
  listar(){
    this.service.getList().subscribe(data => {
      this.usuarios = data;
    });
  }
  limpiar() {
    this.usuario = new Usuario();
  }

  validar() {
    if (this.usuario.dni_usuario != null && this.usuario.nombre != null &&  this.usuario.apellido != null && 
      this.usuario.email != null && this.usuario.privilegio != null && this.usuario.contrasena) {
      return true;
    } else {
      return false;
    }
  }

  agregar(){
    this.limpiar();
    this.editar = false;
  }

  Guardar(usuario: Usuario) {
    if (this.validar()) {
      this.service.createObj(usuario).subscribe(data => {
          this.listar();
          this.openSnackBar("usuario se agrego con exito");
          this.limpiar();
      });
    } else {
      this.openSnackBar("Llena todos los campos del usuario");
    }
  }

  Editar(usuario: Usuario):void {
    this.usuario=usuario;
    this.editar = true;
  }

  Actualizar() {
    if (this.validar()) {
      this.service.updateObj(this.usuario).subscribe(data => {
          this.openSnackBar("usuario se actualizo con exito");
          this.limpiar();
          this.editar = false;
      });
    } else {
      this.openSnackBar("Llena todos los campos del usuario");
    }
  }

  Eliminar(usuario: Usuario): void {
    this.service.deleteObj(usuario.id_usuario).subscribe(
      data => {
        this.usuarios = this.usuarios.filter(p => p !== usuario);
        this.openSnackBar("usuario se elimino con exito");
        this.agregar();
      },
      err => {
        this.openSnackBar("No se pudo eliminar el usuario, probablemente esté siendo usada en otro modulo");
      }
    );
  }

}
