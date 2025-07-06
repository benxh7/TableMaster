import { LoginPage } from './pages/login.po';
import { HomePage } from './pages/home.po';

describe('TableMaster – Home', () => {
    const login = new LoginPage();
    const home = new HomePage();

    beforeAll(async () => {
        await login.navigate();
        await login.login('e2e@tablemaster.com', 'Pass1234');
    });

    it('La pagina carga correctamente', async () => {
        const text = await home.getTitle();
        expect(text).toEqual('Mesas');
    });
});