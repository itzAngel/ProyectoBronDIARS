import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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
  listaCarrito: Producto[] = [];
  categorias: Categoria[] = [];
  editar: boolean = false;
  generos: Genero[] = [
    {value: 'masculino', viewValue: 'Masculino'},
    {value: 'femenino', viewValue: 'Femenino'}
  ];
  productosBus: Producto[] = [];
  categoriaFiltro: Categoria = null;
  modeloFiltro: string = null;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,
    public router:Router, public route: ActivatedRoute,public service: ProductoService,
    public categoriaservice: CategoriaService, public detalleProductoService: DetalleProductoService,
    public imgservice: ImagenService,changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) { 
      super(dialog,_snackBar,router,route);
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.categoriaservice.getList().subscribe(data => {
      this.categorias = data;
    });
    this.listar();
    this.limpiar();
    this.checkLogin();
    if(JSON.parse(localStorage.getItem('listaCarrito')) != null){
      this.service.listaCarrito = JSON.parse(localStorage.getItem('listaCarrito'));
    }
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
    if(this.categoriaFiltro == null && this.modeloFiltro == null){
      this.openSnackBar("Complete algun campo para filtrar los productos");
    }else{
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
              if (obj.modelo.toLocaleLowerCase().includes(this.modeloFiltro.toLocaleLowerCase())) {
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

  cerrarSesion(){
    localStorage.removeItem('isLogged');
    localStorage.removeItem('isLoggedCliente');
    localStorage.removeItem('clienteSesion');
    localStorage.removeItem('listaCarrito');
    location.reload();
  }
  
  comprar(producto: Producto){
    var noexec:boolean = false;
    if(this.service.listaCarrito != null){
      this.service.listaCarrito.forEach(element => {
        if(producto.id_producto == element.id_producto){
          noexec = true;
        }
      });
      if(!noexec){
        localStorage.removeItem('listaCarrito');
        this.service.listaCarrito.push(producto);
        localStorage.setItem('listaCarrito', JSON.stringify(this.service.listaCarrito));
      }else{
        this.openSnackBar("El producto ya fue agregado al carrito");
      }
    }else{
      localStorage.removeItem('listaCarrito');
      this.service.listaCarrito = [];
      this.service.listaCarrito.push(producto);
      localStorage.setItem('listaCarrito', JSON.stringify(this.service.listaCarrito));
    }
  }
  quitarProd(prod:Producto){
    this.service.listaCarrito.forEach(element => {
      if(element.id_producto!=prod.id_producto){
        this.listaCarrito.push(element);
      }
    });
    this.service.listaCarrito = this.listaCarrito;
    localStorage.removeItem('listaCarrito');
    localStorage.setItem('listaCarrito', JSON.stringify(this.service.listaCarrito));
    this.listaCarrito=[];
  }
}
