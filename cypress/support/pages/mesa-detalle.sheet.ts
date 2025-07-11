export class MesaDetalleSheet {

    private sheet() {
        return cy.get('ion-action-sheet', { timeout: 3000 });
    }

    private btnAgregar() {
        return this.sheet().contains(
          'button',
          'Agregar Productos',
          { matchCase: false, includeShadowDom: true }
        );
      }

      private btnPagar() {
        return this.sheet().contains(
          'button',
          'Pagar Mesa',
          { matchCase: false, includeShadowDom: true }
        );
      }

    agregarProductos() {
        this.btnAgregar().click();
        cy.get('[data-test="productos-title"]', { timeout: 3000 })
            .should('contain.text', 'Productos');
    }

    pagarMesa() {
        this.btnPagar().click();
        cy.get('[data-test="pago-title"]', { timeout: 3000 })
            .should('contain.text', 'Pagar Mesa');
    }
}