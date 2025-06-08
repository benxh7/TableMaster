import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock?: number;
  ilimitado: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductoService {
  /**
   * Aqui vamos a añadir productos de ejemplo
   * ya que en esta actividad aun no aprendemos
   * conectar la aplicacion con una base de datos
   * para el correcto almacenamiento de los productos.
   */
  private initial: Producto[] = [
    { id: crypto.randomUUID(), nombre: 'Espresso',     precio: 1800, stock: 50, ilimitado: true },
    { id: crypto.randomUUID(), nombre: 'Capuccino',    precio: 2200, stock: 35, ilimitado: true },
    { id: crypto.randomUUID(), nombre: 'Latte',        precio: 2000, stock: 40, ilimitado: true },
    { id: crypto.randomUUID(), nombre: 'Americano',    precio: 1700, stock: 30, ilimitado: true },
    { id: crypto.randomUUID(), nombre: 'Sandwich Queso de Cabra, Tomate y Pesto', precio: 3500, stock: 20, ilimitado: false },
  ];

  private productos$ = new BehaviorSubject<Producto[]>([...this.initial]);

  list$ = this.productos$.asObservable();

  /**
   * Aqui es donde vamos a añadir nuestros productos
   * es donde formamos nuestro CRUD.
   * @param p 
   */
  add(p: Omit<Producto, 'id'>) {
    const nuevo = { ...p, id: crypto.randomUUID() };
    this.productos$.next([...this.productos$.value, nuevo]);
  }

  /**
   * aqui vamos a actualizar los productos
   * que ya tenemos creados, por ejemplo si
   * un producto cambia de precio
   * o si cambia su stock, o si es ilimitado o no.
   * @param id 
   * @param cambios 
   */
  update(id: string, cambios: Partial<Producto>) {
    this.productos$.next(
      this.productos$.value.map(p => (p.id === id ? { ...p, ...cambios } : p))
    );
  }

  /**
   * Con esto vamos a eliminar un producto
   * de nuestra lista de productos.
   * @param id 
   */
  remove(id: string) {
    this.productos$.next(this.productos$.value.filter(p => p.id !== id));
  }

  /**
   * Con esto vamos a obtener todos los productos
   * que tenemos en nuestra lista de productos.
   */
  getById(id: string) {
    return this.productos$.value.find(p => p.id === id);
  }
}