import { LoginPage } from '../support/pages/login.page';

describe('TableMaster – Login', () => {
    const page = new LoginPage();

    it('La pagina carga y se inicia sesion', () => {
        page.login('e2e@tablemaster.com', 'Pass1234');
        page.title().should('have.text', 'TableMaster');
    });
});