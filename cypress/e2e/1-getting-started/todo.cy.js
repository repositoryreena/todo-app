/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('example to-do app', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('http://localhost:5500')
  })

  

  it('should add a category, add a task', () => {

    cy.get('#add-category-btn').click();
    cy.get('#category-form').should('be.visible');
    cy.get('#new-category-input').type('Test Category');
    cy.get('#category-ok-btn').click();
    cy.get('#show-dropdown').should('contain', 'Test Category');
    cy.get('#category-input').should('contain', 'Test Category');
    cy.get('#category-form').should('be.hidden');

    cy.get('#add-task-btn').click();
    cy.get('#task-form').should('be.visible');
    cy.get('#task-input').type('Test Task');
    cy.get('#date-input').type('2021-12-12');
    cy.get('#category-input').select('Test Category');
    cy.get('#priority-input').select('Critical');
    cy.get('#task-ok-btn').click();

    cy.get('#add-task-btn').click();
    cy.get('#task-form').should('be.visible');
    cy.get('#task-input').type('Test Task');
    cy.get('#date-input').type('2021-12-13');
    cy.get('#category-input').select('Test Category');
    cy.get('#priority-input').select('Normal');
    cy.get('#task-ok-btn').click();

    cy.get('#add-task-btn').click();
    cy.get('#task-form').should('be.visible');
    cy.get('#task-input').type('Test Task');
    cy.get('#date-input').type('2021-12-14');
    cy.get('#category-input').select('Test Category');
    cy.get('#priority-input').select('Low');
    cy.get('#task-ok-btn').click();

    

  })

  
  

  
  
  
});
