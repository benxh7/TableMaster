import { LoginPage } from '../support/pages/login.page';
import { ProductosPage } from '../support/pages/productos.page';

describe('TableMaster – Productos', () => {
    const login = new LoginPage();
    const productos = new ProductosPage();

    before(() => {
        login.login('e2e@tablemaster.com', 'Pass1234');
        productos.navigate();
    });

    it('La página muestra el título "Productos"', () => {
        productos.getTitle().should('equal', 'Productos');
    });
});