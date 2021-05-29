import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImagenRoutingModule } from './imagen-routing.module';
import { ImagenComponent } from './imagen.component';
import { MaterialModule } from 'src/app/shared/material.module';


@NgModule({
  declarations: [
    ImagenComponent
  ],
  imports: [
    CommonModule,
    ImagenRoutingModule,
    MaterialModule
  ]
})
export class ImagenModule { }
