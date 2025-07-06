import { LoginPage } from './pages/login.po';
import { ProductosPage } from './pages/productos.po';

describe('TableMaster – Productos', () => {
    const login = new LoginPage();
    const products = new ProductosPage();

    beforeAll(async () => {
        await login.navigate();
        await login.login('e2e@tablemaster.com', 'Pass1234');
        await products.navigate();
    });

    it('La pagina carga correctamente y muestra el título "Productos"', async () => {
        expect(await products.getTitle()).toEqual('Productos');
    });
});