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

    describe('when logged in', function () {
        beforeEach(function () {
            cy.login({username: 'root', password: 'rootPass'})
        })

        it('a blog can be created', function () {
            cy.contains('new blog').click()
            cy.get('#title').type('a title created by cypress')
            cy.get('#author').type('an author created by cypress')
            cy.get('#url').type('an url created by cypress')
            cy.contains('save').click()

            cy.contains('a title created by cypress')
        })

        describe('and more than one blog exist', function () {
            beforeEach(function () {
                cy.createBlog({
                    title: 'a title created by cypress',
                    author: 'an author created by cypress',
                    url: 'an url created by cypress'
                })
                cy.createBlog({
                    title: 'another title created by cypress',
                    author: 'an author created by cypress',
                    url: 'an url created by cypress'
                })
            })

            it('one of those can be liked', function () {
                cy.contains('another title created by cypress')
                    .parent()
                    .parent()
                    .as('theBlog')
                cy.get('@theBlog').contains('view').click()
                cy.get('@theBlog').contains('like').click()
                cy.get('@theBlog').should('contain', '1')
            })

            it('one of those can be deleted', function () {
                cy.contains('another title created by cypress')
                    .parent()
                    .parent()
                    .as('theBlog')
                cy.get('@theBlog').contains('view').click()
                cy.get('@theBlog').contains('remove').click()
                cy.contains('another title created by cypress')
                    .should('not.exist')
            })
        })

        describe('and blogs from multiple users exist', function() {
            beforeEach(function() {
                cy.createBlog({
                    title: 'a title created by cypress',
                    author: 'an author created by cypress',
                    url: 'an url created by cypress'
                })
                const user = {
                    name: "User",
                    username: "user",
                    password: "userPass"
                }
                cy.request('POST', 'http://localhost:3001/api/users/', user)
                cy.login({username: 'user', password: 'userPass'})
                cy.createBlog({
                    title: 'another title created by cypress',
                    author: 'an author created by cypress',
                    url: 'an url created by cypress'
                })
            })

            it('a user cannot delete a blog from another user', function () {
                cy.contains('a title created by cypress')
                    .parent()
                    .parent()
                    .as('theBlog')
                cy.get('@theBlog').contains('view').click()
                cy.get('@theBlog').contains('remove').click()
                cy.contains('a title created by cypress')
            })
        })
    })
})