export class Error404Page {
    /** El número 404 grande que aparece en el body */
    h1() { return cy.contains('h1', '404'); }

    navigate(bad = '/no-existe') {
        cy.visit(bad, { failOnStatusCode: false });
    }

    volverAlHome() {
        cy.contains('ion-button, a', /volver/i).click();
    }
}