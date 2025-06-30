import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { MesaService, Mesa } from '../services/mesa.service';
import { MesaDetailComponent } from '../components/mesa-detalle.component';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class HomePage {
  
  private modalCtrl = inject(ModalController);
  private sheetCtrl = inject(ActionSheetController);
  private mesaSrv = inject(MesaService);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);

  mesas$ = this.mesaSrv.obtenerMesas();

  mesaId = (_: number, m: Mesa) => m.id;
  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    Device.getBatteryInfo().then(b => console.log('🔋 Bateria', b));
    // Sólo en navegadores con la API disponible
    // @ts-ignore
    if (performance.memory) {
      // @ts-ignore
      console.log('💾 JS heap', (performance.memory.usedJSHeapSize/1e6).toFixed(1), 'MB');
    }
  }

  /**
   * Esta funcion se encarga de abrir un action sheet
   * dependiendo del estado de la mesa seleccionada.
   * Si la mesa esta libre, muestra las opciones de reservar
   * o ocupar la mesa. Si esta reservada, muestra las opciones
   * de ocupar o liberar la mesa. Si esta ocupada, muestra las
   * opciones de ver el pedido, agregar productos, pagar,
   * liberar la mesa o cambiar el garzón asignado.
   * @param mesa 
   */
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

  /**
   * Esta funcion se encarga de mostrar un action sheet
   * con las opciones disponibles para una mesa libre,
   * como reservar la mesa, ocuparla o cancelar la acción.
   * @param mesa 
   */
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

  /**
   * Esta funcion se encarga de mostrar un action sheet
   * con las opciones disponibles para una mesa reservada,
   * como ocupar la mesa, liberar la mesa o cancelar la acción.
   * @param mesa 
   */
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

  /** 
   * Esta funcion se encarga de mostrar un action sheet
   * con las opciones disponibles para una mesa ocupada,
   * como ver el pedido, agregar productos, pagar, liberar la mesa,
   * o cambiar el garzón asignado.
   * @param mesa
   */
  private async sheetParaOcupada(mesa: Mesa) {
    const clientes = mesa.ocupantes;
    const garzon = mesa.garzon ? `\nGarzón: ${mesa.garzon}` : '';
    const s = await this.sheetCtrl.create({
      header: `Mesa ${mesa.numero} (ocupada)`,
      subHeader: `Ocupada por ${clientes} ${clientes === 1 ? 'cliente' : 'clientes'}${garzon}`,
      buttons: [
        {
          text: mesa.garzon ? 'Cambiar garzón' : 'Asignar garzón',
          icon: 'person-add',
          handler: () => this.asignarGarzon(mesa),
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

  /**
   * Esta funcion se encarga de abrir un modal
   * para ocupar una mesa, donde se puede ingresar
   * el nombre del garzón y la cantidad de personas.
   * @param mesa 
   */
  private async abrirModalOcupar(mesa: Mesa) {
    const modal = await this.modalCtrl.create({
      component: MesaDetailComponent,
      componentProps: { mesa },
    });
    await modal.present();
  }

  /**
   * Esta funcion se encarga de mostrar un action sheet
   * con las opciones disponibles para agregar una nueva mesa.
   * @returns 
   */
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
          handler: () => this.mesaSrv.añadirMesa(),
        },
      ],
    });
    await alert.present();
  }

  /**
   * Esta funcion se encarga de asignar un garzón a una mesa,
   * mostrando un alert con un campo de texto para ingresar
   * el nombre del garzón.
   * @param mesa 
   */
  private async asignarGarzon(mesa: Mesa) {
    const alert = await this.alertCtrl.create({
      header: `Garzón – Mesa ${mesa.numero}`,
      inputs: [
        {
          name: 'garzon',
          type: 'text',
          placeholder: 'Nombre del garzón',
          value: mesa.garzon ?? '',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: ({ garzon }) =>
            this.mesaSrv.ocupar(mesa.id, mesa.ocupantes, garzon.trim() || undefined),
        },
      ],
    });
    await alert.present();
  }


  /**
   * Esta funcion se encarga de refrescar la lista de mesas
   * al hacer pull-to-refresh, recargando los datos desde el servidor.
   * @param ev 
   */
  refrescar(ev: CustomEvent) {
    const refresher = ev.target as HTMLIonRefresherElement;

    this.mesaSrv.recargar();
    this.mesaSrv.obtenerMesas().pipe(take(1)).subscribe(() => {
      refresher.complete();
      Haptics.impact({ style: ImpactStyle.Medium });
    });
  }
}