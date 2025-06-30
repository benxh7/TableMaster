import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {

  public formRegistro!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit(): void {
    this.formRegistro = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        correo: ['', [Validators.required, Validators.email]],
        contrasena: ['', [Validators.required, Validators.minLength(6)]],
        confirmar: ['', [Validators.required]],
      },
      { validators: this.passwordsIguales }
    );
  }

  // Valida que 'contrasena' === 'confirmar'
  passwordsIguales(fc: AbstractControl) {
    const pass = fc.get('contrasena')?.value;
    const confirm = fc.get('confirmar')?.value;
    return pass === confirm ? null : { noCoinciden: true };
  }

  /**
   * Valodamos el formulario y si es valido
   * llamamos al servicio de autenticacion para
   * @returns 
   */
  async onSubmit(): Promise<void> {
    if (this.formRegistro.invalid) return;

    const { nombre, correo, contrasena } = this.formRegistro.value;

    this.auth.registrar({ nombre, correo, contrasena }).subscribe({
      next: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Registro exitoso 👌',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.navCtrl.navigateRoot('/login');
      },
      error: async (err) => {
        const toast = await this.toastCtrl.create({
          message: err.error?.detail || 'Error al registrar usuario',
          duration: 3000,
          color: 'danger',
        });
        await toast.present();
      },
    });
  }
}