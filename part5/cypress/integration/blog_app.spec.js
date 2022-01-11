describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: "Superuser",
            username: "root",
            password: "rootPass"
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function () {
        cy.contains('log in')
    })

    describe('Login', function () {
	it('succeeds with correct credentials', function () {
            cy.contains('log in').click()
            cy.get('#username').type('root')
            cy.get('#password').type('rootPass')
            cy.contains('login').click()

            cy.contains('Superuser logged in')
	})

	it('fails with wrong credentials', function (){
            cy.contains('log in').click()
            cy.get('#username').type('root')
            cy.get('#password').type('wrongPass')
            cy.get('#login-button').click()

            cy.get('.notification')
		.should('contain', 'Wrong credentials')
		.and('have.css', 'color', 'rgb(255, 0, 0)')
		.and('have.css', 'border-style', 'solid')

            cy.get('.notification').should('not.contain', 'Superuser logged in')
	})
    })
})
