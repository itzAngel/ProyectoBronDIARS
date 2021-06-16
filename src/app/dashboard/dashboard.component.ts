import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';
interface Nav {
  link: string;
  viewValue: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  listaNavegacion: Nav[] = [
    {link: 'categoria', viewValue: 'Modulo Categoria'},
    {link: 'cliente', viewValue: 'Modulo Cliente'},
    {link: 'asignaProductoTienda', viewValue: 'Modulo Asigna Producto Tienda'},
    {link: 'detalleProducto', viewValue: 'Modulo Detalle Producto'},
    {link: 'detalleVenta', viewValue: 'Modulo Detalle Venta'},
    {link: 'imagen', viewValue: 'Modulo Imagen'},
    {link: 'producto', viewValue: 'Modulo Producto'},
    {link: 'tienda', viewValue: 'Modulo Tienda'},
    {link: 'usuario', viewValue: 'Modulo Usuario'},
    {link: 'venta', viewValue: 'Modulo Venta'},
    {link: 'queja', viewValue: 'Modulo queja'},
    {link: 'contacto', viewValue: 'Modulo contacto'},
  ];
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,
    public router:Router, public route: ActivatedRoute, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    super(dialog,_snackBar,router,route);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.checkLogin();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  cerrarSesion(){
    localStorage.removeItem('isLogged');
    location.reload();
  }
}
