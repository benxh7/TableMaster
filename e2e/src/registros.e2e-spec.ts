import { LoginPage } from './pages/login.po';
import { RegistrosPage } from './pages/registros.po';

describe('TableMaster – Registros', () => {
    const login = new LoginPage();
    const records = new RegistrosPage();

    beforeAll(async () => {
        await login.navigate();
        await login.login('e2e@tablemaster.com', 'Pass1234');
        await records.navigate();
    });

    it('La pagina carga correctamente y muestra el título "Registros"', async () => {
        expect(await records.getTitle()).toEqual('Registros');
    });
});