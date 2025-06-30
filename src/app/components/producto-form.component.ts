import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController, Platform  } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
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

        <!-- Selector de imagen -->
        <ion-item>
          <ion-label>Imagen</ion-label>
          <ion-button fill="outline" (click)="selectImage()">
            {{ form.value.imagen ? 'Cambiar' : 'Seleccionar' }} foto
          </ion-button>
        </ion-item>

        <!-- Vista previa -->
        <ion-item *ngIf="form.value.imagen">
          <ion-thumbnail slot="start">
            <img [src]="form.value.imagen" />
          </ion-thumbnail>
          <ion-label>Previsualización</ion-label>
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
  private platform = inject(Platform);

  @Input() producto?: Producto;

  form = this.fb.group({
    nombre: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(1)]],
    ilimitado: [false],
    stock: [0, Validators.min(0)],
    imagen: ['']
  });

  ngOnInit() {
    if (this.producto) {
      this.form.patchValue(this.producto);
    }
  }

  close() {
    this.modal.dismiss();
  }

  /** Abre cámara o file picker según la plataforma */
  async selectImage() {
    if (this.platform.is('hybrid')) {
      // En móvil: cámara / galería
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Prompt,
        });
        this.form.patchValue({ imagen: image.dataUrl });
      } catch (err) {
        console.warn('No se seleccionó imagen', err);
      }
  
    } else {
      // En web: creamos y disparamos un input file
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        const dataUrl = await this.fileToDataUrl(file);
        this.form.patchValue({ imagen: dataUrl });
      };
      input.click();
    }
  }

  /** Convierte File a DataURL */
  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = err => reject(err);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Esta funcion se encarga de guardar los cambios
   * que se hayan realizado en el formulario, ya sea
   * para crear un nuevo producto o para editar uno existente.
   */
  async save() {
    const { nombre, precio, stock, ilimitado, imagen } = this.form.value as any;

    if (this.producto) {
      await this.prodSrv.actualizarProducto(
        this.producto.id,
        { nombre, precio, ilimitado, stock: ilimitado ? undefined : stock, imagen }
      );
    } else {
      await this.prodSrv.añadirProducto({
        nombre,
        precio,
        ilimitado,
        ...(ilimitado ? {} : { stock }),
        imagen
      });
    }

    const t = await this.toast.create({ message: 'Guardado', duration: 1200 });
    await t.present();
    this.modal.dismiss();
  }
}