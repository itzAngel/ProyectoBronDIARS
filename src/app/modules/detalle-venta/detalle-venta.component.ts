import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';
import { BaseComponent } from 'src/app/base/base.component';
import { AsignaProductoTienda } from 'src/app/models/asigna-producto-tienda';
import { DetalleVenta } from 'src/app/models/detalle-venta';
import { Venta } from 'src/app/models/venta';
import { AsignaProductoTiendaService } from '../asigna-producto-tienda/asigna-producto-tienda.service';
import { VentaService } from '../venta/venta.service';
import { DetalleVentaService } from './detalle-venta.service';
import { TiendaService } from '../tienda/tienda.service';
import { DetalleProductoService } from '../detalle-producto/detalle-producto.service';
@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrls: ['./detalle-venta.component.css']
})
export class DetalleVentaComponent extends BaseComponent implements OnInit {
  @Input() esExterno: boolean = false;
  @Input() idExterno: number = 0;
  @Output() newItemEvent = new EventEmitter<DetalleVenta>();
  detalleVenta: DetalleVenta = new DetalleVenta();
  detalleVentas: DetalleVenta[] = [];
  ventas: Venta[] = [];
  asignaSelected: AsignaProductoTienda = new AsignaProductoTienda();
  asignaProductoTiendas: AsignaProductoTienda[] = [];
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,
    public router:Router, public route: ActivatedRoute,public service: DetalleVentaService,
     public ventasservice: VentaService, public asignaProductoTiendaservice: AsignaProductoTiendaService,
     public detalleservice: DetalleProductoService,public tiendaservice: TiendaService) { 
      super(dialog,_snackBar,router,route);
  }

  ngOnInit(): void {
    this.ventasservice.getList().subscribe(data => {
      this.ventas = data;
    });
    this.asignaProductoTiendaservice.getList().subscribe(data => {
      this.asignaProductoTiendas = data;
    });
    this.listar();
    this.limpiar();
  }

  addNewItem(value: DetalleVenta) {
    this.newItemEvent.emit(value);
  }

  listar(){
    this.detalleVentas = [];
    if(this.esExterno){
      this.service.obtenerlistaporid(this.idExterno).subscribe(data => {
        this.detalleVentas = data;
      });
    }else{
      this.service.getList().subscribe(data => {
        this.detalleVentas = data;
      });
    }
  }
  limpiar() {
    this.detalleVenta = new DetalleVenta();
    this.asignaSelected = new AsignaProductoTienda();
  }

  validar() {
    if (this.detalleVenta.asignaProductoTienda.id_asigna_producto_tienda != null && 
      this.detalleVenta.cantidad != null && this.detalleVenta.precio != null && 
      this.detalleVenta.venta.id_venta != null) {
      return true;
    } else {
      return false;
    }
  }

  agregar(){
    this.limpiar();
  }

  Guardar(detalleVenta: DetalleVenta) {
    if (this.validar()) {
      if(detalleVenta.cantidad>this.asignaSelected.cantidad){ //si la cantidad comprada es mayor al stock
        this.openSnackBar("La cantidad que quiere comprar excede al stock de producto actualmente");
      }else if(detalleVenta.cantidad <=0){
        this.openSnackBar("La cantidad debe ser mayor a 0");
      }else{
          this.asignaProductoTiendaservice.getObjById(detalleVenta.asignaProductoTienda.id_asigna_producto_tienda).subscribe(data => {
            detalleVenta.asignaProductoTienda = data;
              this.ventasservice.getObjById(detalleVenta.venta.id_venta).subscribe(data => {
                  detalleVenta.venta = data;
                  console.log(detalleVenta)
                  this.service.createObj(detalleVenta).subscribe(data => {
                      this.listar();
                      this.openSnackBar("detalleVenta se agrego con exito");
                      this.limpiar();
                  });
              });
          });
      }
    } else {
      this.openSnackBar("Llena todos los campos del detalleVenta");
    }
  }

  Eliminar(detalleVenta: DetalleVenta): void {
    this.service.deleteObj(detalleVenta.id_detalle_venta).subscribe(
      data => {
        this.listar();
        this.openSnackBar("detalleVenta se elimino con exito");
        this.agregar();
      },
      err => {
        this.openSnackBar("No se pudo eliminar el detalleVenta, probablemente esté siendo usada en otro modulo");
      }
    );
  }

  modelChangeFn(e) {
    this.asignaProductoTiendaservice.getObjById(e).subscribe(data => {
      this.asignaSelected = data;
    });
    
  }

}
