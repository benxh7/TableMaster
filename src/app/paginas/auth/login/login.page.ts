import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { UsuarioRespuesta } from '../../../models/usuario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})

export class LoginPage implements OnInit {

  formLogin!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.formLogin = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Validamos que el formulario sea válido y si es así,
   * llamamos al servicio de autenticación para iniciar sesión.
   * @returns 
   */
  async onSubmit() {
    if (this.formLogin.invalid) return;

    const loader = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
    });
    await loader.present();

    this.auth.login(this.formLogin.value).subscribe({
      next: async (usuario: UsuarioRespuesta) => {
        await loader.dismiss();
        await this.auth.guardarUsuario(usuario);
        const toast = await this.toastCtrl.create({
          message: `¡Bienvenido, ${usuario.nombre}!`,
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.navCtrl.navigateRoot('/home'); // o la ruta principal
      },
      error: async (err) => {
        await loader.dismiss();
        const toast = await this.toastCtrl.create({
          message: err.status === 401 ? 'Credenciales inválidas' : 'Error de conexión',
          duration: 2500,
          color: 'danger',
        });
        await toast.present();
      },
    });
  }
}