import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuarioRespuesta } from '../models/usuario.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  const dummyResp: UsuarioRespuesta = {
    token: 'jwt-123',
    usuario: { id: 1, correo: 'e2e@tablemaster.com', nombre: 'e2e' }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  it('login() guarda token y usuario', () => {
    const creds = { correo: 'e2e@tablemaster.com', contrasena: 'Pass1234' };

    service.login(creds).subscribe(res => {
      expect(res).toEqual(dummyResp);
      expect(localStorage.getItem('token')).toEqual('jwt-123');
    });

    const req = http.expectOne(`${environment.apiUrl}/login`);
    expect(req.request.method).toEqual('POST');
    req.flush(dummyResp);
  });

  it('logout() limpia el storage', (done) => {
    localStorage.setItem('token', 'xyz');
  
    service.logout().then(() => {
      expect(localStorage.getItem('token')).toBeNull();
      done();
    });
  });

  afterEach(() => http.verify());
});