import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { VistaProductoComponent } from './modules/producto/vista-producto/vista-producto.component';
import { LoginComponent } from './modules/security/login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'not-found', component: NotFoundComponent},
    { path: 'dashboard', component: DashboardComponent,
        children: [
            { path: 'categoria', loadChildren: () => import('./modules/categoria/categoria.module').then(m => m.CategoriaModule) }, 
            { path: 'cliente', loadChildren: () => import('./modules/cliente/cliente.module').then(m => m.ClienteModule) },
            { path: 'asignaProductoTienda', loadChildren: () => import('./modules/asigna-producto-tienda/asigna-producto-tienda.module').then(m => m.AsignaProductoTiendaModule) }, 
            { path: 'detalleProducto', loadChildren: () => import('./modules/detalle-producto/detalle-producto.module').then(m => m.DetalleProductoModule) }, 
            { path: 'detalleVenta', loadChildren: () => import('./modules/detalle-venta/detalle-venta.module').then(m => m.DetalleVentaModule) }, 
            { path: 'imagen', loadChildren: () => import('./modules/imagen/imagen.module').then(m => m.ImagenModule) },
            { path: 'producto', loadChildren: () => import('./modules/producto/producto.module').then(m => m.ProductoModule) }, 
            { path: 'producto/:productId', component: VistaProductoComponent },
            { path: 'tienda', loadChildren: () => import('./modules/tienda/tienda.module').then(m => m.TiendaModule) }, 
            { path: 'usuario', loadChildren: () => import('./modules/usuario/usuario.module').then(m => m.UsuarioModule) }, 
            { path: 'venta', loadChildren: () => import('./modules/venta/venta.module').then(m => m.VentaModule) },
            { path: 'contacto', loadChildren: () => import('./modules/contacto/contacto.module').then(m => m.ContactoModule) },
            { path: 'queja', loadChildren: () => import('./modules/queja/queja.module').then(m => m.QuejaModule) },
        ]
    },
    { path: 'producto', loadChildren: () => import('./modules/producto/producto.module').then(m => m.ProductoModule) }, 
    { path: 'producto/:productId', component: VistaProductoComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registrarVenta', loadChildren: () => import('./modules/registrar-venta/registrar-venta.module').then(m => m.RegistrarVentaModule) },
    { path: 'contacto', loadChildren: () => import('./modules/contacto/contacto.module').then(m => m.ContactoModule) },
    { path: 'queja', loadChildren: () => import('./modules/queja/queja.module').then(m => m.QuejaModule) },
    //{ path: '**', redirectTo: 'not-found'}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
