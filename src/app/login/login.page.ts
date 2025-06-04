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

  loginForm = this.fb.group({
    user: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{3,8}$')]],
    pin: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
  });

  constructor(private fb: FormBuilder, private router: Router) { }

  onSubmit() {
    if (this.loginForm.valid) {
      const extras: NavigationExtras = {
        state: { username: this.loginForm.value.user }
      };
      this.router.navigate(['home'], extras); // Cerramos la pagina de login y redireccionamos a la home
    }
  }

  ngOnInit() {
  }

}