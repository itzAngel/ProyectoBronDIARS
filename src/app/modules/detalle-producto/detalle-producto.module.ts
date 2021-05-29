import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetalleProductoRoutingModule } from './detalle-producto-routing.module';
import { DetalleProductoComponent } from './detalle-producto.component';
import { MaterialModule } from 'src/app/shared/material.module';


@NgModule({
  declarations: [
    DetalleProductoComponent
  ],
  imports: [
    CommonModule,
    DetalleProductoRoutingModule,
    MaterialModule
  ],
  exports:  [
    DetalleProductoComponent
  ]
})
export class DetalleProductoModule { }
