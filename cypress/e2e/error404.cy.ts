import { Error404Page } from '../support/pages/error404.page';

describe('Rutas inexistentes – Error 404', () => {
    const error = new Error404Page();

    it('Muestra la página 404 al navegar a una URL desconocida', () => {
        error.navigate('/ruta/que/no-existe');
        error.h1().should('be.visible');
    });

    it('Permite volver al Home desde la pagina 404', () => {
        error.navigate('/otra/ruta-fallida');
        error.volverAlHome();
        cy.url().should('include', '/home');
    });
});