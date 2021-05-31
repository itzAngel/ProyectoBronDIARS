import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { AsignaProductoTienda } from 'src/app/models/asigna-producto-tienda';
import { Categoria } from 'src/app/models/categoria';
import { Cliente } from 'src/app/models/cliente';
import { Tienda } from 'src/app/models/tienda';
import { Venta } from 'src/app/models/venta';
import { AsignaProductoTiendaService } from '../asigna-producto-tienda/asigna-producto-tienda.service';
import { ClienteService } from '../cliente/cliente.service';
import { DetalleProductoService } from '../detalle-producto/detalle-producto.service';
import { DetalleVentaService } from '../detalle-venta/detalle-venta.service';
import { ImagenService } from '../imagen/imagen.service';
import { ProductoService } from '../producto/producto.service';
import { TiendaService } from '../tienda/tienda.service';
import { VentaService } from '../venta/venta.service';

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
  venta: Venta = new Venta();
  clientes: Cliente[] = [];
  private _mobileQueryListener: () => void;
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,public router:Router, 
    public route: ActivatedRoute,private _formBuilder: FormBuilder,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public asignaService: AsignaProductoTiendaService,
    public productoService: ProductoService, public productoDetalleService: DetalleProductoService,
    public tiendaService: TiendaService, public detalleVentaService: DetalleVentaService,
    public clienteService: ClienteService, public ventaService: VentaService,public imgservice: ImagenService) {

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
    this.clienteService.getList().subscribe(data => {
      this.clientes = data;
    });
    this.checkLogin();
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
    if(this.detalleVentaService.listaDetallesCarrito != null &&
      this.detalleVentaService.listaDetallesCarrito.length != 0 && 
      this.validarTienda() && this.validarDetallesCarrito()){
      return true;
    }
    return false;
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

  limpiarTienda(){
    this.selectedTienda = new Tienda();
  }

  cargarDatosVenta(){
    this.venta.fecha_venta = new Date;
    this.venta.fecha_entrega = new Date;
    this.venta.cliente = this.clienteSesion;
    this.venta.listaDetalleVenta = this.detalleVentaService.listaDetallesCarrito;
    this.detalleVentaService.listaDetallesCarrito.forEach(element => {
      this.venta.precio_total = this.venta.precio_total + (element.precio * element.cantidad);
    });
    this.venta.fecha_entrega.setDate(this.venta.fecha_venta.getDate() + 5);
  }

  validarDatosVenta(){
    if(this.venta.direccion!=null && this.venta.nombre_persona_recibe!=null &&
      this.venta.apellido_persona_recibe!=null && this.validarDetallesVentaCarrito() 
      && this.validarTienda() && this.validarDetallesCarrito()){
        return true;
    }
    return false;
  }
  validarDatosPago(){
    if(this.venta.metodo_pago!=null && this.venta.comprobante_pago!=null &&
       this.validarDatosVenta()){
        return true;
    }
    return false;
  }
  cargarFotosProductos(){
    this.detalleVentaService.listaDetallesCarrito.forEach(element => {
      this.imgservice.obtenerlistaporid(element.asignaProductoTienda.detalleProducto.producto.id_producto).subscribe(data => {
        element.asignaProductoTienda.detalleProducto.producto.listaImagen = data;
        element.asignaProductoTienda.detalleProducto.producto.listaImagen.forEach(ima => {
          ima.base64 = 'data:image/jpg;base64,' + ima.base64;
          element.asignaProductoTienda.detalleProducto.producto.foto=ima.base64;
        });
      });
    });
  }
  confirmarCompra(){
    if(this.validarDatosPago()){
      this.ventaService.createObj(this.venta).subscribe(data =>{
          this.detalleVentaService.listaDetallesCarrito.forEach(detalle => {
              detalle.venta = data;
              this.detalleVentaService.createObj(detalle).subscribe(data =>{
              });
          });
          this.openSnackBar("Compra se completó con exito");
          this.selectedTienda = new Tienda();
          this.listaAsignaFinal = [];
          this.venta = new Venta();
          this.productoService.listaCarrito = [];
          this.productoDetalleService.listaDetallesCarrito = [];
          this.asignaService.listaAsignaFinal = [];
          this.detalleVentaService.listaDetallesCarrito = [];
          localStorage.removeItem('listaCarrito');
          localStorage.setItem('listaCarrito', JSON.stringify(this.productoService.listaCarrito));
      })
    }else{
      this.openSnackBar("Complete todos los campos necesarios para efectuar la compra");
    }
  }


}
