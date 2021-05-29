import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleVentaComponent } from './detalle-venta.component';

const routes: Routes = [{ path: '', component: DetalleVentaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetalleVentaRoutingModule { }
