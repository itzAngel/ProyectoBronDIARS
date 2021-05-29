import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrarVentaComponent } from './registrar-venta.component';

const routes: Routes = [{ path: '', component: RegistrarVentaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrarVentaRoutingModule { }
