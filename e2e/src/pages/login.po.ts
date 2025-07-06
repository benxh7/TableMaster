import { browser, by, element, ExpectedConditions as EC } from 'protractor';

export class LoginPage {
    // apuntamos al input real dentro del Shadow DOM
    private emailInput = element(by.css('ion-input[formControlName="correo"] input'));
    private passInput = element(by.css('ion-input[formControlName="contrasena"] input'));
    private submitBtn = element(by.css('ion-button[type="submit"]'));

    navigate() { return browser.get('/login'); }

    async login(email: string, password: string) {
        await browser.wait(EC.elementToBeClickable(this.emailInput), 10000);
        await this.emailInput.clear();      // por si el navegador autocompleta
        await this.emailInput.sendKeys(email);
        await this.passInput.sendKeys(password);
        await this.submitBtn.click();

        // espera a que aparezca el título de Home → «Mesas»
        await browser.wait(
            EC.presenceOf(element(by.css('[data-test="home-title"]'))),
            10000,
            'No se redirigió al Home después de login'
        );
    }

    // (sigue igual por si aún quieres testear el título de login)
    private title = element(by.css('[data-test="login-title"]'));
    async getTitle() {
        await browser.wait(EC.textToBePresentInElement(this.title, 'TableMaster'), 10000);
        return this.title.getText();
    }
}