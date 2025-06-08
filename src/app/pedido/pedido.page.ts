import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MesaService, Mesa, PedidoItem } from '../services/mesa.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
  standalone: false
})
export class PedidoPage implements OnInit {
  mesa!: Mesa;
  total = 0;
  totalConPropina = 0;

  constructor(
    private mesaSrv: MesaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('mesaId')!;
    this.mesa = this.mesaSrv.getMesa(id);
    this.calculoTotal();
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

  volver() { this.router.navigate(['/home'], { queryParams: { foco: this.mesa.id } }); }
}