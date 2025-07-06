import { element, by, browser } from 'protractor';
import { LoginPage } from './pages/login.po';
import { HomePage } from './pages/home.po';
import { MesaDetalleModal } from './pages/mesa-detalle.po';
import { ProductosPage } from './pages/productos.po';
import { PagoPage } from './pages/pago.po';
import { PedidoPage } from './pages/pedido.po';

describe('Flujo mesa 2 – productos, pedido y pago', () => {
    const login = new LoginPage();
    const home = new HomePage();
    const modal = new MesaDetalleModal();
    const products = new ProductosPage();
    const payPage = new PagoPage();
    const order = new PedidoPage();

    beforeAll(async () => {
        await login.navigate();
        await login.login('e2e@tablemaster.com', 'Pass1234');
    });

    /*it('navega a Productos desde la mesa 2', async () => {
        await home.abrirMesa(2);
        await modal.agregarProductos();
        expect(await products.getTitle()).toEqual('Productos');
    });

    it('vuelve a Home y navega a Pagar Mesa', async () => {
        await products.volverAMesa();
        await home.abrirMesa(2);
        await modal.pagarMesa();
        await payPage.esperar();
        expect(await element(by.css('[data-test="pago-title"]')).getText())
            .toContain('Pagar Mesa');
    });*/

    it('accede al pedido (ruta /pedido)', async () => {
        await browser.get('/pedido?mesaId=2');
        await order.esperar();
        expect(await element(by.css('[data-test="pedido-title"]')).getText())
            .toContain('Pedido');
    });
});