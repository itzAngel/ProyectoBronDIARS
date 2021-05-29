import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { Categoria } from 'src/app/models/categoria';
import { Producto } from 'src/app/models/producto';
import { CategoriaService } from '../categoria/categoria.service';
import { DetalleProductoService } from '../detalle-producto/detalle-producto.service';
import { ImagenService } from '../imagen/imagen.service';
import { ProductoService } from './producto.service';
interface Genero {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent extends BaseComponent implements OnInit {
  @Input("vistaCliente") 
  vistaCliente: boolean=false;
  lista: boolean = true;
  producto: Producto = new Producto();
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  editar: boolean = false;
  generos: Genero[] = [
    {value: 'masculino', viewValue: 'Masculino'},
    {value: 'femenino', viewValue: 'Femenino'}
  ];
  productosBus: Producto[] = [];
  categoriaFiltro: Categoria = null;
  modeloFiltro: string = null;
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,
    public router:Router, public route: ActivatedRoute,public service: ProductoService,
    public categoriaservice: CategoriaService, public detalleProductoService: DetalleProductoService,
    public imgservice: ImagenService) { 
      super(dialog,_snackBar,router,route);
  }

  ngOnInit(): void {
    this.categoriaservice.getList().subscribe(data => {
      this.categorias = data;
    });
    this.listar();
    this.limpiar();
    this.checkLogin();
  }
  listar(){
    this.lista=true;
    this.service.getList().subscribe(data => {
      this.productos = data;
      this.productos.forEach(element => {
        this.detalleProductoService.obtenerlistaporid(element.id_producto).subscribe(data => {
          element.listaDetalleProducto = data;
        });
      });
      this.productos.forEach(pro => {
        this.imgservice.obtenerlistaporid(pro.id_producto).subscribe(data => {
          pro.listaImagen = data;
          pro.listaImagen.forEach(element => {
            element.base64 = 'data:image/jpg;base64,' + element.base64;
            pro.foto=element.base64;
          });
        });
      });
    });
  }
  limpiar() {
    this.producto = new Producto();
  }
  filtrar(){
    this.service.getList().subscribe(data => {
      this.productos = data;
      if(this.categoriaFiltro != null){
        this.productosBus=[];
        for (let obj of this.productos) {
            if (obj.categoria.id_categoria == this.categoriaFiltro.id_categoria) {
              this.productosBus.push(obj);
            };
        };
        this.productos=this.productosBus;
      }
      if(this.modeloFiltro != null){
        this.productosBus=[];
        for (let obj of this.productos) {
            if (obj.modelo.toLocaleLowerCase().includes(this.modeloFiltro)) {
              this.productosBus.push(obj);
            };
        };
        this.productos=this.productosBus;
      }
      this.productos.forEach(pro => {
        this.imgservice.obtenerlistaporid(pro.id_producto).subscribe(data => {
          pro.listaImagen = data;
          pro.listaImagen.forEach(element => {
            element.base64 = 'data:image/jpg;base64,' + element.base64;
            pro.foto=element.base64;
          });
        });
      });
    });
  }

  limpiarFiltros(){
    this.modeloFiltro=null;
    this.categoriaFiltro=null;
    this.listar();
  }
  validar() {
    if (this.producto.modelo != null && 
      this.producto.genero != null && this.producto.categoria.id_categoria != null && 
      this.producto.precio != null) {
      return true;
    } else {
      return false;
    }
  }

  agregar(){
    this.lista=false;
    this.limpiar();
    this.editar = false;
  }

  Guardar(producto: Producto) {
    if (this.validar()) {
      this.categoriaservice.getObjById(producto.categoria.id_categoria).subscribe(data => {
          producto.categoria = data;
      });
      this.service.createObj(producto).subscribe(data => {
          this.listar();
          this.openSnackBar("producto se agrego con exito");
          this.limpiar();
      });
    } else {
      this.openSnackBar("Llena todos los campos del producto");
    }
  }

  Editar(producto: Producto):void {
    this.lista=false;
    this.producto=producto;
    this.editar = true;
  }

  Actualizar(producto: Producto) {
    if (this.validar()) {
      this.categoriaservice.getObjById(producto.categoria.id_categoria).subscribe(data => {
          producto.categoria = data;
      });
      this.service.updateObj(this.producto).subscribe(data => {
          this.openSnackBar("producto se actualizo con exito");
          this.limpiar();
          this.listar();
          this.editar = false;
      });
    } else {
      this.openSnackBar("Llena todos los campos del producto");
    }
  }

  Eliminar(producto: Producto): void {
    this.service.deleteObj(producto.id_producto).subscribe(
      data => {
        this.productos = this.productos.filter(p => p !== producto);
        this.openSnackBar("producto se elimino con exito");
        this.listar();
      },
      err => {
        this.openSnackBar("No se pudo eliminar el producto, probablemente esté siendo usada en otro modulo");
      }
    );
  }
  

}
