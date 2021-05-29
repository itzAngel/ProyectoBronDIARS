import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsignaProductoTiendaRoutingModule } from './asigna-producto-tienda-routing.module';
import { AsignaProductoTiendaComponent } from './asigna-producto-tienda.component';
import { MaterialModule } from 'src/app/shared/material.module';


@NgModule({
  declarations: [
    AsignaProductoTiendaComponent
  ],
  imports: [
    CommonModule,
    AsignaProductoTiendaRoutingModule,
    MaterialModule
  ]
})
export class AsignaProductoTiendaModule { }
