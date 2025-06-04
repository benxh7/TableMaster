import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { ProductoService, Producto } from '../services/producto.service';
import { ProductoFormComponent } from '../components/producto-form.component';
import { MesaService } from '../services/mesa.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: false
})
export class ProductosPage implements OnInit {

  productos$ = this.prodSrv.list$;
  mesaId: string | null = null;

  constructor(
    private prodSrv: ProductoService,
    private mesaSrv: MesaService,
    private modal: ModalController,
    private alert: AlertController,
    private toastCtrl: ToastController,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.mesaId = this.route.snapshot.queryParamMap.get('mesaId');
  }

  /**
   * Aqui definimos nuestro CRUD de productos
   * para que el garzon pueda gestionar los productos
   * de manera que pueda agregar, editar y eliminar
   * productos del menu del restaurante.
   */
  async agregar() {
    const m = await this.modal.create({ component: ProductoFormComponent });
    await m.present();
  }

  async editar(p: Producto) {
    const m = await this.modal.create({
      component: ProductoFormComponent,
      componentProps: { producto: p },
    });
    await m.present();
  }

  async eliminar(p: Producto) {
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

  /* ---------- SELECCIÓN en modo catálogo / pedido ---------- */
  async onSelect(p: Producto) {
    if (this.mesaId) { // Aqui tenemos la vista de productos como pedido
      this.mesaSrv.añadirProducto(this.mesaId, p);
      await this.toast('Producto agregado');
    } else { // Y aqui tenemos la vista de productos como administrador
      this.editar(p);
    }
  }

  /* helper toast */
  private async toast(msg: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 1200, position: 'bottom' });
    t.present();
  }

  /**
   * Lleva al garzon de vuelta al menu donde puede gestionar las mesas
   */
    volverAMesa() {
    if (this.mesaId) {
      this.router.navigate(
        ['/home'],
        { queryParams: { foco: this.mesaId, open: 1 } }
      );
    }
  }

  /* ejemplo opcional: ir a una página de pedido */
  irAPedido() {
    if (this.mesaId) {
      this.router.navigate(['/pedido'], { queryParams: { mesaId: this.mesaId } });
    }
  }
}
