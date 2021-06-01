import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrarVentaRoutingModule } from './registrar-venta-routing.module';
import { RegistrarVentaComponent } from './registrar-venta.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { ProductoModule } from '../producto/producto.module';
import { DetalleProductoModule } from '../detalle-producto/detalle-producto.module';
import { VentaModule } from '../venta/venta.module';
import { DetalleVentaModule } from '../detalle-venta/detalle-venta.module';
import { PdfMakerModule } from 'src/app/shared/pdfmaker.module';


@NgModule({
  declarations: [
    RegistrarVentaComponent
  ],
  imports: [
    CommonModule,
    RegistrarVentaRoutingModule,
    MaterialModule,
    ProductoModule,
    DetalleProductoModule,
    VentaModule,
    DetalleVentaModule,
    PdfMakerModule
  ]
})
export class RegistrarVentaModule { }
