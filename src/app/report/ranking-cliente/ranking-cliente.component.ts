import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { Cliente } from 'src/app/models/cliente';
import { ClienteRank } from 'src/app/models/cliente-rank';
import { ClienteService } from 'src/app/modules/cliente/cliente.service';
import { VentaService } from 'src/app/modules/venta/venta.service';

@Component({
  selector: 'app-ranking-cliente',
  templateUrl: './ranking-cliente.component.html',
  styleUrls: ['./ranking-cliente.component.css']
})
export class RankingClienteComponent extends BaseComponent implements OnInit {
  clientes: Cliente[] = [];
  listaCliente: ClienteRank[] = [];
  displayedColumnsCliente: string[] = ['dni_cliente','nombre','apellido','cantidadCompras', 'totalCompra'];
  dataSourceCliente = new MatTableDataSource(this.listaCliente);
  @ViewChild(MatSort) sortCliente: MatSort;
  
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar,public router:Router,
     public route: ActivatedRoute,public clienteservice: ClienteService, public ventaservice: VentaService) { 
      super(dialog,_snackBar,router,route);
  }

  ngOnInit(): void {
    this.listarClientesRanking();
  }

  listarClientesRanking(){
    this.clienteservice.getList().subscribe(data => {
      this.clientes = data;
      this.clientes.forEach(element => {
          var cli: ClienteRank = new ClienteRank();
          this.ventaservice.listarxCliente(element.id_cliente).subscribe(data =>{
            element.listaVentas=data;
            element.cantidadCompras = element.listaVentas.length;
            cli.cantidadCompras=element.listaVentas.length;
            element.totalCompra = 0;
            cli.totalCompra = 0;
            element.listaVentas.forEach(elem => {
                element.totalCompra = element.totalCompra + elem.precio_total;
                cli.totalCompra = cli.totalCompra + elem.precio_total;
            });
          });
          cli.dni_cliente=element.dni_cliente;
          cli.nombre=element.nombre;
          cli.apellido=element.apellido;
          this.listaCliente.push(cli);
      });
      this.dataSourceCliente = new MatTableDataSource(this.listaCliente);
      this.dataSourceCliente.sort = this.sortCliente;
    });
}
}
