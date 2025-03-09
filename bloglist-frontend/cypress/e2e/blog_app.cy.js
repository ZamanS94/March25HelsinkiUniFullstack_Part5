describe('Blog app', function() {
  beforeEach(function() {
    cy.visit('http://localhost:5173')
  })

  it('displays the login', () => {
    cy.contains('button', 'log in').click()
    cy.contains('h2', 'Login').should('be.visible')

    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')

    cy.contains('button', 'login').should('be.visible')
  })
})

describe('Blog ', function() {
  beforeEach(function() {
    cy.request('POST','http://localhost:3001/api/testing/reset')
    const user1 = {
      name: 'User1',
      username: 'user1',
      password: 'user123'
    }
    cy.request('POST', 'http://localhost:3001/api/users', user1)
    const user2 = {
      name: 'User2',
      username: 'user2',
      password: 'user123'
    }
    cy.request('POST', 'http://localhost:3001/api/users', user2)

    cy.visit('http://localhost:5173')
  })

  it('front page', function() {
    cy.contains('Blog View')
  })

  it('login succeeds', function() {
    cy.contains('log in').click()
    cy.get('#username').type('user1')
    cy.get('#password').type('user123')
    cy.get('#login-button').click()

    cy.contains('User1 logged in')
  })

  it('login failed', function() {
    cy.contains('log in').click()
    cy.get('#username').type('user1')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')
  })

  describe('logged in', function() {
    beforeEach(function() {
      cy.contains('log in').click()
      cy.get('#username').type('user1')
      cy.get('#password').type('user123')
      cy.get('#login-button').click()
  
      cy.contains('User1 logged in')
    })

    it('new blog created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('author')
      cy.get('#url').type('www.author.com')
      cy.contains('save').click()
    })

    it('user likes a blog', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('a blog created')
      cy.get('#author').type('author')
      cy.get('#url').type('www.author.com')
      cy.contains('save').click()

      cy.contains('view').click()
      cy.contains('likes: 0')
      cy.contains('like').click()
      cy.contains('likes: 1')
    })

    it('delete own blog', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Blog removed')
      cy.get('#author').type('User1')
      cy.get('#url').type('www.url.com')
      cy.contains('save').click()
    
      cy.contains('Blog removed')
      cy.contains('view').click()
      cy.contains('delete').click()
    })

    it('creator see the delete button', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('User1 Blog')
      cy.get('#author').type('User1')
      cy.get('#url').type('www.user1.com')
      cy.contains('save').click()

      cy.contains('view').click()
      cy.contains('delete')
      cy.contains('logout').click()
    
      cy.get('#username').type('user2')
      cy.get('#password').type('user123')
      cy.get('#login-button').click()
  
      cy.contains('User2 logged in')
      cy.contains('view').click()

      cy.contains('delete').should('not.exist')
    })

    it('blogs are ordered by likes', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('User1 one Blog')
      cy.get('#author').type('User1')
      cy.get('#url').type('www.user11.com')
      cy.contains('save').click()
    
      cy.contains('new blog').click()
      cy.get('#title').type('User1 two Blog')
      cy.get('#author').type('user1')
      cy.get('#url').type('www.user12.com')
      cy.contains('save').click()
    
      cy.contains('User1 two Blog').contains('view').click()
      cy.contains('like').click()
      cy.contains('like').click()
      cy.contains('like').click()
    
      cy.get('.blog').first().should('contain', 'User1 two Blog')
    })
  })
})