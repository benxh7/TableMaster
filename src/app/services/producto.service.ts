import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, merge, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock?: number;
  ilimitado: boolean;
  imagen?: string;
}

export interface ProductoUpsert {
  nombre: string;
  precio: number;
  ilimitado: boolean;
  stock?: number;
  imagen?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductoService {

  /**
   * Aqui vamos a añadir productos de ejemplo
   * ya que en esta actividad aun no aprendemos
   * conectar la aplicacion con una base de datos
   * para el correcto almacenamiento de los productos.
   */
  /*private initial: Producto[] = [
    { id: crypto.randomUUID(), nombre: 'Espresso',     precio: 1800, stock: 50, ilimitado: true },
    { id: crypto.randomUUID(), nombre: 'Capuccino',    precio: 2200, stock: 35, ilimitado: true },
    { id: crypto.randomUUID(), nombre: 'Latte',        precio: 2000, stock: 40, ilimitado: true },
    { id: crypto.randomUUID(), nombre: 'Americano',    precio: 1700, stock: 30, ilimitado: true },
    { id: crypto.randomUUID(), nombre: 'Sandwich Queso de Cabra, Tomate y Pesto', precio: 3500, stock: 20, ilimitado: false },
  ];*/

  private apiUrl = `${environment.apiUrl}/productos`;
  private reload$ = new BehaviorSubject<void>(undefined);

  constructor(private http: HttpClient) { }

  obtenerProductos(): Observable<Producto[]> {
    return merge(
      this.http.get<Producto[]>(this.apiUrl),
      this.reload$.pipe(
        switchMap(() => this.http.get<Producto[]>(this.apiUrl))
      )
    );
  }

  añadirProducto(p: ProductoUpsert): void {
    this.http.post<Producto>(this.apiUrl, p)
      .subscribe(() => this.recargar());
  }

  actualizarProducto(id: number, cambios: ProductoUpsert): void {
    this.http.put<Producto>(`${this.apiUrl}/${id}`, cambios)
      .subscribe(() => this.recargar());
  }

  eliminarProducto(id: number): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`)
      .subscribe(() => this.recargar());
  }

  private recargar(): void {
    this.reload$.next();
  }
}