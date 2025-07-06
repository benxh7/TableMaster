import { LoginPage } from './pages/login.po';

describe('TableMaster – Login', () => {
    const page = new LoginPage();

    beforeEach(async () => await page.navigate());

    it('La pagina carga correctamente y se inicia sesion', async () => {
        const text = await page.getTitle();
        expect(text).toEqual('TableMaster');
    });
});