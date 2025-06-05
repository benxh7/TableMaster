import { Component, inject } from '@angular/core';
import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
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
  private alertCtrl = inject(AlertController);

  mesas$ = this.mesaSrv.getMesas();

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
        { 
          text: 'Reservar',
          icon: 'bookmark',
          handler: () => this.mesaSrv.reservar(mesa.id)
        },
        { 
          text: 'Ocupar',
          icon: 'people',
          handler: () => this.abrirModalOcupar(mesa)
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'close',
        },
      ],
    });
    await s.present();
  }

  private async sheetParaReservada(mesa: Mesa) {
    const s = await this.sheetCtrl.create({
      header: `Mesa ${mesa.numero} (reservada)`,
      buttons: [
        {
          text: 'Ocupar',
          icon: 'people',
          handler: () => this.abrirModalOcupar(mesa)
        },
        {
          text: 'Liberar',
          icon: 'checkmark-circle',
          role: 'destructive',
          handler: () => this.mesaSrv.liberar(mesa.id)
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'close',
        },
      ],
    });
    await s.present();
  }

  private async sheetParaOcupada(mesa: Mesa) {
    const clientes = mesa.ocupantes;
    const garzon = mesa.garzon ? `\nGarzón: ${mesa.garzon}` : '';
    const s = await this.sheetCtrl.create({
      header: `Mesa ${mesa.numero} (ocupada)`,
      subHeader: `Ocupada por ${clientes} ${clientes === 1 ? 'cliente' : 'clientes'}${garzon}`,
      buttons: [
        {
          text: 'Ver pedido',
          icon: 'receipt',
          handler: async () => {
            await s.dismiss();
            this.router.navigate(['/pedido'], {
              queryParams: { mesaId: mesa.id }
            });
          },
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
          text: 'Pagar',
          icon: 'cash',
          handler: async () => {
            await s.dismiss();
            this.router.navigate(['/pago'], {
              queryParams: { mesaId: mesa.id }
            });
          },
        },
        {
          text: 'Liberar mesa',
          icon: 'checkmark-circle',
          role: 'destructive',
          handler: () => this.mesaSrv.liberar(mesa.id),
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'close',
        },
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

  async agregarMesa() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva mesa',
      message: '¿Deseas agregar una nueva mesa libre?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Agregar',
          handler: () => this.mesaSrv.addMesa(),   // capacidad por defecto = 6
        },
      ],
    });
    await alert.present();
  }
}