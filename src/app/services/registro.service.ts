import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Registro } from '../models/registro.model';
import { HistoricoService } from './historico.service';
import { OfflineQueueService } from './servicio-offline.service';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private apiUrl = `${environment.apiUrl}/registros`;

  constructor(private http: HttpClient, private hist: HistoricoService) { }

  /** Lista todo el historial almacenado en FastAPI */
  listar() {
    return navigator.onLine
      ? this.http.get<Registro[]>(this.apiUrl)
      : from(this.hist.listar()) as Observable<any>;  // devuelve el resumen local
  }

  obtener(id: number) { return this.http.get<Registro>(`${this.apiUrl}/${id}`); }

  crear(payload: Registro) {
    return this.http.post<Registro>(this.apiUrl, payload);
  }
}
