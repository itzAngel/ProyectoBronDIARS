import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from './cliente.service';
@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent extends BaseComponent implements OnInit {

  cliente: Cliente = new Cliente();
  clientes: Cliente[] = [];
  editar: boolean = false;
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,
    public router:Router, public route: ActivatedRoute,public service: ClienteService) { 
      super(dialog,_snackBar,router,route);
  }

  ngOnInit(): void {
    this.listar();
    this.limpiar();
  }
  listar(){
    this.service.getList().subscribe(data => {
      this.clientes = data;
    });
  }
  limpiar() {
    this.cliente = new Cliente();
  }

  validar() {
    if (this.cliente.dni_cliente != null && this.cliente.nombre != null &&  this.cliente.apellido != null && 
      this.cliente.telefono != null && this.cliente.provincia != null && this.cliente.distrito != null && 
      this.cliente.direccion != null && this.cliente.contrasena && this.cliente.correo) {
      return true;
    } else {
      return false;
    }
  }

  agregar(){
    this.limpiar();
    this.editar = false;
  }

  Guardar(cliente: Cliente) {
    if (this.validar()) {
      this.service.createObj(cliente).subscribe(data => {
          this.listar();
          this.openSnackBar("cliente se agrego con exito");
          this.limpiar();
      });
    } else {
      this.openSnackBar("Llena todos los campos del cliente");
    }
  }

  Editar(cliente: Cliente):void {
    this.cliente=cliente;
    this.editar = true;
  }

  Actualizar() {
    if (this.validar()) {
      this.service.updateObj(this.cliente).subscribe(data => {
          this.openSnackBar("Categoria se actualizo con exito");
          this.limpiar();
          this.editar = false;
      });
    } else {
      this.openSnackBar("Llena todos los campos de la categoria");
    }
  }

  Eliminar(cliente: Cliente): void {
    this.service.deleteObj(cliente.id_cliente).subscribe(
      data => {
        this.clientes = this.clientes.filter(p => p !== cliente);
        this.openSnackBar("cliente se elimino con exito");
        this.agregar();
      },
      err => {
        this.openSnackBar("No se pudo eliminar el cliente, probablemente esté siendo usada en otro modulo");
      }
    );
  }

}
