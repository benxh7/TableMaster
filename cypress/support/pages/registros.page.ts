export class RegistrosPage {
    private title() { return cy.get('[data-test="registros-title"]'); }

    navigate() { cy.visit('/registros'); }

    getTitle() {
        return this.title().should('contain.text', 'Registros').invoke('text');
    }
}