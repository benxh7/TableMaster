import { element, by, ExpectedConditions as EC, browser } from 'protractor';

export class RegistroDetallePage {
    private title = element(by.css('[data-test="registro-detalle-title"]'));
  
    async esperar() {
      await browser.wait(EC.visibilityOf(this.title), 5000);
    }
  }