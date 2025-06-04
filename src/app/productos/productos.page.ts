import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';

import { ProductoService, Producto } from '../services/producto.service';
import { ProductoFormComponent } from '../components/producto-form.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: false
})
export class ProductosPage implements OnInit {
  /* flujo reactivo con todos los productos */
  productos$ = this.prodSrv.list$;

  /* mesaId (si llegas desde el action-sheet de Home) */
  mesaId: string | null = null;

  constructor(
    private prodSrv: ProductoService,
    private modal: ModalController,
    private alert: AlertController,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /* ───── ciclo de vida ───── */
  ngOnInit(): void {
    this.mesaId = this.route.snapshot.queryParamMap.get('mesaId');
  }

  /* ───── CRUD ───── */
  async add() {
    const m = await this.modal.create({ component: ProductoFormComponent });
    await m.present();
  }

  async edit(p: Producto) {
    const m = await this.modal.create({
      component: ProductoFormComponent,
      componentProps: { producto: p },
    });
    await m.present();
  }

  async delete(p: Producto) {
    const a = await this.alert.create({
      header: 'Eliminar',
      message: `¿Borrar "${p.nombre}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.prodSrv.remove(p.id),
        },
      ],
    });
    await a.present();
  }

  /* ejemplo opcional: ir a una página de pedido */
  irAPedido() {
    if (this.mesaId) {
      this.router.navigate(['/pedido'], { queryParams: { mesaId: this.mesaId } });
    }
  }
}
