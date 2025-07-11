/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

import { LoginPage } from './pages/login.page';
import { HomePage }  from './pages/home.page';
import { MesaDetalleSheet } from './pages/mesa-detalle.sheet';

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, pwd: string): Chainable<void>;
      abrirMesa(num?: number): Chainable<void>;
      agregarProductos(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email: string, pwd: string) => {
  new LoginPage().login(email, pwd);
});

Cypress.Commands.add('abrirMesa', (num = 2) => {
  new HomePage().abrirMesa(num);
});

Cypress.Commands.add('agregarProductos', () => {
  new MesaDetalleSheet().agregarProductos();
});

export {};
