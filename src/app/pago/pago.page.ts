import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MesaService, Mesa, PedidoItem } from '../services/mesa.service';
import { HistorialService } from '../services/historial.service';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
  standalone: false
})
export class PagoPage implements OnInit {

  mesa!: Mesa;
  total = 0;
  propinaCtrl = new FormControl(0);
  totalConPropina = 0;

  constructor(
    private mesaSrv: MesaService,
    private route: ActivatedRoute,
    private router: Router,
    private histSrv: HistorialService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('mesaId')!;
    this.mesa = this.mesaSrv.getMesa(id);
    this.calcTotal();
    this.propinaCtrl.valueChanges.subscribe(() => this.calcTotal());
  }

  subtotal(it: PedidoItem) { return it.cantidad * it.producto.precio; }

  calcTotal() {
    this.total = this.mesa.items.reduce((s, it) => s + this.subtotal(it), 0);
    const p = Number(this.propinaCtrl.value) || 0;
    this.totalConPropina = Math.round(this.total * (1 + p / 100));
  }

  /**
   * Cuando confirmamos que el pago se hizo automaticamente
   * liberamos la mesa y volvemos a la pantalla de inicio.
   * 
   * Adicional a eso generamos un registro en el historial
   * con los datos de la mesa, garzon, fecha, personas,
   * items, total, propina y total final.
   * 
   * Esto para tener un control de los pagos realizados
   * y lo que se esta vendiendo.
   */
  cobrar() {
    const reg = {
      id: crypto.randomUUID(),
      numeroMesa: this.mesa.numero,
      garzon: this.mesa.garzon,
      fecha: new Date(),
      personas: this.mesa.ocupantes,
      items: [...this.mesa.items],
      total: this.total,
      propina: Number(this.propinaCtrl.value) || 0,
      totalFinal: this.totalConPropina,
    };
    this.histSrv.add(reg);

    this.mesaSrv.liberar(this.mesa.id);
    this.router.navigate(['/home'], { queryParams: { foco: this.mesa.id } });
  }
}
