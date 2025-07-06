import { element, by, ExpectedConditions as EC, browser } from 'protractor';

export class PagoPage {
    private title = element(by.css('[data-test="pago-title"]'));

    async esperar() {
        await browser.wait(EC.textToBePresentInElement(this.title, 'Pagar Mesa'), 5000);
    }
}