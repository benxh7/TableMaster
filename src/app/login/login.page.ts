import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})

export class LoginPage {

  /**
   * Este es el formulario de inicio de sesion
   * que contiene los campos de usuario y contraseña.
   */
  loginForm = this.fb.group({
    user: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9]{3,16}$')
      ]
    ],
    password: [
      '',
      [
        Validators.minLength(6),
        Validators.maxLength(20),
      ]
    ],
  });

  constructor(private fb: FormBuilder, private router: Router) { }

  /**
   * Esta funcion se encarga de validar el formulario
   * y si es valido, redirige al usuario a la pagina
   * de inicio de la aplicacion.
   */
  onSubmit() {
    if (this.loginForm.valid) {
      const extras: NavigationExtras = {
        state: { username: this.loginForm.value.user }
      };
      /**
       * Aqui lo que hacemos despues de el inicio de sesion
       * es llevar a nuestro usuario al home en donde podra
       * comenzar a utilizar la app
       */
      this.router.navigate(['home'], extras);
    }
  }

  ngOnInit() {
  }

}