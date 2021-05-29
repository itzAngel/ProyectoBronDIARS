import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { Tienda } from 'src/app/models/tienda';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from '../usuario/usuario.service';
import { TiendaService } from './tienda.service';
@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent extends BaseComponent implements OnInit {

  tienda: Tienda = new Tienda();
  tiendas: Tienda[] = [];
  usuarios: Usuario[] = [];
  editar: boolean = false;
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,
    public router:Router, public route: ActivatedRoute,public service: TiendaService,
    public usuarioService: UsuarioService) { 
      super(dialog,_snackBar,router,route);
  }

  ngOnInit(): void {
    this.usuarioService.getList().subscribe(data => {
      this.usuarios = data;
    });
    this.listar();
    this.limpiar();
  }
  listar(){
    this.service.getList().subscribe(data => {
      this.tiendas = data;
    });
  }
  limpiar() {
    this.tienda = new Tienda();
  }

  validar() {
    if (this.tienda.nombre_tienda != null && this.tienda.distrito != null &&  
      this.tienda.usuario.id_usuario) {
      return true;
    } else {
      return false;
    }
  }

  agregar(){
    this.limpiar();
    this.editar = false;
  }

  Guardar(tienda: Tienda) {
    if (this.validar()) {
      this.usuarioService.getObjById(tienda.usuario.id_usuario).subscribe(data => {
        tienda.usuario = data;
      });
      this.service.createObj(tienda).subscribe(data => {
          this.listar();
          this.openSnackBar("tienda se agrego con exito");
          this.limpiar();
      });
    } else {
      this.openSnackBar("Llena todos los campos del tienda");
    }
  }

  Editar(tienda: Tienda):void {
    this.tienda=tienda;
    this.editar = true;
  }

  Actualizar(tienda: Tienda) {
    if (this.validar()) {
      this.usuarioService.getObjById(tienda.usuario.id_usuario).subscribe(data => {
        tienda.usuario = data;
      });
      this.service.updateObj(this.tienda).subscribe(data => {
          this.openSnackBar("tienda se actualizo con exito");
          this.limpiar();
          this.editar = false;
      });
    } else {
      this.openSnackBar("Llena todos los campos de la tienda");
    }
  }

  Eliminar(tienda: Tienda): void {
    this.service.deleteObj(tienda.id_tienda).subscribe(
      data => {
        this.tiendas = this.tiendas.filter(p => p !== tienda);
        this.openSnackBar("tienda se elimino con exito");
        this.agregar();
      },
      err => {
        this.openSnackBar("No se pudo eliminar la tienda, probablemente esté siendo usada en otro modulo");
      }
    );
  }

}
