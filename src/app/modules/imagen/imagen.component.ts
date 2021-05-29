import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { Imagen } from 'src/app/models/imagen';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from '../producto/producto.service';
import { ImagenService } from './imagen.service';
@Component({
  selector: 'app-imagen',
  templateUrl: './imagen.component.html',
  styleUrls: ['./imagen.component.css']
})
export class ImagenComponent extends BaseComponent implements OnInit {
  imagen: File;
  img:Imagen = new Imagen();
  base64DefaultURL: string;
  selectedProduct: Producto = new Producto();
  productos: Producto[] = [];
  listaImagenes: Imagen[] = [];
  constructor(public imgservice: ImagenService,public dialog: MatDialog, public _snackBar: MatSnackBar,
    public router:Router, public route: ActivatedRoute, public productoservice: ProductoService) {
    super(dialog,_snackBar,router,route);
  }
  ngOnInit(): void {
    this.productoservice.getList().subscribe(data => {
      this.productos = data;
    });
    this.listar();
  }

  listar(){
    this.imgservice.getList().subscribe(data => {
      this.listaImagenes = data;
      this.listaImagenes.forEach(element => {
        element.base64 = 'data:image/jpg;base64,' + element.base64;
      });
    });
  }
  limpiar(){
    this.img = new Imagen();
    this.reset();
  }
  validar() {
    if (this.img.producto.id_producto != null && this.imagen != null) {
      return true;
    } else {
      return false;
    }
  }

  Subir(){
    if(this.validar()){
      this.img.base64 = this.base64DefaultURL;
      this.img.contentType = "image/jpeg";
      this.productoservice.getObjById(this.img.producto.id_producto).subscribe(data => {
          this.img.producto = data;
      });
      this.imgservice.createObj(this.img).subscribe(
        data => {
          this.openSnackBar("Imagen se subió con exito");
          this.listar();
        },
        err => {
          this.reset();
        }
      );
    }else{
      this.openSnackBar("Existe un error, no se subió la imagen");
    }
  }
  reset(): void {
    this.imagen = null;
  }

  getFiles(event) {
    this.imagen = event.target.files;
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(this.imagen[0]);
  }

  _handleReaderLoaded(readerEvt) {
      var binaryString = readerEvt.target.result;
      this.base64DefaultURL = btoa(binaryString); 
  }

  Eliminar(imag: Imagen): void {
    this.imgservice.deleteObj(imag.id_imagen).subscribe(data => {
        this.listaImagenes = this.listaImagenes.filter(p => p !== imag);
        this.openSnackBar("Imagen se elimino con exito");
        this.listar();
      },
      err => {
        this.openSnackBar("No se pudo eliminar la Imagen, probablemente esté siendo usada en otro modulo");
      }
    );
  }

}
