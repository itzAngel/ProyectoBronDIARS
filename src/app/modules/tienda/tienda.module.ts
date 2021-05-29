import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiendaRoutingModule } from './tienda-routing.module';
import { TiendaComponent } from './tienda.component';
import { MaterialModule } from 'src/app/shared/material.module';


@NgModule({
  declarations: [
    TiendaComponent
  ],
  imports: [
    CommonModule,
    TiendaRoutingModule,
    MaterialModule
  ]
})
export class TiendaModule { }
