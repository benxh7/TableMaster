import { by, element, ExpectedConditions as EC, browser } from 'protractor';

export class MesaDetalleModal {
    private btnAgregar = element(by.cssContainingText('ion-button', 'Agregar Productos'));
    private btnPagar = element(by.cssContainingText('ion-button', 'Pagar Mesa'));

    async agregarProductos() {
        await this.btnAgregar.click();
        await browser.wait(
            EC.textToBePresentInElement(
                element(by.css('[data-test="productos-title"]')), 'Productos'
            ), 15000
        );
    }

    async pagarMesa() {
        await this.btnPagar.click();
        await browser.wait(
            EC.textToBePresentInElement(
                element(by.css('[data-test="pago-title"]')), 'Pagar Mesa'
            ), 15000
        );
    }
}