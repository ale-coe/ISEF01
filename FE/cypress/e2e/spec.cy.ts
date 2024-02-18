describe('Test Login', () => {
  it('Get redirected to login and find disabled login button', () => {
    cy.visit('/');
    cy.url().should('include', 'login');
    cy.get('.login-btn').should('be.disabled');
  });
});
