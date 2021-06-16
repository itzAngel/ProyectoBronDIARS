import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { Queja } from 'src/app/models/queja';
import { Venta } from 'src/app/models/venta';
import { SendEmailService } from 'src/app/services/email/send-email.service';
import { VentaService } from '../venta/venta.service';
import { QuejaService } from './queja.service';

@Component({
  selector: 'app-queja',
  templateUrl: './queja.component.html',
  styleUrls: ['./queja.component.css']
})
export class QuejaComponent extends BaseComponent implements OnInit {
  esListar: boolean = true;
  queja: Queja = new Queja();
  quejas: Queja[] = [];
  ventas: Venta[] = [];
  editar: boolean = false;
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,
    public router:Router, public route: ActivatedRoute,public service: QuejaService,public ventaservice: VentaService,
    public emailService: SendEmailService) { 
      super(dialog,_snackBar,router,route);
  }

  ngOnInit(): void {
    this.checkLogin();
    this.listar();
    this.limpiar();
    
  }
  listar(){
    var quejasListAux: Queja[] = [];
    var ventasListAux: Venta[] = [];
    if(this.loggeadoClient){
        this.service.getList().subscribe(data => {
          this.quejas = data;
          this.quejas.forEach(element => {
            if(element.venta.cliente.id_cliente == this.clienteSesion.id_cliente){
              quejasListAux.push(element);
            }
          });
          this.quejas = quejasListAux;
        });
        this.ventaservice.getList().subscribe(data => {
          this.ventas = data;
          this.ventas.forEach(element => {
            if(element.cliente.id_cliente == this.clienteSesion.id_cliente){
              ventasListAux.push(element);
            }
          });
          this.ventas = ventasListAux;
        });
    }else{
      this.service.getList().subscribe(data => {
        this.quejas = data;
      });
      this.ventaservice.getList().subscribe(data => {
        this.ventas = data;
      });
    }
    this.esListar=true;
  }
  limpiar() {
    this.queja = new Queja();
  }

  validar() {
    if (this.queja.queja != null && this.queja.venta.id_venta != null) {
      return true;
    } else {
      return false;
    }
  }

  agregar(){
    this.limpiar();
    this.esListar = false;
    this.editar = false;
  }

  Guardar(queja: Queja) {
    queja.fecha = new Date;
    if (this.validar()) {
      this.ventaservice.getObjById(queja.venta.id_venta).subscribe(data => {
        queja.venta = data;
      });
      this.service.createObj(queja).subscribe(data => {
          this.listar();
          this.openSnackBar("queja se agrego con exito");
          this.limpiar();
      });
      this.emailService.enviarCorreoQueja(this.clienteSesion.correo).subscribe(data =>{
        this.openSnackBar(data);
      });
    } else {
      this.openSnackBar("Llena todos los campos de la queja");
    }
  }

  Editar(queja: Queja):void {
    this.queja=queja;
    this.editar = true;
    this.esListar = false;
  }

  Actualizar() {
    if (this.validar()) {
      this.ventaservice.getObjById(this.queja.venta.id_venta).subscribe(data => {
        this.queja.venta = data;
      });
      this.service.updateObj(this.queja).subscribe(data => {
          this.openSnackBar("queja se actualizo con exito");
          this.limpiar();
          this.editar = false;
          this.listar();
      });
    } else {
      this.openSnackBar("Llena todos los campos de la queja");
    }
  }

  Eliminar(queja: Queja): void {
    this.service.deleteObj(queja.id_queja).subscribe(
      data => {
        this.quejas = this.quejas.filter(p => p !== queja);
        this.openSnackBar("queja se elimino con exito");
        this.listar();
      },
      err => {
        this.openSnackBar("No se pudo eliminar la queja, probablemente esté siendo usada en otro modulo");
      }
    );
  }


}
