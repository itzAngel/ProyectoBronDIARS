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
import { Img, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { SendEmailService } from 'src/app/services/email/send-email.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
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
    public clienteService: ClienteService, public ventaService: VentaService,public imgservice: ImagenService,
    public emailService: SendEmailService) {

        super(dialog,_snackBar,router,route);
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
        (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
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
          this.generarPDF();
          this.selectedTienda = new Tienda();
          this.listaAsignaFinal = [];
          this.venta = new Venta();
          this.productoService.listaCarrito = [];
          this.productoDetalleService.listaDetallesCarrito = [];
          this.asignaService.listaAsignaFinal = [];
          this.detalleVentaService.listaDetallesCarrito = [];
          localStorage.removeItem('listaCarrito');
          localStorage.setItem('listaCarrito', JSON.stringify(this.productoService.listaCarrito));
      });
      this.emailService.enviarCorreoCompra(this.clienteSesion.correo).subscribe(data =>{
        this.openSnackBar(data);
      });
    }else{
      this.openSnackBar("Complete todos los campos necesarios para efectuar la compra");
    }
  }

  async generarPDF(){
    const pdf = new PdfMakeWrapper();
    pdf.pageSize('A4');
    pdf.info({
        title: 'Boleta de venta',
        author: 'BronShop',
        subject: 'Boleta',
    });
    pdf.add(
      new Txt("¡" + this.clienteSesion.nombre + " ya recibimos tu pedido, gracias por comprar en Bron Shop!").bold().alignment('center').fontSize(20).end
    );
    pdf.add(
      new Txt("Datos del cliente").alignment('left').bold().fontSize(14).end
    );
    pdf.add(
      new Txt("DNI: " + this.venta.cliente.dni_cliente).alignment('left').fontSize(12).end
    );
    pdf.add(
      new Txt("Cliente:" + this.venta.cliente.nombre + " " + this.venta.cliente.apellido).alignment('left').fontSize(12).end
    );
    pdf.add(
      new Txt("Telefono:" + this.venta.cliente.telefono).alignment('left').fontSize(12).end
    );
    pdf.add(
      new Txt("Datos su compra").alignment('left').bold().fontSize(14).end
    );
    pdf.add(
      new Txt("Tienda que entregará los producto: " + this.selectedTienda.nombre_tienda + "-" + "Distrito: " + this.selectedTienda.distrito).alignment('left').fontSize(12).end
    );
    pdf.add(
      new Txt("Fecha: " + this.venta.fecha_venta.toDateString()).alignment('left').fontSize(12).end
    );
    pdf.add(
      new Txt("Fecha de entrega: " + this.venta.fecha_entrega.toDateString()).alignment('left').fontSize(12).end
    );
    pdf.add(
      new Txt("Total a pagar: " + this.venta.precio_total).alignment('left').fontSize(12).end
    );
    pdf.add(
      new Txt("Resumen de productos de Bron Shop").alignment('left').bold().fontSize(14).end
    );
    this.detalleVentaService.listaDetallesCarrito.forEach(prod => {
      pdf.add(
        new Table([
          [ new Txt(prod.asignaProductoTienda.detalleProducto.producto.categoria.categoria + " " + 
          prod.asignaProductoTienda.detalleProducto.producto.modelo + " " + 
          prod.asignaProductoTienda.detalleProducto.color + " " + 
          prod.asignaProductoTienda.detalleProducto.talla).alignment('left').fontSize(12).end, 
          new Txt("Precio: S/. " + prod.asignaProductoTienda.detalleProducto.producto.precio).alignment('left').fontSize(12).end,
          new Txt("Cantidad " + prod.cantidad).alignment('left').fontSize(12).end
        ],
        ]).layout('lightHorizontalLines').layout('headerLineOnly').end
      );
    });
    pdf.add(
      new Txt("Resumen").alignment('left').bold().fontSize(14).end
    );
    pdf.add(
      new Txt("Total a pagar: S/. " + this.venta.precio_total).alignment('left').fontSize(12).end
    );
    pdf.add(
      new Txt("Metodo de pago: " + this.venta.metodo_pago).alignment('left').fontSize(12).end
    );
    pdf.add(
      new Txt("Comprobante de pago: " + this.venta.comprobante_pago).alignment('left').fontSize(12).end
    );
    pdf.create().download();
  }

}
