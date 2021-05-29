import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { DetalleProducto } from 'src/app/models/detalle-producto';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from '../producto/producto.service';
import { DetalleProductoService } from './detalle-producto.service';
@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent extends BaseComponent implements OnInit {

  detalleProducto: DetalleProducto = new DetalleProducto();
  detalleProductos: DetalleProducto[] = [];
  editar: boolean = false;
  productos: Producto[] = [];
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,
    public router:Router, public route: ActivatedRoute,public service: DetalleProductoService,
     public productoservice: ProductoService) { 
      super(dialog,_snackBar,router,route);
  }

  ngOnInit(): void {
    this.productoservice.getList().subscribe(data => {
      this.productos = data;
    });
    this.listar();
    this.limpiar();
  }
  listar(){
    this.service.getList().subscribe(data => {
      this.detalleProductos = data;
    });
  }
  limpiar() {
    this.detalleProducto = new DetalleProducto();
  }

  validar() {
    if (this.detalleProducto.producto.id_producto != null && 
      this.detalleProducto.talla != null && this.detalleProducto.color != null && 
      this.detalleProducto.descripcion != null) {
      return true;
    } else {
      return false;
    }
  }

  agregar(){
    this.limpiar();
    this.editar = false;
  }

  Guardar(detalleProducto: DetalleProducto) {
    if (this.validar()) {
      this.productoservice.getObjById(detalleProducto.producto.id_producto).subscribe(data => {
          detalleProducto.producto = data;
      });
      this.service.createObj(detalleProducto).subscribe(data => {
          this.listar();
          this.openSnackBar("detalleProducto se agrego con exito");
          this.limpiar();
      });
    } else {
      this.openSnackBar("Llena todos los campos del detalleProducto");
    }
  }

  Editar(detalleProducto: DetalleProducto):void {
    this.detalleProducto=detalleProducto;
    this.editar = true;
  }

  Actualizar(detalleProducto: DetalleProducto) {
    if (this.validar()) {
      this.productoservice.getObjById(detalleProducto.producto.id_producto).subscribe(data => {
        detalleProducto.producto = data;
    });
      this.service.updateObj(detalleProducto).subscribe(data => {
          this.openSnackBar("detalleProducto se actualizo con exito");
          this.limpiar();
          this.editar = false;
      });
    } else {
      this.openSnackBar("Llena todos los campos del detalleProducto");
    }
  }

  Eliminar(detalleProducto: DetalleProducto): void {
    this.service.deleteObj(detalleProducto.id_detalle_producto).subscribe(
      data => {
        this.detalleProductos = this.detalleProductos.filter(p => p !== detalleProducto);
        this.openSnackBar("detalleProducto se elimino con exito");
        this.agregar();
      },
      err => {
        this.openSnackBar("No se pudo eliminar el detalleProducto, probablemente esté siendo usada en otro modulo");
      }
    );
  }

}
