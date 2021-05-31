import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { AsignaProductoTienda } from 'src/app/models/asigna-producto-tienda';
import { DetalleProducto } from 'src/app/models/detalle-producto';
import { Producto } from 'src/app/models/producto';
import { Tienda } from 'src/app/models/tienda';
import { DetalleProductoService } from '../detalle-producto/detalle-producto.service';
import { TiendaService } from '../tienda/tienda.service';
import { AsignaProductoTiendaService } from './asigna-producto-tienda.service';

@Component({
  selector: 'app-asigna-producto-tienda',
  templateUrl: './asigna-producto-tienda.component.html',
  styleUrls: ['./asigna-producto-tienda.component.css']
})
export class AsignaProductoTiendaComponent extends BaseComponent implements OnInit {

  asigna: AsignaProductoTienda = new AsignaProductoTienda();
  asignas: AsignaProductoTienda[] = [];
  editar: boolean = false;
  detalles: DetalleProducto[] = [];
  tiendas: Tienda[] = [];
  asignasBus: AsignaProductoTienda[] = [];
  detalleProdFiltro: DetalleProducto = null;
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,
    public router:Router, public route: ActivatedRoute,public service: AsignaProductoTiendaService,
     public detalleservice: DetalleProductoService,public tiendaservice: TiendaService) { 
      super(dialog,_snackBar,router,route);
  }

  ngOnInit(): void {
    this.detalleservice.getList().subscribe(data => {
      this.detalles = data;
    });
    this.tiendaservice.getList().subscribe(data => {
      this.tiendas = data;
    });
    this.listar();
    this.limpiar();
  }
  listar(){
    this.service.getList().subscribe(data => {
      this.asignas = data;
    });
  }
  limpiar() {
    this.asigna = new AsignaProductoTienda();
  }

  validar() {
    if (this.asigna.tienda.id_tienda != null && 
      this.asigna.detalleProducto.id_detalle_producto != null && this.asigna.cantidad != null) {
      return true;
    } else {
      return false;
    }
  }

  agregar(){
    this.limpiar();
    this.editar = false;
  }

  filtrar(){
    if(this.detalleProdFiltro == null){
      this.openSnackBar("Seleccione el producto para filtrar los almacenes");
    }else{
      this.service.getList().subscribe(data => {
        this.asignas = data;
        if(this.detalleProdFiltro != null){
          this.asignasBus=[];
          for (let obj of this.asignas) {
              if (obj.detalleProducto.id_detalle_producto == this.detalleProdFiltro.id_detalle_producto) {
                this.asignasBus.push(obj);
              };
          };
          this.asignas=this.asignasBus;
        }
      });
    }
  }

  limpiarFiltros(){
    this.detalleProdFiltro=null;
    this.listar();
  }
  Guardar(asigna: AsignaProductoTienda) {
    if (this.validar()) {
      this.detalleservice.getObjById(asigna.detalleProducto.id_detalle_producto).subscribe(data => {
          asigna.detalleProducto = data;
      });
      this.tiendaservice.getObjById(asigna.tienda.id_tienda).subscribe(data => {
          asigna.tienda = data;
      });
      this.service.createObj(asigna).subscribe(data => {
          this.listar();
          this.openSnackBar("asigna se agrego con exito");
          this.limpiar();
      });
    } else {
      this.openSnackBar("Llena todos los campos del asigna");
    }
  }

  Editar(asigna: AsignaProductoTienda):void {
    this.asigna=asigna;
    this.editar = true;
  }

  Actualizar(asigna: AsignaProductoTienda) {
    if (this.validar()) {
      this.detalleservice.getObjById(asigna.detalleProducto.id_detalle_producto).subscribe(data => {
          asigna.detalleProducto = data;
      });
      this.tiendaservice.getObjById(asigna.tienda.id_tienda).subscribe(data => {
          asigna.tienda = data;
      });
      this.service.updateObj(asigna).subscribe(data => {
          this.openSnackBar("asigna se actualizo con exito");
          this.limpiar();
          this.listar();
          this.editar = false;
      });
    } else {
      this.openSnackBar("Llena todos los campos del asigna");
    }
  }

  Eliminar(asigna: AsignaProductoTienda): void {
    this.service.deleteObj(asigna.id_asigna_producto_tienda).subscribe(
      data => {
        this.asignas = this.asignas.filter(p => p !== asigna);
        this.openSnackBar("asigna se elimino con exito");
        this.listar();
        this.agregar();
      },
      err => {
        this.openSnackBar("No se pudo eliminar el asigna, probablemente esté siendo usada en otro modulo");
      }
    );
  }

}
