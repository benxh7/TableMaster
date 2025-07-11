export class PedidoPage {
    esperar() {
        cy.get('[data-test="pedido-title"]',
          { timeout: 20000, includeShadowDom: true })   // ← 20 s + shadow
          .should('contain.text', 'Pedido');
      }
}