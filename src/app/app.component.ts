import { Component } from '@angular/core';
import { Network } from '@capacitor/network';
import { ToastController, Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})

export class AppComponent {
  constructor(
    private toast: ToastController, 
    private platform: Platform,
    public auth: AuthService
  ) {
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
