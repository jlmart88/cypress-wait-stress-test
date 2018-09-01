import {NUM_REQUESTS} from "../../src";


/**
 * After a lot of toying around, I have gotten this test to fail about half of the time
 * on Electron 59 (headless), using 'cypress run'. The error will always be something like:
 *
 * """
 * CypressError: Timed out retrying: cy.wait() timed out waiting 30000ms for the 5th response to the route: 'testEndpoint'. No response ever occurred.
 * """
 *
 * The failure will sometimes (but rarely) happen when using 'cypress run --browser chrome',
 * and will almost never happen when using 'cypress open'
 *
 * The key parts for reproducing I believe to be something blocking the main thread in the application,
 * while the API calls are resolving, and performing 'cy.visit' in a '.then' block
 */
describe('stress test', () => {
  beforeEach('mock the api', () => {
    cy.server();
    cy.route('/api/endpoint/**', 'fixture:endpoint').as('testEndpoint');
    cy.fixture('endpoint').then(() => {
      cy.wait(1000);
      cy.visit('/');
    });
  });

  it(`can queue ${NUM_REQUESTS} wait commands, visit, then queue ${NUM_REQUESTS} more wait commands`, () => {
    for (let i=0; i < NUM_REQUESTS - 1; i++) {
      cy.wait('@testEndpoint');
    }

    cy.wait('@testEndpoint').then(() => {
      cy.wait(1000);
      cy.visit('/');
    });

    for (let i=0; i < NUM_REQUESTS; i++) {
      cy.wait('@testEndpoint');
    }
  });
});