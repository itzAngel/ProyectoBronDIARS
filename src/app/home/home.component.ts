import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';
import { Categoria } from '../models/categoria';
import { Producto } from '../models/producto';
import { CategoriaService } from '../modules/categoria/categoria.service';
import { DetalleProductoService } from '../modules/detalle-producto/detalle-producto.service';
import { ImagenService } from '../modules/imagen/imagen.service';
import { ProductoService } from '../modules/producto/producto.service';
import { ClientAuthServiceService } from '../services/auth/client-auth-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit {

  producto: Producto = new Producto();
  productos: Producto[] = [];
  listaCarrito: Producto[] = [];
  categorias: Categoria[] = [];
  productosBus: Producto[] = [];
  categoriaFiltro: Categoria = null;
  modeloFiltro: string = null;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,public categoriaservice: CategoriaService,
    public router:Router, public route: ActivatedRoute, public service: ProductoService,
     public detalleProductoService: DetalleProductoService,public imgservice: ImagenService,
     changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,public clientservice:ClientAuthServiceService) {
    super(dialog,_snackBar,router,route);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  cerrarSesion(){
    localStorage.removeItem('isLogged');
    localStorage.removeItem('isLoggedCliente');
    localStorage.removeItem('listaCarrito');
    localStorage.removeItem('clienteSesion');
    location.reload();
  }
  
  ngOnInit(): void {
    this.categoriaservice.getList().subscribe(data => {
      this.categorias = data;
    });
    this.listar();
    this.checkLogin();
    if(JSON.parse(localStorage.getItem('listaCarrito')) != null){
      this.service.listaCarrito = JSON.parse(localStorage.getItem('listaCarrito'));
    }
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
  listar(){
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
