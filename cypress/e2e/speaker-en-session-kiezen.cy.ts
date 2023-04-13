import { Component } from 'react'

describe('session and speaker spec', () => {
    it('chooses a session and speaker', () => {
        cy.login(Cypress.env('username') as string, Cypress.env('password') as string)

        cy.get('[data-cy=NavButtons]').should('exist')
        cy.get('[data-cy=FAB]').click()
        cy.get('[data-cy=NavbarTitle]').contains('New')

        cy.get("[data-cy=optionSession]").first().invoke('text').then((Title) => {
            cy.get('[data-cy=optionSpeaker]').first().invoke('text').then((Speaker) => {
                cy.get('[data-cy=Session]').get('input[list=Session]').type(Title)
                cy.get('[data-cy=Speaker]').get('input[list=Speaker]').type(Speaker)
                cy.get('[data-cy=FAB]').click()

                cy.get('[data-cy=NavbarTitle]').contains('Templates')
                cy.get('[data-cy=session]').contains('Session: ' + Title)
                cy.get('[data-cy=speaker]').contains('Speaker: ' + Speaker)
            })
        })
    })

})