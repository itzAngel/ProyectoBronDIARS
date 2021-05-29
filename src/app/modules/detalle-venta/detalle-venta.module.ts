import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetalleVentaRoutingModule } from './detalle-venta-routing.module';
import { DetalleVentaComponent } from './detalle-venta.component';
import { MaterialModule } from 'src/app/shared/material.module';


@NgModule({
  declarations: [
    DetalleVentaComponent
  ],
  imports: [
    CommonModule,
    DetalleVentaRoutingModule,
    MaterialModule
  ],
  exports: [
    DetalleVentaComponent
  ]
})
export class DetalleVentaModule { }
