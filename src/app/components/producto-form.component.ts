import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { Producto, ProductoService } from '../services/producto.service';

@Component({
    selector: 'app-producto-form',
    standalone: true,
    imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
    template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ producto ? 'Editar' : 'Nuevo' }} producto</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">✕</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="form" (ngSubmit)="save()">
        <ion-item>
          <ion-label position="stacked">Nombre</ion-label>
          <ion-input formControlName="nombre"></ion-input>
        </ion-item>

        <ion-item>
            <ion-label position="stacked">Precio (CLP)</ion-label>
            <ion-input type="number" formControlName="precio"></ion-input>
        </ion-item>

        <ion-item>
            <ion-label>Stock ilimitado</ion-label>
            <ion-toggle formControlName="ilimitado"></ion-toggle>
        </ion-item>

        <ion-item *ngIf="!form.value.ilimitado">
        <ion-label position="stacked">Stock</ion-label>
        <ion-input type="number" formControlName="stock"></ion-input>
        </ion-item>

        <ion-button expand="block" type="submit" [disabled]="form.invalid">
          {{ producto ? 'Guardar cambios' : 'Crear producto' }}
        </ion-button>
      </form>
    </ion-content>
  `,
})
export class ProductoFormComponent {
    private fb = inject(FormBuilder);
    private modal = inject(ModalController);
    private toast = inject(ToastController);
    private prodSrv = inject(ProductoService);

    close() {
        this.modal.dismiss();
    }

    @Input() producto?: Producto;

    form = this.fb.group({
        nombre: ['', Validators.required],
        precio: [0, [Validators.required, Validators.min(1)]],
        ilimitado: [false],
        stock: [0, Validators.min(0)],
    });

    ngOnInit() {
        if (this.producto) this.form.patchValue(this.producto);
    }

    async save() {
        const { nombre, precio, stock, ilimitado } = this.form.value as any;
      
        if (this.producto) {
          /**
           * Aqui podemos actualizar un producto que ya hayamos creado
           * podemos editar el nombre, precio, stock o si es ilimitado
           * para productos que tengan un stock recurrente dependiendo
           * de la cantidad que se venda.
           */
          this.prodSrv.update(this.producto.id, {nombre, precio, ilimitado, stock: ilimitado ? undefined : stock
          });
        } else {
          /**
           * Ahora en este caso podemos nosotros crear un nuevo producto dependiendo
           * de lo que el cliente desee agregar acorde a su negocio.
           * por ejemplo si es un cafe puede agregar un producto como "Café Americano"
           * esto sumado a su precio, stock y si es ilimitado o no.
           */
          this.prodSrv.add({nombre, precio, ilimitado, ...(ilimitado ? {} : { stock })               // ← incluir stock solo cuando aplica
          });
        }
      
        const t = await this.toast.create({ message: 'Guardado', duration: 1200 });
        await t.present();
        this.modal.dismiss();
      }
}