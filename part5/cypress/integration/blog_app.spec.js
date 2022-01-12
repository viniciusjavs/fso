describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        cy.createUser({
            name: "Superuser",
            username: "root",
            password: "rootPass"
        })
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
                cy.likeBlog('another title created by cypress')
                cy.contains(1).contains('like')
            })

            it('one of those can be deleted', function () {
                cy.deleteBlog('another title created by cypress')
                cy.contains('another title created by cypress')
                    .should('not.exist')
            })

            describe('and multiple blogs are liked', function () {
                beforeEach(function() {
                    cy.createBlog({
                        title: 'one more title created by cypress',
                        author: 'an author created by cypress',
                        url: 'an url created by cypress'
                    })
                    cy.likeBlog('a title created by cypress')
                    cy.likeBlog('another title created by cypress', 2)
                    cy.likeBlog('one more title created by cypress', 3)
                })
                it('blogs are ordered according to likes', function() {
                    const blogTitles = ['a title created by cypress',
                    'another title created by cypress',
                    'one more title created by cypress']
                    blogTitles.reverse().forEach((el, i) => {
                        cy.get(`:nth-child(${i + 1}) > .full-blog > :nth-child(1)`)
                        .contains(el)
                    });
                })

            })
        })

        describe('and blogs from multiple users exist', function() {
            beforeEach(function() {
                cy.createBlog({
                    title: 'a title created by cypress',
                    author: 'an author created by cypress',
                    url: 'an url created by cypress'
                })
                cy.createUser({
                    name: "User",
                    username: "user",
                    password: "userPass"
                })
                cy.login({username: 'user', password: 'userPass'})
                cy.createBlog({
                    title: 'another title created by cypress',
                    author: 'an author created by cypress',
                    url: 'an url created by cypress'
                })
            })

            it('a user cannot delete a blog from another user', function () {
                cy.deleteBlog('a title created by cypress')
                cy.contains('a title created by cypress')
            })
        })
    })
})