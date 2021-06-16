import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { Contacto } from 'src/app/models/contacto';
import { ContactoService } from './contacto.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent extends BaseComponent implements OnInit {

  contacto: Contacto = new Contacto();
  contactos: Contacto[] = [];
  editar: boolean = false;
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,
    public router:Router, public route: ActivatedRoute,public service: ContactoService) { 
      super(dialog,_snackBar,router,route);
  }

  ngOnInit(): void {
    this.listar();
    this.limpiar();
  }
  listar(){
    this.service.getList().subscribe(data => {
      this.contactos = data;
    });
  }
  limpiar() {
    this.contacto = new Contacto();
  }

  validar() {
    if (this.contacto.nombre != null && this.contacto.correo != null && this.contacto.mensaje != null) {
      return true;
    } else {
      return false;
    }
  }

  agregar(){
    this.limpiar();
    this.editar = false;
  }

  Guardar(contacto: Contacto) {
    if (this.validar()) {
      this.service.createObj(contacto).subscribe(data => {
          this.listar();
          this.openSnackBar("contacto se agrego con exito");
          this.limpiar();
      });
    } else {
      this.openSnackBar("Llena todos los campos de la contacto");
    }
  }

  Editar(contacto: Contacto):void {
    this.contacto=contacto;
    this.editar = true;
  }

  Actualizar() {
    if (this.validar()) {
      this.service.updateObj(this.contacto).subscribe(data => {
          this.openSnackBar("contacto se actualizo con exito");
          this.limpiar();
          this.editar = false;
      });
    } else {
      this.openSnackBar("Llena todos los campos de la contacto");
    }
  }

  Eliminar(contacto: Contacto): void {
    this.service.deleteObj(contacto.id_contacto).subscribe(
      data => {
        this.contactos = this.contactos.filter(p => p !== contacto);
        this.openSnackBar("contacto se elimino con exito");
        this.agregar();
      },
      err => {
        this.openSnackBar("No se pudo eliminar la contacto, probablemente esté siendo usada en otro modulo");
      }
    );
  }

}
