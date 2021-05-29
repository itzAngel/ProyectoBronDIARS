import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignaProductoTiendaComponent } from './asigna-producto-tienda.component';

const routes: Routes = [{ path: '', component: AsignaProductoTiendaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignaProductoTiendaRoutingModule { }
