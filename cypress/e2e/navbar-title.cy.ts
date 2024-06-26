import { Component } from 'react'

describe('navbar title spec', () => {
  it('passes', () => {
    cy.login(Cypress.env('username') as string, Cypress.env('password') as string)

    cy.get('[data-cy=NavButtons]').should('exist')

    cy.get('[data-cy=NavButtonsLabel]').click()
    cy.get('[data-cy=Out]').click()
    cy.get('[data-cy=NavButtons]').should('exist')

    cy.get('[data-cy=NavButtonsLabel]').click()
    cy.get('[data-cy=All]').click()
    cy.get('[data-cy=NavButtons]').should('exist')

    cy.get('[data-cy=NavButtonsLabel]').click()
    cy.get('[data-cy=In]').click()
    cy.get('[data-cy=NavButtons]').should('exist')

    cy.get('[data-cy=FAB]').click()
    cy.get('[data-cy=NavButtons]').should('not.exist')
    cy.get('[data-cy=NavbarTitle]').contains('New')
    cy.get("[data-cy=optionSession]").first().invoke('text').then((Title) => {
      cy.get('[data-cy=optionSpeaker]').first().invoke('text').then((Speaker) => {
        cy.get('[data-cy=Session]').get('input[list=Session]').type(Title)
        cy.get('[data-cy=Speaker]').get('input[list=Speaker]').type(Speaker)
      })
    })

    cy.get('[data-cy=FAB]').click()
    cy.get('[data-cy=NavButtons]').should('not.exist')
    cy.get('[data-cy=NavbarTitle]').contains('Templates')

    cy.get('[data-cy=templateTitle]').first().click()
    cy.get('[data-cy=NavButtons]').should('not.exist')
    cy.get('[data-cy=NavbarTitle]').contains('Editor')

    cy.wait(2000)

    cy.get('[data-cy=FAB]').click()
    cy.get('[data-cy=Yes]').click()
    cy.get('[data-cy=NavButtons]').should('exist')

    cy.get("[data-cy=Kudo]").first().invoke('text').then((Title) => {
      cy.get('[data-cy=Kudo]').first().click()
      cy.get('[data-cy=NavbarTitle]').contains('Kudo ' + Title).should("exist")
      cy.get('[data-cy=deleteButton]').click()
    })
    cy.get('[data-cy=NavButtons]').should('exist')

    cy.get('[data-cy=NavButtonsLabel]').click()
    cy.get('[data-cy=In]').click()

    cy.get("[data-cy=Session]").first().invoke('text').then((Title) => {
      cy.get('[data-cy=Session]').first().click()
      cy.get('[data-cy=NavbarTitle]').contains('Session: ' + Title)
    })

    cy.get('[data-cy=BackArrow]').click()
    cy.get('[data-cy=NavButtons]').should('exist')
    cy.get('[data-cy=NavButtonsLabel]').click()
    cy.get('[data-cy=Out]').click()

    cy.get("[data-cy=Kudo]").first().invoke('text').then((Title) => {
      cy.get('[data-cy=Kudo]').first().click()
      cy.get('[data-cy=NavbarTitle]').contains('Kudo ' + Title)
    })
  })
})