import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MesaService, Mesa, PedidoItem } from '../../services/mesa.service';
import { map, switchMap, shareReplay, combineLatest, startWith } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PagoPage implements OnInit {

  mesa!: Mesa;
  total = 0;
  propinaCtrl = new FormControl(0);
  totalConPropina = 0;

  /** observable con la mesa que llega del backend */
  readonly mesa$ = this.route.queryParamMap.pipe(
    map(p => Number(p.get('mesaId')!)),
    switchMap(id => this.mesaSrv.obtenerMesa(id)),
    shareReplay(1)
  );

  /** total sin propina */
  readonly total$ = this.mesa$.pipe(
    map(m => m.items.reduce((s, i) => s + i.cantidad * i.producto.precio, 0))
  );

  /** total + propina en % introducido por el usuario */
  readonly totalConPropina$ = combineLatest([
    this.total$,
    this.propinaCtrl.valueChanges.pipe(startWith(0))
  ]).pipe(
    map(([tot, p]) => Math.round(tot * (1 + (Number(p) || 0) / 100)))
  );

  constructor(
    private mesaSrv: MesaService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {

    // Leemos el id de la mesa
    const param = this.route.snapshot.queryParamMap.get('mesaId');
    const id    = param !== null ? Number(param) : null;
    if (id === null) { // Si no hay id volvemos a la page home
      this.router.navigate(['/home']);
      return;
    }
    
    // Obtenemos la mesa
    this.mesaSrv.obtenerMesa(id).subscribe({
      next : mesa => {
        this.mesa = mesa;
        this.calcTotal(); // Calculamos el total inicial
      },
      error: () => this.router.navigate(['/home'])
    });
  
    // Cada vez que la propina cambie la actualizamos
    this.propinaCtrl.valueChanges.subscribe(() => this.calcTotal());
  }

  /**
   * Aqui vamos a calcular el subtotal
   * de cada item del pedido, multiplicando
   * la cantidad del producto por su precio.
   * @param it 
   * @returns 
   */
  subtotal(it: PedidoItem) { return it.cantidad * it.producto.precio; }

  /**
   * Con esto vamos a calcular el total de la mesa
   * sumando el subtotal de cada item del pedido.
   * 
   * Adicionalmente calculamos el total con propina
   * que es el total de la mesa mas un porcentaje
   * que se ingresa en un campo de texto.
   */
  calcTotal() {
    if (!this.mesa?.items) {
      this.total = 0;
      this.totalConPropina = 0;
      return;
    }
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
  cobrar(mesa: Mesa) {
    const propinaPct = Number(this.propinaCtrl.value) || 0;
    const usuarioId  = 1;

    this.mesaSrv.cobrarMesa(mesa.id, propinaPct, usuarioId).subscribe({
      next: _reg => {
        this.mesaSrv.recargar();
        Haptics.impact({ style: ImpactStyle.Medium });

        Preferences.set({ key: 'propinaDefault', value: '0' });
        this.propinaCtrl.setValue(0, { emitEvent: false });

        this.router.navigate(['/home'], { queryParams:{ foco: mesa.id }});
      },
      error: () => alert('No se pudo completar el cobro')
    });
  }
}
