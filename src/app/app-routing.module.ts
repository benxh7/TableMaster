import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './authguard/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadChildren: () => import('./paginas/auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./paginas/auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./paginas/productos/productos.module').then( m => m.ProductosPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'pedido',
    loadChildren: () => import('./paginas/pedido/pedido.module').then( m => m.PedidoPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'pago',
    loadChildren: () => import('./paginas/pago/pago.module').then( m => m.PagoPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'registros',
    loadChildren: () => import('./paginas/registros/registros.module').then( m => m.RegistrosPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'registro-detalle',
    loadChildren: () => import('./paginas/registros/registro-detalle/registro-detalle.module').then( m => m.RegistroDetallePageModule),
    canActivate: [authGuard]
  },
  {
    path: '**',
    loadChildren: () => import('./paginas/error404/error404.module').then( m => m.Error404PageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
