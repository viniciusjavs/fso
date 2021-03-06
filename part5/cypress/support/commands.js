// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username, password
  }).then( ({ body }) => {
    localStorage.setItem('loggedBlogappUser', JSON.stringify(body))
    cy.visit('http://localhost:3000')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
  cy.request({
    url: 'http://localhost:3001/api/blogs',
    method: 'POST',
    body: { title, author, url },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
    }
  })
  cy.visit('http://localhost:3000')
})

Cypress.Commands.add('likeBlog', (title, likes = 1) => {
  cy.contains(title)
    .parent()
    .parent()
    .as('theBlog')
  cy.get('@theBlog').contains('view').click()
  for (let i = 0; i < likes; ++i) {
    cy.get('@theBlog').contains('like').click()
    cy.get('@theBlog').should('contain', i + 1)
  }
})

Cypress.Commands.add('deleteBlog', title => {
  cy.contains(title)
    .parent()
    .parent()
    .as('theBlog')
  cy.get('@theBlog').contains('view').click()
  cy.get('@theBlog').contains('remove').click()
})

Cypress.Commands.add('createUser', ({ name, username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/users/', {
    name, username, password
  })
})
