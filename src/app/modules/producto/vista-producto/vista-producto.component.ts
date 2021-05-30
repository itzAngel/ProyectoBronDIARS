import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { Producto} from 'src/app/models/producto';
import { CategoriaService } from '../../categoria/categoria.service';
import { DetalleProductoService } from '../../detalle-producto/detalle-producto.service';
import { ImagenService } from '../../imagen/imagen.service';
import { ProductoService } from '../producto.service';
@Component({
  selector: 'app-vista-producto',
  templateUrl: './vista-producto.component.html',
  styleUrls: ['./vista-producto.component.css']
})
export class VistaProductoComponent extends BaseComponent implements OnInit {
  product: Producto|undefined;
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,
    public router:Router, public route: ActivatedRoute,public service: ProductoService,
    public categoriaservice: CategoriaService, public detalleProductoService: DetalleProductoService,
    public imgservice: ImagenService) {
      super(dialog,_snackBar,router,route);
  }

  ngOnInit(): void {
    this.checkLogin();
    // First get the product id from the current route.
    const routeParams = this.route.snapshot.paramMap;
    const productIdFromRoute = Number(routeParams.get('productId'));
    // Find the product that correspond with the id provided in route.
    this.service.getObjById(productIdFromRoute).subscribe(data => {
      this.product = data;
      //carga detalles
      this.detalleProductoService.obtenerlistaporid(this.product.id_producto).subscribe(data => {
        this.product.listaDetalleProducto = data;
      });
      //carga imagen
      this.imgservice.obtenerlistaporid(this.product.id_producto).subscribe(data => {
        this.product.listaImagen = data;
        this.product.listaImagen.forEach(element => {
          element.base64 = 'data:image/jpg;base64,' + element.base64;
          this.product.foto=element.base64;
        });
      });
    });
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
      this.service.listaCarrito.push(producto);
      localStorage.setItem('listaCarrito', JSON.stringify(this.service.listaCarrito));
    }
  }

}
