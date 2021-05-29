import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { Categoria } from 'src/app/models/categoria';
import { CategoriaService } from './categoria.service';
@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent extends BaseComponent implements OnInit {

  categoria: Categoria = new Categoria();
  categorias: Categoria[] = [];
  editar: boolean = false;
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,
    public router:Router, public route: ActivatedRoute,public service: CategoriaService) { 
      super(dialog,_snackBar,router,route);
  }

  ngOnInit(): void {
    this.listar();
    this.limpiar();
  }
  listar(){
    this.service.getList().subscribe(data => {
      this.categorias = data;
    });
  }
  limpiar() {
    this.categoria = new Categoria();
  }

  validar() {
    if (this.categoria.categoria != null) {
      return true;
    } else {
      return false;
    }
  }

  agregar(){
    this.limpiar();
    this.editar = false;
  }

  Guardar(categoria: Categoria) {
    if (this.validar()) {
      this.service.createObj(categoria).subscribe(data => {
          this.listar();
          this.openSnackBar("Categoria se agrego con exito");
          this.limpiar();
      });
    } else {
      this.openSnackBar("Llena todos los campos de la categoria");
    }
  }

  Editar(categoria: Categoria):void {
    this.categoria=categoria;
    this.editar = true;
  }

  Actualizar() {
    if (this.validar()) {
      this.service.updateObj(this.categoria).subscribe(data => {
          this.openSnackBar("Categoria se actualizo con exito");
          this.limpiar();
          this.editar = false;
      });
    } else {
      this.openSnackBar("Llena todos los campos de la categoria");
    }
  }

  Eliminar(categoria: Categoria): void {
    this.service.deleteObj(categoria.id_categoria).subscribe(
      data => {
        this.categorias = this.categorias.filter(p => p !== categoria);
        this.openSnackBar("Categoria se elimino con exito");
        this.agregar();
      },
      err => {
        this.openSnackBar("No se pudo eliminar la Categoria, probablemente esté siendo usada en otro modulo");
      }
    );
  }

}
