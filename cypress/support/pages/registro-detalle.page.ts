export class RegistroDetallePage {
    private title() { return cy.get('[data-test="registro-detalle-title"]'); }

    esperar() { this.title().should('be.visible'); }
}