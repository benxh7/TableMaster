export class LoginPage {
    private email() { return cy.get('ion-input[formControlName="correo"] input'); }
    private pass() { return cy.get('ion-input[formControlName="contrasena"] input'); }
    private submit() { return cy.get('ion-button[type="submit"]'); }

    navigate() { cy.visit('/login'); }

    login(email: string, pwd: string) {
        this.navigate();
        this.email().clear().type(email);
        this.pass().type(pwd);
        this.submit().click();
        cy.get('[data-test="home-title"]').should('contain.text', 'Mesas');
    }

    title() { return cy.get('[data-test="login-title"]'); }
}