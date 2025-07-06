import { browser, by, element, ExpectedConditions as EC } from 'protractor';

export class RegistrosPage {
    private title = element(by.css('[data-test="registros-title"]'));

    navigate() { return browser.get('/registros'); }

    async getTitle(): Promise<string> {
        await browser.wait(EC.textToBePresentInElement(this.title, 'Registros'), 10000);
        return this.title.getText();
    }
}