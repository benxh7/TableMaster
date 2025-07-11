export class HomePage {
    private title() { return cy.get('[data-test="home-title"]'); }
    private mesa = (num = 2) => cy.get(`[data-id="${num}"]`);
    private sheet() { return cy.get('ion-action-sheet'); }

    navigate() { cy.visit('/'); }

    getTitle() {
        return cy.get('[data-test="home-title"]')
            .should('contain.text', 'Mesas')
            .invoke('text');
    }

    abrirMesa(num = 2) {
        this.mesa(num).scrollIntoView().click({ force: true });
        this.sheet().should('be.visible');
    }
}