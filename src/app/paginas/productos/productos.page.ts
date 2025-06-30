import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { ProductoService, Producto } from '../../services/producto.service';
import { ProductoFormComponent } from '../../components/producto-form.component';
import { MesaService } from '../../services/mesa.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: false
})
export class ProductosPage implements OnInit {

  productos$ = this.prodSrv.obtenerProductos();
  mesaId: number | null = null;

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
    const param = this.route.snapshot.queryParamMap.get('mesaId');
    this.mesaId = param ? +param : null;
  }

  /**
   * Aqui definimos nuestro CRUD de productos
   * para que el garzon pueda gestionar los productos
   * de manera que pueda agregar, editar y eliminar
   * productos del menu del restaurante.
   */
  async agregar() {
    const modal = await this.modal.create({
      component: ProductoFormComponent
    });
    await modal.present();
  }

  /**
   * Esta funcion nos permite editar un producto
   * del menu del restaurante, lo que le permite
   * al garzon modificar los detalles del producto
   * como el nombre, precio y descripcion.
   * @param p 
   */
  async editar(p: Producto) {
    const modal = await this.modal.create({
      component: ProductoFormComponent,
      componentProps: { producto: p }
    });
    await modal.present();
  }

  /**
   * Esta funcion nos permite eliminar un producto
   * del menu del restaurante, lo que le permite
   * al garzon eliminar productos que ya no se ofrecen
   * o que estan obsoletos.
   * @param p 
   */
  async eliminar(p: Producto) {
    const alert = await this.alert.create({
      header: 'Eliminar',
      message: `¿Borrar "${p.nombre}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: () => this.prodSrv.eliminarProducto(p.id) }
      ]
    });
    await alert.present();
  }

  /**
   * Esta funcion se encarga de seleccionar un producto
   * del menu del restaurante, si estamos en la vista
   * de productos como pedido, se agrega el producto
   * a la mesa, si estamos en la vista de productos
   * como administrador, se edita el producto.
   * @param p 
   */
  async onSelect(p: Producto) {
    if (this.mesaId != null) {
      this.mesaSrv.añadirProducto(this.mesaId, p.id);
      await this.toast('Producto agregado a mesa');
    } else {
      this.editar(p);
    }
  }

  /**
   * Toast para mostrar mensajes al usuario
   * como confirmaciones de acciones realizadas
   * o errores que puedan ocurrir.
   * @param msg 
   */
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

  /**
   * Lleva al garzon a la pagina de pedidos
   * donde puede ver los pedidos de la mesa actual.
   */
  irAPedido() {
    if (this.mesaId) {
      this.router.navigate(['/pedido'], { queryParams: { mesaId: this.mesaId } });
    }
  }
}
