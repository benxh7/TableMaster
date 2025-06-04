import { Component, inject } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { MesaService, Mesa } from '../services/mesa.service';
import { MesaDetailComponent } from '../components/mesa-detalle.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {
  private modalCtrl = inject(ModalController);
  private sheetCtrl = inject(ActionSheetController);
  private mesaSrv = inject(MesaService);
  private router = inject(Router);

  mesas$ = this.mesaSrv.getMesas();

  /* ───── Tap en cualquier mesa ───── */
  async abrirMesa(mesa: Mesa) {
    switch (mesa.estado) {
      case 'libre':
        await this.sheetParaLibre(mesa);
        break;

      case 'reservada':
        await this.sheetParaReservada(mesa);
        break;

      case 'ocupada':
        await this.sheetParaOcupada(mesa);
        break;
    }
  }

  private async sheetParaLibre(mesa: Mesa) {
    const s = await this.sheetCtrl.create({
      header: `Mesa ${mesa.numero}`,
      buttons: [
        { text: 'Reservar', icon: 'bookmark', handler: () => this.mesaSrv.reservar(mesa.id) },
        { text: 'Ocupar',   icon: 'people',   handler: () => this.abrirModalOcupar(mesa) },
        { text: 'Cancelar', role: 'cancel' },
      ],
    });
    await s.present();
  }

  private async sheetParaReservada(mesa: Mesa) {
    const s = await this.sheetCtrl.create({
      header: `Mesa ${mesa.numero} (reservada)`,
      buttons: [
        { text: 'Ocupar',  icon: 'people',           handler: () => this.abrirModalOcupar(mesa) },
        { text: 'Liberar', icon: 'checkmark-circle', role: 'destructive', handler: () => this.mesaSrv.liberar(mesa.id) },
        { text: 'Cancelar', role: 'cancel' },
      ],
    });
    await s.present();
  }

  /* ★ NUEVO: opciones para mesa OCUPADA ★ */
  private async sheetParaOcupada(mesa: Mesa) {
    const clientes = mesa.ocupantes;
    const s = await this.sheetCtrl.create({
      header: `Mesa ${mesa.numero} (ocupada)`,
      subHeader: `Ocupada por ${clientes} ${clientes === 1 ? 'cliente' : 'clientes'}`,
      buttons: [
        {
          text: 'Ver pedido',
          icon: 'receipt',
          handler: () => console.log('Abrir pedido de la mesa', mesa.id),
        },
        {
          text: 'Agregar Productos',
          icon: 'add',
          handler: () => this.router.navigate(
            ['/productos'],
            { queryParams: { mesaId: mesa.id } }
          ),
        },
        {
          text: 'Liberar mesa',
          icon: 'checkmark-circle',
          role: 'destructive',
          handler: () => this.mesaSrv.liberar(mesa.id),
        },
        { text: 'Cancelar', role: 'cancel' },
      ],
    });
    await s.present();
  }

  private async abrirModalOcupar(mesa: Mesa) {
    const modal = await this.modalCtrl.create({
      component: MesaDetailComponent,
      componentProps: { mesa },
    });
    await modal.present();
  }
}