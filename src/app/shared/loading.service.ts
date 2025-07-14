import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _state = new BehaviorSubject<'hidden' | 'visible' | 'loaded'>('hidden');
  state$ = this._state.asObservable();

  show() { this._state.next('visible'); } // muestra el loader
  open() { this._state.next('loaded'); } // inicia apertura del telón
  hide() { this._state.next('hidden'); } // lo oculta
}
