import { api } from '~/utils/api'

describe('template spec', () => {
    it('chooses a template', () => {
        cy.login(Cypress.env('username') as string, Cypress.env('password') as string)

        cy.get('[data-cy=NavButtons]').should('exist')
        cy.get('[data-cy=FAB]').click()
        cy.get('[data-cy=NavbarTitle]').contains('New')
        cy.get("[data-cy=optionSession]").first().invoke('text').then((Title) => {
            cy.get('[data-cy=optionSpeaker]').first().invoke('text').then((Speaker) => {
                cy.get('[data-cy=Session]').get('input[list=Session]').type(Title)
                cy.get('[data-cy=Speaker]').get('input[list=Speaker]').type(Speaker)
            })
        })
        cy.get('[data-cy=FAB]').click()
        cy.get('[data-cy=NavbarTitle]').contains('Templates')

        cy.get('[data-cy=template]').its('length').then(length => {
            for (let index = 0; index < length; index++) {
                cy.get('[data-cy=template]').eq(index).invoke('attr', 'data-id').then((id) => {
                    cy.get('[data-cy=template]').eq(index).click()
                    cy.get('[data-cy=NavbarTitle]').contains('Editor')
                    cy.get(`[data-cy=${id ?? ""}]`).should('exist')
                    cy.get('[data-cy=BackArrow]').as('backArrow').click()
                    cy.get('[data-cy=NavbarTitle]').contains('Templates')
                })
            }
        })
    })
})