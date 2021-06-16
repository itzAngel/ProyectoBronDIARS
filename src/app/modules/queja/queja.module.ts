import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuejaRoutingModule } from './queja-routing.module';
import { QuejaComponent } from './queja.component';
import { MaterialModule } from 'src/app/shared/material.module';


@NgModule({
  declarations: [
    QuejaComponent
  ],
  imports: [
    CommonModule,
    QuejaRoutingModule,
    MaterialModule
  ]
})
export class QuejaModule { }
