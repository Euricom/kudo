import { Component } from 'react'

describe('toolbar spec', () => {
  it('checks the toolbar', () => {
    cy.viewport(375, 667)
    cy.login(Cypress.env('username') as string, Cypress.env('password') as string)

    cy.get('[data-cy=NavButtons]').should('exist')
    cy.get('[data-cy=Footer]').should('exist')

    cy.get('[data-cy=FAB]').click()
    cy.get('[data-cy=NavButtons]').should('not.exist')
    cy.url().should('eq', 'http://localhost:3000/create')
    cy.get('[data-cy=HomeButton]').click()
    cy.get('[data-cy=NavButtons]').should('exist')
    cy.url().should('eq', 'http://localhost:3000/')
    cy.get('[data-cy=CloseMenu]').should('not.be.visible')
    cy.get('[data-cy=AccountButton]').click()
    cy.get('[data-cy=Menu]').should('exist')
    cy.get('[data-cy=SignOut]').should('exist')
    cy.get('[data-cy=CloseMenu]').click()
    cy.get('[data-cy=CloseMenu]').should('not.be.visible')

    
  })
})