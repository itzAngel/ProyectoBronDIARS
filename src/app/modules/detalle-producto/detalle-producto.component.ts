import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { DetalleProducto } from 'src/app/models/detalle-producto';
import { Producto } from 'src/app/models/producto';
import { AsignaProductoTiendaService } from '../asigna-producto-tienda/asigna-producto-tienda.service';
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
  detalleProductosxListaCarrito: DetalleProducto[] = [];
  detalleProdParaCarrito: DetalleProducto = new DetalleProducto();
  editar: boolean = false;
  productos: Producto[] = [];
  @Input("externo") 
  externo: boolean = false;
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,
    public router:Router, public route: ActivatedRoute,public service: DetalleProductoService,
     public productoservice: ProductoService, public asignaService: AsignaProductoTiendaService) { 
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
    if(this.externo){
      var lista: DetalleProducto[] = [];
      this.productoservice.listaCarrito.forEach(prod => { //cada producto del carrito
        this.service.obtenerlistaporid(prod.id_producto).subscribe(data =>{ //obtengo sus detalles
          lista = data;
          lista.forEach(element => { 
            this.detalleProductosxListaCarrito.push(element); //pusheo cada detalle a la lista para eleccion
          });
        });
      });
    }
  }
  GuardarDetalleParaCarrito(detalleProducto: DetalleProducto){
    if(detalleProducto.id_detalle_producto != null){
        var exec: boolean = true;
        this.service.listaDetallesCarrito.forEach(element => {
          if(element.id_detalle_producto == detalleProducto.id_detalle_producto){
            exec = false;
          }
        });
        if(exec){
          this.service.listaDetallesCarrito.push(detalleProducto);
        }else{
          this.openSnackBar("Ya agregó ese producto con esas caracteristicas");
        }
        this.detalleProdParaCarrito = new DetalleProducto();
    }else{
      this.openSnackBar("Escoja un detalle");
    }
  }
  QuitarDetalleParaCarrito(detalleProducto: DetalleProducto){
    if(detalleProducto.id_detalle_producto != null){
      var lista: DetalleProducto[] = [];
      this.service.listaDetallesCarrito.forEach(element => {
        if(element.id_detalle_producto != detalleProducto.id_detalle_producto){
          lista.push(element);
        }
      });
      this.service.listaDetallesCarrito = lista;
    }else{
      this.openSnackBar("Escoja un detalle");
    }
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
