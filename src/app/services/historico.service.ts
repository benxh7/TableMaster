import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Registro } from '../models/registro.model';

interface VentaHist {
  id: number;
  mesa: number;
  total: number;
  propina: number;
  totalFinal: number;
  fecha: string;
  enviado: boolean;
}

@Injectable({ providedIn: 'root' })
export class HistoricoService {
  private key = 'hist_ventas';

  /* Guarda siempre un resumen local */
  async agregar(reg: Registro, enviado = true) {
    const arr: VentaHist[] = JSON.parse((await Preferences.get({ key: this.key })).value ?? '[]');
    arr.push({
      id: reg.id ?? Date.now(), mesa: reg.mesa, total: reg.total,
      propina: reg.propina, totalFinal: reg.total_final,
      fecha: reg.fecha, enviado
    });
    if (arr.length > 500) arr.shift();
    await Preferences.set({ key: this.key, value: JSON.stringify(arr) });
  }

  async listar(): Promise<VentaHist[]> {
    const { value } = await Preferences.get({ key: this.key });
    return value ? JSON.parse(value) : [];
  }

  /* Marca como subido lo llama OfflineQueueService.flush cuando recibe 200 */
  async marcarSubido(ids: number[]) {
    const arr: VentaHist[] = await this.listar();
    ids.forEach(id => {
      const i = arr.find(a => a.id === id);
      if (i) i.enviado = true;
    });
    await Preferences.set({ key: this.key, value: JSON.stringify(arr) });
  }
}