import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cliente } from '../models/cliente';
@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

  loggeado:boolean = false;
  loggeadoClient:boolean = false;
  clienteSesion: Cliente = new Cliente();
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,
    public router:Router, public route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  openSnackBar(mensaje: string) {
    this._snackBar.open(mensaje, 'OK', {
      duration: 1000,
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }

  checkLogin(){
    this.loggeado = JSON.parse(localStorage.getItem('isLogged'));
    this.loggeadoClient = JSON.parse(localStorage.getItem('isLoggedCliente'));
    this.clienteSesion = JSON.parse(localStorage.getItem('clienteSesion'));
  }
}
