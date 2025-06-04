import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../services/producto.service';

/**
 * La interfaz PedidoItem representa un item
 * dentro de un pedido, que contiene un producto
 * y la cantidad de este producto que se ha solicitado
 * 
 * Esto nos permite el agregar productos a las mesas
 * para luego poder llevar una cuenta y al final poder
 * facilitar el calculo y pago de los clientes.
 */
export interface PedidoItem {
  producto: Producto;
  cantidad: number;
}

/**
 * Nuestra interfaz Mesa representa una mesa en el restaurante
 * lo que nos permite gestionar su estado la capacidad y los pedidos
 * asociados a esta de manera que podamos llevar un control
 * de las mesas que estan libres, ocupadas o reservadas.
 * 
 * Esto tambien le da una ayuda al garzon para que pueda verificar
 * el consumo que tienen los clientes de la mesa.
 */
export interface Mesa {
  id: string;
  numero: number;
  capacidad: number;
  ocupantes: number;
  estado: 'libre' | 'reservada' | 'ocupada';
  items: PedidoItem[];
}

@Injectable({ providedIn: 'root' })
export class MesaService {
  private mesas$ = new BehaviorSubject<Mesa[]>(this.iniciales(6));

  /**
   * Getters para obtener las mesas
   * y una mesa en particular por su id.
   */
  getMesas() { return this.mesas$.asObservable(); }
  getMesa(id: string) { return this.mesas$.value.find(m => m.id === id)!; }

  /**
   * Con esto gestionamos el estado de las mesas
   * para saber si estan reservadas, ocupadas o libres.
   */
  reservar(id: string) { this.actualizar(id, { estado: 'reservada' }); }
  ocupar(id: string, personas: number) {
    this.actualizar(id, { estado: 'ocupada', ocupantes: personas });
  }
  liberar(id: string) { this.actualizar(id, { estado: 'libre', ocupantes: 0 }); }

  /**
   * Carrito de pedidos para la mesa
   * con esto vamos a poder agregar productos
   * a la mesa y llevar un control de los pedidos
   * @param id 
   * @param cambios 
   */
  añadirProducto(mesaId: string, producto: Producto) {
    this.actualizar(mesaId, mesa => {
      const idx = mesa.items.findIndex(i => i.producto.id === producto.id);
      if (idx > -1) {
        mesa.items[idx].cantidad += 1;
      } else {
        mesa.items.push({ producto, cantidad: 1 });
      }
      return { items: [...mesa.items] };
    });
  }

  private actualizar(id: string, cambios: Partial<Mesa> | ((m: Mesa) => Partial<Mesa>)) {
    this.mesas$.next(
      this.mesas$.value.map(m => {
        if (m.id !== id) return m;

        const patch = (typeof cambios === 'function') ? cambios({ ...m }) : cambios;
        return { ...m, ...patch };
      })
    );
  }

  private iniciales(n: number): Mesa[] {
    return Array.from({ length: n }, (_, i) => ({
      id: crypto.randomUUID(),
      numero: i + 1,
      capacidad: 6,
      ocupantes: 0,
      estado: 'libre' as const,
      items: [],
    }));
  }
}