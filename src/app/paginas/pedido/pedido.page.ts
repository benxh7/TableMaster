import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, shareReplay } from 'rxjs/operators';
import { MesaService, Mesa, PedidoItem } from '../../services/mesa.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
  standalone: false
})
export class PedidoPage implements OnInit {

  mesa$ = this.route.queryParamMap.pipe(
    map(p => +p.get('mesaId')!),
    switchMap(id => this.mesaSrv.obtenerMesa(id)),
    shareReplay(1)
  );
  
  mesa!: Mesa;
  total = 0;
  totalConPropina = 0;

  constructor(
    private mesaSrv: MesaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.queryParamMap.get('mesaId'));
    this.mesaSrv.obtenerMesa(id).subscribe(mesa => {
      this.mesa = mesa;
      this.calculoTotal();
    });
  }

  /**
   * Aqui vamos a calcular el subtotal
   * de cada item del pedido, multiplicando
   * la cantidad del producto por su precio.
   * @param it 
   * @returns 
   */
  subtotal(it: PedidoItem) {
    return it.cantidad * it.producto.precio;
  }

  /**
   * Con esto vamos a eliminar un item del pedido
   * de la mesa, si el item tiene una cantidad mayor
   * a 1, simplemente se le resta 1, si es 1, se elimina.
   * @param it 
   */
  calculoTotal() {
    this.total = this.mesa.items.reduce(
      (s, it) => s + this.subtotal(it),
      0
    );
    /**
     * Agregamos esto para calcular el valor total de lo consumido
     * pero con el agregado del 10% de la propina que es lo que
     * se suele dejar en los restaurantes en chile.
     */
    this.totalConPropina = Math.round(this.total * 1.1);
  }

  /**
   * Esta funcion nos permite eliminar un item del pedido
   * de la mesa, si el item tiene una cantidad mayor
   * a 1, simplemente se le resta 1, si es 1, se elimina.
   * @param m 
   * @returns 
   */
  totalMesa(m: Mesa): number {
    return m.items.reduce(
      (sum, it) => sum + it.cantidad * it.producto.precio,
      0
    );
  }

  // Vuelve a la pagina de inicial donde estan las mesas
  volver(id: number) {
    this.router.navigate(['/home'], { queryParams: { foco: id } });
  }
}