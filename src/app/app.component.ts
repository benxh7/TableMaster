import { Component, ViewEncapsulation  } from '@angular/core';
import { Network } from '@capacitor/network';
import { ToastController, Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { LoadingService } from './shared/loading.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
  encapsulation: ViewEncapsulation.None
})

export class AppComponent {

  loaderState$ = this.loader.state$;

  constructor(
    private router: Router,
    private toast: ToastController, 
    private platform: Platform,
    public auth: AuthService,
    public loader: LoadingService
  ) {
    // 1️⃣  Telón cerrado al iniciar una navegación
    this.router.events.pipe(
      filter(e => e instanceof NavigationStart)
    ).subscribe(() => this.loader.show());

    // 2️⃣  Abrir telón cuando la navegación termina o se cancela
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError)
    ).subscribe(() => this.loader.open());

    this.platform.ready().then(() => {
      Network.addListener('networkStatusChange', s => {
        if (!s.connected) {
          this.toast.create({
            message: 'Sin conexión a Internet',
            duration: 3000,
            color: 'warning'
          }).then(t => t.present());
        }
      });
    });
  }
}
