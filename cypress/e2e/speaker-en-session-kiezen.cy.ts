import { Component } from 'react'

describe('session and speaker spec', () => {
    it('chooses a session and speaker', () => {
        cy.login(Cypress.env('username') as string, Cypress.env('password') as string)

        cy.get('[data-cy=NavButtons]').should('exist')
        cy.get('[data-cy=FAB]').click()
        cy.get('[data-cy=NavbarTitle]').contains('New')

        cy.get('[data-cy=Speaker]').get('input[list=Speaker]').type('Kobe Dehandschutter')
        cy.get('[data-cy=Session]').get('input[list=Session]').type('Ted Talk 1')
        cy.get('[data-cy=FAB]').click()

        cy.get('[data-cy=NavbarTitle]').contains('Templates')
        cy.get('[data-cy=session]').contains('Session: Ted Talk 1')
        cy.get('[data-cy=speaker]').contains('Speaker: Kobe Dehandschutter')


    })
})