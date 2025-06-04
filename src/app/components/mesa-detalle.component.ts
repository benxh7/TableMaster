import { Component, inject, signal, Input } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Mesa, MesaService } from '../services/mesa.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mesa-detail',
  imports: [IonicModule, CommonModule],
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
      <ion-button
        expand="block"
        color="warning"
        *ngIf="mesa.estado === 'libre'"
        (click)="reservar()"
      >
        Reservar mesa
      </ion-button>

      <ion-button
        expand="block"
        color="medium"
        *ngIf="mesa.estado !== 'libre'"
        (click)="liberar()"
      >
        Liberar mesa
      </ion-button>
    </ion-content>
  `,
  styles: [`
    .personas-box{
      display:flex;justify-content:center;align-items:center;gap:24px;margin:32px 0;
    }
    h1{margin:0;font-size:3rem;}
  `]
})
export class MesaDetailComponent {
  private modalCtrl = inject(ModalController);
  private mesaSrv   = inject(MesaService);
  private router    = inject(Router);
  private toastCtrl = inject(ToastController);

  @Input() mesa!: Mesa;
  personas = signal(1);

  /* Helpers */
  close() { this.modalCtrl.dismiss(); }
  add(n:number){ this.personas.update(p=>p+n); }

  /* ───────── ACCIONES ───────── */
  ocuparSolo(){
    if (this.mesa.estado !== 'ocupada') {
      this.mesaSrv.ocupar(this.mesa.id, this.personas());
    }
    this.modalCtrl.dismiss();
  }

  ocuparYAgregar(){
    if (this.mesa.estado !== 'ocupada') {
      this.mesaSrv.ocupar(this.mesa.id, this.personas());
    }
    this.modalCtrl.dismiss().then(()=> {
      this.router.navigate(['/productos'], { queryParams:{ mesaId:this.mesa.id }});
    });
  }

  reservar(){
    this.mesaSrv.reservar(this.mesa.id);
    this.toast('Mesa reservada');
    this.modalCtrl.dismiss();
  }

  liberar(){
    this.mesaSrv.liberar(this.mesa.id);
    this.toast('Mesa liberada');
    this.modalCtrl.dismiss();
  }

  private async toast(msg:string){
    const t = await this.toastCtrl.create({ message: msg, duration:1500, position:'bottom' });
    t.present();
  }
}