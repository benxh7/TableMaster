import { element, by, ExpectedConditions as EC, browser } from 'protractor';

export class PedidoPage {
    private title = element(by.css('[data-test="pedido-title"]'));

    async esperar() {
        await browser.wait(EC.textToBePresentInElement(this.title, 'Pedido'), 5000);
    }
}