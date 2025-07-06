import { browser, by, element, ExpectedConditions as EC } from 'protractor';

export class ProductosPage {
    private title = element(by.css('[data-test="productos-title"]'));
    private fabVolver =
        element(by.cssContainingText('ion-fab-button ion-icon', 'return-down-back'))
            .element(by.xpath('ancestor::ion-fab-button'));

    async navigate() {
        return browser.get('/productos');
    }

    async getTitle(): Promise<string> {
        await browser.wait(EC.textToBePresentInElement(this.title, 'Productos'), 10000);
        return this.title.getText();
    }

    async volverAMesa() {
        await browser.wait(EC.elementToBeClickable(this.fabVolver), 15000);
        await this.fabVolver.click();
        await browser.wait(
            EC.textToBePresentInElement(
                element(by.css('[data-test="home-title"]')), 'Mesas'
            ),
            15000
        );
    }
}