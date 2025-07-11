import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface PendingOp {
  id: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE';
  body?: any;
}

@Injectable({ providedIn: 'root' })
export class OfflineQueueService {
  private key = 'pending_ops';

  constructor(private http: HttpClient) {
    Network.addListener('networkStatusChange', s => {
      if (s.connected) this.flush();
    });
    this.flush();
  }

  /* Encola operación */
  async enqueue(endpoint: string, method: PendingOp['method'], body?: any) {
    const { value } = await Preferences.get({ key: this.key });
    const list: PendingOp[] = value ? JSON.parse(value) : [];
    list.push({ id: crypto.randomUUID(), endpoint, method, body });
    await Preferences.set({ key: this.key, value: JSON.stringify(list) });
  }

  /* Reenvía las pendientes */
  private async flush() {
    if (!navigator.onLine) return;
    const { value } = await Preferences.get({ key: this.key });
    let list: PendingOp[] = value ? JSON.parse(value) : [];
    if (!list.length) return;

    for (const op of list) {
      try {
        const url = `${environment.apiUrl}${op.endpoint}`;
        switch (op.method) {
          case 'POST': await this.http.post(url, op.body).toPromise(); break;
          case 'PUT': await this.http.put(url, op.body).toPromise(); break;
          case 'DELETE': await this.http.delete(url).toPromise(); break;
        }
        // si funciona → quítala de la cola
        list = list.filter(x => x.id !== op.id);
        await Preferences.set({ key: this.key, value: JSON.stringify(list) });
      } catch { return; }
    }
    console.log('✅ Cola offline sincronizada');
  }
}