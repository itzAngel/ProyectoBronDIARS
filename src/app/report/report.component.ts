import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent extends BaseComponent implements OnInit {

  reporteCliente: boolean = true;
  reporteProducto: boolean = false;
  
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,
    public router:Router, public route: ActivatedRoute) { 
      super(dialog,_snackBar,router,route);
  }

  ngOnInit(): void {
    this.checkLogin();
  }
  cambiarRankCliente(){
    this.reporteCliente = true;
    this.reporteProducto= false;
  }
  cambiarRankProducto(){
    this.reporteCliente = false;
    this.reporteProducto= true;
  }
  
}