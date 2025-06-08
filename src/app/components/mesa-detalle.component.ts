import { Component, inject, signal, Input } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';  
import { CommonModule } from '@angular/common';
import { Mesa, MesaService } from '../services/mesa.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mesa-detail',
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Mesa {{ mesa.numero }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">✕</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Solo pedimos personas si la mesa NO está ocupada -->
      <ng-container *ngIf="mesa.estado !== 'ocupada'">
        <p>¿Cuántas personas se sentarán? (máx. {{ mesa.capacidad }})</p>

        <div class="personas-box">
          <ion-button (click)="add(-1)" [disabled]="personas()==1">−</ion-button>
          <h1>{{ personas() }}</h1>
          <ion-button (click)="add(1)" [disabled]="personas()==mesa.capacidad">+</ion-button>
        </div>
      </ng-container>

      <!-- Botones de acción -->
      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <ion-button expand="block" color="success" (click)="ocuparSolo()">
              Ocupar esta Mesa
            </ion-button>
          </ion-col>

          <ion-col size="6">
            <ion-button expand="block" color="secondary" (click)="ocuparYAgregar()">
              Agregar Productos
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Liberar / Reservar siguen igual -->
      <ion-button expand="block" color="warning" *ngIf="mesa.estado === 'libre'" (click)="reservar()">
        Reservar mesa
      </ion-button>

      <ion-button expand="block" color="medium" *ngIf="mesa.estado !== 'libre'" (click)="liberar()">
        Liberar mesa
      </ion-button>


      <!-- campo nuevo, debajo del selector de personas -->
      <div class="garzon-wrapper">
        <ion-item lines="full">
          <ion-label position="stacked" class="garzon-label">
            Nombre del garzón (opcional)
          </ion-label>
          <ion-input
            [(ngModel)]="garzon"
            placeholder="Nombre"
            class="garzon-input">
          </ion-input>
        </ion-item>
      </div>
    </ion-content>
  `,
  styles: [`
    .personas-box{
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 24px;
      margin: 32px 0;
    }
      
    h1 {
      margin:0;
      font-size:
      3rem;
    }

    .garzon-wrapper {
      margin-top: 30px;
    }
      
    .garzon-label {
      font-size: 0.9rem;
      color: var(--ion-color-medium);
    }
      
    .garzon-input {
      --min-height: 50px;
      font-size: 1rem;
      color: #fff;
    }
  `]
})
export class MesaDetailComponent {
  private modalCtrl = inject(ModalController);
  private mesaSrv = inject(MesaService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  @Input() mesa!: Mesa;
  personas = signal(1);
  garzon = '';

  close() { this.modalCtrl.dismiss(); }
  add(n:number){ this.personas.update(p=>p+n); }

  /**
   * Esta funcion se encarga de ocupar una mesa
   * con la cantidad de personas y el nombre del garzón.
   */
  ocuparSolo(){
    if (this.mesa.estado !== 'ocupada') {
      this.mesaSrv.ocupar(this.mesa.id, this.personas(), this.garzon.trim() || undefined);
    }
    this.modalCtrl.dismiss();
  }

  /**
   * Esta funcion se encarga de ocupar una mesa
   * y redirigir a la pantalla de productos
   * para agregar productos al pedido.
   * Si la mesa ya está ocupada, no hace nada.
   */
  ocuparYAgregar(){
    if (this.mesa.estado !== 'ocupada') {
      this.mesaSrv.ocupar(this.mesa.id, this.personas(), this.garzon.trim() || undefined);
    }
    this.modalCtrl.dismiss().then(()=> {
      this.router.navigate(['/productos'], { queryParams:{ mesaId:this.mesa.id }});
    });
  }

  /**
   * Esta funcion se encarga de reservar una mesa
   * y mostrar un mensaje de confirmación.
   */
  reservar(){
    this.mesaSrv.reservar(this.mesa.id);
    this.toast('Mesa reservada');
    this.modalCtrl.dismiss();
  }

  /**
   * Esta funcion se encarga de liberar una mesa
   * y mostrar un mensaje de confirmación.
   */
  liberar(){
    this.mesaSrv.liberar(this.mesa.id);
    this.toast('Mesa liberada');
    this.modalCtrl.dismiss();
  }

  /**
   * Toast para mostrar mensajes al usuario
   * como confirmaciones de acciones realizadas
   * o errores que puedan ocurrir.
   * @param msg 
   */
  private async toast(msg:string){
    const t = await this.toastCtrl.create({ message: msg, duration:1500, position:'bottom' });
    t.present();
  }
}