import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
export class VistaProductoComponent implements OnInit {
  product: Producto|undefined;
  constructor(private route: ActivatedRoute,public service: ProductoService,
    public categoriaservice: CategoriaService, public detalleProductoService: DetalleProductoService,
    public imgservice: ImagenService) { }

  ngOnInit(): void {
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

}
