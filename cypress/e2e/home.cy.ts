import { LoginPage } from '../support/pages/login.page';
import { HomePage } from '../support/pages/home.page';

describe('TableMaster – Home', () => {
    const login = new LoginPage();
    const home = new HomePage();

    before(() => login.login('e2e@tablemaster.com', 'Pass1234'));

    it('La pagina carga correctamente', () => {
        home.getTitle().should('equal', 'Mesas');
    });
});