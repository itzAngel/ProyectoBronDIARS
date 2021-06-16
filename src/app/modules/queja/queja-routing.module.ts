import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuejaComponent } from './queja.component';

const routes: Routes = [{ path: '', component: QuejaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuejaRoutingModule { }
