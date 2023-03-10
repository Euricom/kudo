import { Component } from 'react'

describe('template spec', () => {
    it('chooses a template', () => {
        cy.login(Cypress.env('username') as string, Cypress.env('password') as string)

        cy.get('[data-cy=NavButtons]').should('exist')
        cy.get('[data-cy=FAB]').click()
        cy.get('[data-cy=NavbarTitle]').contains('New')
        cy.get('[data-cy=FAB]').click()
        cy.get('[data-cy=NavbarTitle]').contains('Templates')
        cy.get('[data-cy=templateTitle]').contains('Well done').click()
        cy.get('[data-cy=NavbarTitle]').contains('Editor')
        cy.get('[data-cy=EditorTemplateTitle]').contains('Well done')

        cy.get('[data-cy=BackArrow]').click()
        cy.get('[data-cy=NavbarTitle]').contains('Templates')
        cy.get('[data-cy=templateTitle]').contains('Terrific!').click()
        cy.get('[data-cy=NavbarTitle]').contains('Editor')
        cy.get('[data-cy=EditorTemplateTitle]').contains('Terrific!')

        cy.get('[data-cy=BackArrow]').click()
        cy.get('[data-cy=NavbarTitle]').contains('Templates')
        cy.get('[data-cy=templateTitle]').contains('Good job').click()
        cy.get('[data-cy=NavbarTitle]').contains('Editor')
        cy.get('[data-cy=EditorTemplateTitle]').contains('Good job')

    })
})