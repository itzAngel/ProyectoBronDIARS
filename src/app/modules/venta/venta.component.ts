import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { Cliente } from 'src/app/models/cliente';
import { DetalleVenta } from 'src/app/models/detalle-venta';
import { Venta } from 'src/app/models/venta';
import { ClienteService } from '../cliente/cliente.service';
import { DetalleVentaService } from '../detalle-venta/detalle-venta.service';
import { VentaService } from './venta.service';
@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent extends BaseComponent implements OnInit {
  esListar: boolean = true;
  venta: Venta = new Venta();
  ventas: Venta[] = [];
  detalles: DetalleVenta[] = [];
  clientes: Cliente[] = [];
  editar: boolean = false;

  ventasBus: Venta[] = [];
  da1: Date=null;
  da2: Date=null;
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,
    public router:Router, public route: ActivatedRoute,public service: VentaService,
    public clienteService: ClienteService,public detservice: DetalleVentaService) { 
      super(dialog,_snackBar,router,route);
  }

  ngOnInit(): void {
    this.clienteService.getList().subscribe(data => {
      this.clientes = data;
    });
    this.detservice.getList().subscribe(data => {
      this.detalles = data;
    });
    this.listar();
    this.limpiar();
  }

  listar(){
    this.esListar=true;
    //lleno ventas
    this.service.getList().subscribe(data => {
      this.ventas = data;
      //lleno detalles de cada venta
      this.ventas.forEach(element => {
        this.detservice.obtenerlistaporid(element.id_venta).subscribe(data => {
          element.listaDetalleVenta = data;
        });
      });
    });
  }
  limpiar() {
    this.venta = new Venta();
  }
  filtrar(){
    if (this.da1 === null || this.da2 === null){
      this.openSnackBar("Seleccione el producto para filtrar los almacenes");
    }else{
      this.ventasBus=[];
      for (let obj of this.ventas) {
        var res = new Date(this.da1).getTime() < new Date(obj.fecha_venta).getTime();
        var res2 = new Date(this.da2).getTime() > new Date(obj.fecha_venta).getTime();
        if (res) {
          if(res2){
            this.ventasBus.push(obj);
          }
        };
      };
      this.ventas=this.ventasBus;
    }
  }

  limpiarFiltros(){
    this.da1=null;
    this.da2=null;
    this.listar();
  }
  validar() {
    if (this.venta.cliente.id_cliente != null && this.venta.direccion!=null && 
      this.venta.nombre_persona_recibe!=null && this.venta.apellido_persona_recibe!=null && 
      this.venta.metodo_pago!=null && this.venta.comprobante_pago!=null) {
      return true;
    } else {
      return false;
    }
  }

  agregar(){
    this.esListar=false;
    this.limpiar();
    this.editar = false;
    this.venta.id_venta = null;
  }

  Guardar(venta: Venta) {
    venta.fecha_venta = new Date;
    venta.precio_total = 0;
    venta.listaDetalleVenta = [];
    venta.fecha_entrega.setDate(venta.fecha_venta.getDate() + 5);
    /*
    this.detalles.forEach(element => {
      this.venta.precio_total += element.cantidad * element.precio;
    });*/
    if (this.validar()) {
      this.clienteService.getObjById(venta.cliente.id_cliente).subscribe(data => {
        venta.cliente = data;
      });
      this.service.createObj(venta).subscribe(data => {
          this.listar();
          this.openSnackBar("venta se agrego con exito");
          this.limpiar();
      });
    } else {
      this.openSnackBar("Llena todos los campos del venta");
    }
  }

  Editar(venta: Venta):void {
    this.esListar=false;
    this.venta=venta;
    this.editar = true;
  }

  Actualizar(venta: Venta) {
    if (this.validar()) {
      this.clienteService.getObjById(venta.cliente.id_cliente).subscribe(data => {
        venta.cliente = data;
      });
      this.service.updateObj(this.venta).subscribe(data => {
          this.listar();
          this.openSnackBar("venta se actualizo con exito");
          this.limpiar();
          this.editar = false;
      });
    } else {
      this.openSnackBar("Llena todos los campos del venta");
    }
  }

  Eliminar(venta: Venta): void {
    this.service.deleteObj(venta.id_venta).subscribe(
      data => {
        this.ventas = this.ventas.filter(p => p !== venta);
        this.openSnackBar("venta se elimino con exito");
        this.listar();
      },
      err => {
        this.openSnackBar("No se pudo eliminar el venta, probablemente est?? siendo usada en otro modulo");
      }
    );
  }

  EliminarDetalle(detalleVenta: DetalleVenta): void {
    this.service.deleteObj(detalleVenta.id_detalle_venta).subscribe(
      data => {
        this.detalles = this.detalles.filter(p => p !== detalleVenta);
        this.openSnackBar("detalleVenta se elimino con exito");
        this.agregar();
      },
      err => {
        this.openSnackBar("No se pudo eliminar el detalleVenta, probablemente est?? siendo usada en otro modulo");
      }
    );
  }

  modelChangeFn(e) {
    this.da1 = e;
  }

  modelChangeFn2(e) {
      this.da2 = e;
  }

}
