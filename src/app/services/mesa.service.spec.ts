import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MesaService, Mesa } from './mesa.service';
import { environment } from '../../environments/environment';

describe('MesaService', () => {
    let service: MesaService;
    let http: HttpTestingController;

    const mesaMock: Mesa = {
        id: 2,
        numero: 2,
        capacidad: 4,
        ocupantes: 0,
        estado: 'libre',
        items: []
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MesaService]
        });
        service = TestBed.inject(MesaService);
        http = TestBed.inject(HttpTestingController);
    });

    it('ocupar() hace PUT a /ocupar', () => {
        service.ocupar(2, 2, 'Benja');

        const req = http.expectOne(`${environment.apiUrl}/mesas/2/ocupar`);
        expect(req.request.method).toEqual('PUT');
        expect(req.request.body).toEqual({ ocupantes: 2, garzon: 'Benja' });

        req.flush({ ...mesaMock, estado: 'ocupada' });
    });

    it('liberar() hace PUT a /liberar', () => {
        service.liberar(2);

        const req = http.expectOne(`${environment.apiUrl}/mesas/2/liberar`);
        expect(req.request.method).toEqual('PUT');
        expect(req.request.body).toEqual({});
        req.flush({ ...mesaMock, estado: 'libre' });
    });

    afterEach(() => http.verify());
});