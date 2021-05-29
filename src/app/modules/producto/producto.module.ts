import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing.module';
import { ProductoComponent } from './producto.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { VistaProductoComponent } from './vista-producto/vista-producto.component';


@NgModule({
  declarations: [
    ProductoComponent,
    VistaProductoComponent
  ],
  imports: [
    CommonModule,
    ProductoRoutingModule,
    MaterialModule
  ],
  exports:  [
    ProductoComponent
  ]
})
export class ProductoModule { }
