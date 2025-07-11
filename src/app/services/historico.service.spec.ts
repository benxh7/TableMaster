import { TestBed } from '@angular/core/testing';
import { HistoricoService } from '../services/historico.service';
import { Preferences } from '@capacitor/preferences';

class PrefStub {
  private store: Record<string, string> = {};
  async get({ key }: { key: string }) { return { value: this.store[key] }; }
  async set({ key, value }: any) { this.store[key] = value; }
  async remove({ key }: { key: string }) { delete this.store[key]; }
}

describe('HistoryService', () => {
  let service: HistoricoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HistoricoService,
        { provide: Preferences, useClass: PrefStub }
      ]
    });
    service = TestBed.inject(HistoricoService);
  });

  it('crea y lee historial', async () => {
    await service.agregar({
      id: 1, mesa: 2, total: 1000,
      propina: 0, totalFinal: 1000,
      fecha: new Date().toISOString(),
      usuario_id: 1, items: []
    } as any);

    const list = await service.listar();
    expect(list.length).toEqual(1);
  });
});