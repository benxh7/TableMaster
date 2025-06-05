import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrosPage } from './registros.page';
import { RegistroDetallePage } from './registro-detalle/registro-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrosPage
  },
  {
    path: ':id',
    component: RegistroDetallePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrosPageRoutingModule {}
