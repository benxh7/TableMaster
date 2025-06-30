import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Registro } from '../models/registro.model';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private apiUrl = `${environment.apiUrl}/registros`;

  constructor(private http: HttpClient) { }

  /** Lista todo el historial almacenado en FastAPI */
  listar()  {
    return this.http.get<Registro[]>(this.apiUrl);
  }

  obtener(id: number) { return this.http.get<Registro>(`${this.apiUrl}/${id}`); }

  /** Alta manual.  **NO** se usa en el flujo normal de cobro 😉 */
  crear(payload: Registro) {
    return this.http.post<Registro>(this.apiUrl, payload);
  }
}
