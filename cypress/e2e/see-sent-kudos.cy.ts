import { Component } from 'react'

describe('sent kudos bekijken', () => {
    it('sends a kudo and it should be in outbox', () => {
        cy.login(Cypress.env('username') as string, Cypress.env('password') as string)

        cy.get('[data-cy=NavButtons]').should('exist')
        cy.get('[data-cy=FAB]').click()
        cy.get('[data-cy=NavbarTitle]').contains('New')

        cy.get('[data-cy=Session]').get('input[list=Session]').type('Agile vs Scrum')
        cy.get('[data-cy=FAB]').click()
        cy.get('[data-cy=NavbarTitle]').contains('Templates')
        cy.get('[data-cy=templateTitle]').first().click()
        cy.get('[data-cy=NavbarTitle]').contains('Editor')
        cy.wait(2000)
        cy.get('[data-cy=FAB]').click()
        cy.get('[data-cy=Yes]').click()

        cy.get('[data-cy=NavButtons]').should('exist')
        cy.get('[data-cy=Kudo]').first().click()
        cy.get('[data-cy=NavbarTitle]').contains('Kudo Agile vs Scrum').should("exist")
        cy.get('[data-cy=deleteButton]').click()
        cy.get('[data-cy=Yes]').click()
        cy.get('[data-cy=NavButtons]').should('exist')
        cy.get('[data-cy=NavbarTitle]').contains('Out')

        cy.get('[data-cy=Kudo]').first().click()
        cy.get('[data-cy=NavbarTitle]').contains('Kudo Agile vs Scrum').should("not.exist")

    })
})