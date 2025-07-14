import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { UsuarioRespuesta } from '../../../models/usuario.model';
import { LoadingService } from '../../../shared/loading.service';

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
    private loadingCtrl: LoadingController,
    private loader: LoadingService
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

    const ionicLoader  = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
    });
    await ionicLoader.present();

    this.loader.show();

    this.auth.login(this.formLogin.value).subscribe({
      next: async (usuario: UsuarioRespuesta) => {
        await ionicLoader.dismiss();
        await this.auth.guardarUsuario(usuario);
        const toast = await this.toastCtrl.create({
          message: `¡Bienvenido!`,
          duration: 2000,
          color: 'success',
        });
        await toast.present();

        this.loader.open();
        this.navCtrl.navigateRoot('/home');
      },
      error: async (err) => {
        await ionicLoader.dismiss();
        this.loader.hide();
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