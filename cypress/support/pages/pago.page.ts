export class PagoPage {
    private title() { return cy.get('[data-test="pago-title"]'); }

    esperar() {
        this.title().should('contain.text', 'Pagar Mesa');
    }
}