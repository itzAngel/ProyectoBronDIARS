import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';
import { MaterialModule } from '../shared/material.module';
import { SortPipe } from '../pipes/sort.pipe';
import { RankingClienteComponent } from './ranking-cliente/ranking-cliente.component';
import { RankingProductoComponent } from './ranking-producto/ranking-producto.component';

@NgModule({
  declarations: [
    ReportComponent,
    SortPipe,
    RankingClienteComponent,
    RankingProductoComponent 
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    MaterialModule
  ]
})
export class ReportModule { }
