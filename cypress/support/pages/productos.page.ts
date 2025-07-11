export class ProductosPage {
    private title() { return cy.get('[data-test="productos-title"]'); }
    private fabVolver() {
        return cy.get('[data-test="volver-mesa"]');
    }

    navigate() { cy.visit('/productos'); }

    getTitle() {
        return this.title().should('contain.text', 'Productos').invoke('text');
    }

    volverAMesa() {
        this.fabVolver().click({ force: true });
        cy.get('[data-test="home-title"]', { timeout: 5000 })
            .should('contain.text', 'Mesas');
    }
}