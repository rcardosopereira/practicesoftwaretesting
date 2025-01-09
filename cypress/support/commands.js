import { faker } from '@faker-js/faker';

Cypress.Commands.add('fillRegistrationForm', () => {
  cy.get('[data-test="first-name"]').type(faker.person.firstName());
  cy.get('[data-test="last-name"]').type(faker.person.lastName());
  cy.get('[data-test="dob"]').type('1990-12-12');
  cy.get('[data-test="address"]').type(faker.location.streetAddress());
  cy.get('[data-test="postcode"]').type(faker.location.zipCode());
  cy.get('[data-test="city"]').type(faker.location.city());
  cy.get('[data-test="state"]').type(faker.location.state());
  cy.get('[data-test="country"]').select('PT');
  cy.get('[data-test="phone"]').type('123456789');
  cy.get('@userData').then((userData) => {
    cy.get('[data-test="email"]').clear().type(userData.user);
    cy.get('[data-test="password"]').type(userData.password);
  });
  cy.get('[data-test="register-submit"]').click();
});