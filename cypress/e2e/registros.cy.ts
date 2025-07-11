import { LoginPage } from '../support/pages/login.page';
import { RegistrosPage } from '../support/pages/registros.page';

describe('TableMaster – Registros', () => {
    const login = new LoginPage();
    const records = new RegistrosPage();

    before(() => {
        login.login('e2e@tablemaster.com', 'Pass1234');
        records.navigate();
    });

    it('La página muestra el título "Registros"', () => {
        records.getTitle().should('equal', 'Registros');
    });
});