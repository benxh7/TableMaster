import { LoginPage } from '../support/pages/login.page';
import { HomePage } from '../support/pages/home.page';
import { MesaDetalleSheet } from '../support/pages/mesa-detalle.sheet';
import { ProductosPage } from '../support/pages/productos.page';
import { PagoPage } from '../support/pages/pago.page';
import { PedidoPage } from '../support/pages/pedido.page';

describe('Flujo mesa 2 – productos, pedido y pago', () => {
  const login = new LoginPage();
  const home = new HomePage();
  const modal = new MesaDetalleSheet();
  const product = new ProductosPage();
  const pago = new PagoPage();
  const pedido = new PedidoPage();

  before(() => login.login('e2e@tablemaster.com', 'Pass1234'));

  it('navega a Productos desde la mesa 2', () => {
    home.abrirMesa(2);
    modal.agregarProductos();
    product.getTitle().should('equal', 'Productos');
  });

  /*it('vuelve a Home y navega a Pagar Mesa', () => {
    product.volverAMesa();
    home.abrirMesa(2);
    modal.pagarMesa();
    pago.esperar();
  });*/

  /*it('accede al pedido (ruta /pedido)', () => {
    cy.visit('/pedido?mesaId=2', { failOnStatusCode: false });
    cy.url().should('include', '/pedido?mesaId=2');
    pedido.esperar();
  });*/
});