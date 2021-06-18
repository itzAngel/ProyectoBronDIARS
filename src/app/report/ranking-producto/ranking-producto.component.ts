import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { Producto } from 'src/app/models/producto';
import { ProductoRank } from 'src/app/models/producto-rank';
import { DetalleVentaService } from 'src/app/modules/detalle-venta/detalle-venta.service';
import { ProductoService } from 'src/app/modules/producto/producto.service';

@Component({
  selector: 'app-ranking-producto',
  templateUrl: './ranking-producto.component.html',
  styleUrls: ['./ranking-producto.component.css']
})
export class RankingProductoComponent extends BaseComponent implements OnInit {

  productos: Producto[] = [];
  listaProducto: ProductoRank[] = [];
  displayedColumnsProducto: string[] = ['modelo','genero','precio', 'cantidadCompras', 'totalCompra'];
  dataSourceProducto = new MatTableDataSource(this.listaProducto);
  @ViewChild(MatSort) sortProducto: MatSort;

  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,public router:Router,
    public route: ActivatedRoute,public productoService: ProductoService, public detalleVentaService: DetalleVentaService) { 
     super(dialog,_snackBar,router,route);
  }

  ngOnInit(): void {
    this.listarProductosRanking();
  }


  listarProductosRanking(){
    this.productoService.getList().subscribe(data => {
      this.productos = data;
      this.productos.forEach(element => {
          var pro: ProductoRank = new ProductoRank();
          this.detalleVentaService.listarxProducto(element.id_producto).subscribe(data =>{
            element.listaDetalleVenta=data;
            pro.cantidadCompras=element.listaDetalleVenta.length;
            pro.totalCompra = 0;
            element.listaDetalleVenta.forEach(elem => {
                pro.totalCompra = pro.totalCompra + (elem.precio*elem.cantidad);
            });
          });
          pro.modelo=element.modelo;
          pro.genero=element.genero;
          pro.precio=element.precio;
          this.listaProducto.push(pro);
      });
      this.dataSourceProducto = new MatTableDataSource(this.listaProducto);
      this.dataSourceProducto.sort = this.sortProducto;
    });
}
}
