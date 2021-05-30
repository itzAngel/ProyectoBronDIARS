import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { AsignaProductoTienda } from 'src/app/models/asigna-producto-tienda';
import { Tienda } from 'src/app/models/tienda';
import { AsignaProductoTiendaService } from '../asigna-producto-tienda/asigna-producto-tienda.service';
import { DetalleProductoService } from '../detalle-producto/detalle-producto.service';
import { DetalleVentaService } from '../detalle-venta/detalle-venta.service';
import { ProductoService } from '../producto/producto.service';
import { TiendaService } from '../tienda/tienda.service';

@Component({
  selector: 'app-registrar-venta',
  templateUrl: './registrar-venta.component.html',
  styleUrls: ['./registrar-venta.component.css']
})
export class RegistrarVentaComponent extends BaseComponent implements OnInit {
  isLinear = false;
  mobileQuery: MediaQueryList;
  selectedTienda: Tienda = new Tienda();
  tiendas: Tienda[] = [];
  listaAsignaFinal: AsignaProductoTienda[] = [];
  private _mobileQueryListener: () => void;
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,public router:Router, 
    public route: ActivatedRoute,private _formBuilder: FormBuilder,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public asignaService: AsignaProductoTiendaService,
    public productoService: ProductoService, public productoDetalleService: DetalleProductoService,
    public tiendaService: TiendaService, public detalleVentaService: DetalleVentaService) {

        super(dialog,_snackBar,router,route);
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
    if(JSON.parse(localStorage.getItem('listaCarrito')) != null){
      this.productoService.listaCarrito = JSON.parse(localStorage.getItem('listaCarrito'));
    }
    this.tiendaService.getList().subscribe(data => {
      this.tiendas = data;
    });
  }

  //validaciones
  validarDetallesCarrito(): boolean{
    if(this.productoDetalleService.listaDetallesCarrito == null || this.productoDetalleService.listaDetallesCarrito.length == 0){
      return false;
    }
    return true;
  }
  validarTienda(): boolean{
    if(this.selectedTienda.id_tienda==null){
      return false;
    }
    return true;
  }
  validarDetallesVentaCarrito(): boolean{
    if(this.detalleVentaService.listaDetallesCarrito == null || this.detalleVentaService.listaDetallesCarrito.length == 0){
      return false;
    }
    return true;
  }

  comprobarDisponibilidad(){
    var listaAsigna: AsignaProductoTienda[] = [];
    this.asignaService.listaAsignaFinal = [];
    this.asignaService.obtenerlistaporid(this.selectedTienda.id_tienda).subscribe(data => {
      listaAsigna = data;
      listaAsigna.forEach(asigna => {
        this.productoDetalleService.listaDetallesCarrito.forEach(det => {
          if(asigna.detalleProducto.id_detalle_producto == det.id_detalle_producto){
            this.asignaService.listaAsignaFinal.push(asigna);
          }
        });
      });
    });
  }

}
