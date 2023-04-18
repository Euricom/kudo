import { Component } from 'react'

describe('like and comment', () => {
    it('passes', () => {
        cy.viewport(375, 667)
        cy.exec('npx prisma db seed')

        const title = "UX/UI"
        const sessionId = "3"
        const kudoId = "testKudo"

        cy.login(Cypress.env('username') as string, Cypress.env('password') as string)
        cy.wait(4000)
        cy.get(`[data-title=${sessionId}]`).click()
        cy.get('[data-cy=NavbarTitle]').contains('Session: ' + title)
        cy.get(`[data-cy=${kudoId}liked]`).should('not.exist')
        cy.get(`[data-cy=${kudoId}notLiked]`).should('exist')
        cy.get(`[data-id=${kudoId}]`).click()
        cy.get('[data-cy=NavbarTitle]').contains('Kudo ' + title)

        cy.get(`[data-id=${kudoId}]`).should('exist')
        cy.get(`[data-cy=notLiked]`).should('exist')
        cy.get(`[data-cy=liked]`).should('not.exist')
        cy.get(`[data-cy=like]`).should('exist').click()
        cy.get(`[data-cy=notLiked]`).should('not.exist')
        cy.get(`[data-cy=liked]`).should('exist')
        cy.get(`[data-cy=comment]`).should('not.exist')

        cy.get('input[data-cy=commentInput]').type("testComment")
        cy.wait(2000)
        cy.get(`[data-cy=sendComment]`).should('exist').click()
        cy.get(`[data-cy=Yes]`).should('exist').click()
        cy.get(`[data-cy=sendComment]`).should('not.exist')
        cy.get('input[data-cy=commentInput]').should('not.exist')
        cy.get(`[data-cy=comment]`).contains("testComment").should('exist')

        cy.get('[data-cy=BackArrow]').click()
        cy.get('[data-cy=NavbarTitle]').contains('Session: ' + title)
        cy.get(`[data-cy=${kudoId}liked]`).should('exist')
        cy.get(`[data-cy=${kudoId}notLiked]`).should('not.exist')
        cy.get(`[data-id=${kudoId}]`).click()
        cy.get('[data-cy=NavbarTitle]').contains('Kudo ' + title)
        cy.get(`[data-id=${kudoId}]`).should('exist')

        cy.get(`[data-cy=notLiked]`).should('not.exist')
        cy.get(`[data-cy=liked]`).should('exist')
        cy.get(`[data-cy=like]`).should('exist').click()
        cy.get(`[data-cy=notLiked]`).should('exist')
        cy.get(`[data-cy=liked]`).should('not.exist')
        cy.get(`[data-cy=sendComment]`).should('not.exist')
        cy.get('input[data-cy=commentInput]').should('not.exist')
        cy.get(`[data-cy=comment]`).contains("testComment").should('exist')
    })
})