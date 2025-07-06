import { browser, by, element, ExpectedConditions as EC } from 'protractor';

export class HomePage {
    private mesa = (num: number) => element(by.css(`[data-id="${num}"]`));
    private title = element(by.css('[data-test="home-title"]'));

    async navigate() {
        return browser.get('/');
    }

    async getTitle(): Promise<string> {
        await browser.wait(
            EC.textToBePresentInElement(this.title, 'Mesas'), 10000
        );
        return this.title.getText();
    }

    private mesaCard = (num: number) =>
        element(by.cssContainingText('.mesa-card .mesa-num', String(num))).element(
            by.xpath('ancestor::div[contains(@class,"mesa-card")]')
        );

    // Abre la mesa numero dos que tiene datos almacenados en la base de datos
    async abrirMesa(num = 2) {
        const card = this.mesa(num);

        await browser.wait(EC.presenceOf(card), 10000);

        // desplaza el card y pulsa vía JS
        await browser.executeScript(
            'arguments[0].scrollIntoView({block:"center"});', card.getWebElement()
        );
        await browser.wait(EC.elementToBeClickable(card), 10000);
        await browser.executeScript('arguments[0].click();', card.getWebElement());

        // el modal puede tardar: hasta 20 s
        await browser.wait(
            EC.presenceOf(element(by.css('ion-modal'))),
            20000, 'Modal de detalle no apareció'
        );
    }

}