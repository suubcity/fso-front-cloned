describe('Note app', function () {
	beforeEach(function () {
		cy.request('POST', 'http://localhost:3001/api/testing/reset');
		const user = {
			name: 'Matti Luukkainen',
			username: 'mluukkai',
			password: 'salainen',
		};
		cy.request('POST', 'http://localhost:3001/api/users/', user);
		cy.visit('http://localhost:3000');
	});

	it('front page can be opened', function () {
		cy.contains('Notes');
		cy.contains('Note app, Department of Computer Science, University of Helsinki 2021');
	});

	it('user can log in', function () {
		cy.contains('log in').click();
		cy.get('#username').type('mluukkai');
		cy.get('#password').type('salainen');
		cy.get('#login-button').click();

		cy.contains('Matti Luukkainen logged in');
	});

	it('login fails with wrong password', function () {
		cy.contains('log in').click();
		cy.get('#username').type('mluukkai');
		cy.get('#password').type('wrong');
		cy.get('#login-button').click();

		cy.get('.error').should('contain', 'wrong credentials');

		cy.get('html').should('not.contain', 'Matti Luukainen logged in');
	});

	describe('when logged in', function () {
		beforeEach(function () {
			cy.login({ username: 'mluukkai', password: 'salainen' });
		});

		it('a new note can be created', function () {
			cy.contains('new note').click();
			cy.get('input').type('a note created by cypress');
			cy.contains('save').click();
			cy.contains('a note created by cypress');
		});

		describe('and a note exists', function () {
			beforeEach(function () {
				cy.createNote({ content: 'first note', important: false });
				cy.createNote({ content: 'second note', important: false });
				cy.createNote({ content: 'third note', important: false });
			});

			it('other of those can be made important', function () {
				cy.contains('second note').parent().find('button').as('theButton');
				cy.get('@theButton').click();
				cy.get('@theButton').should('contain', 'make not important');
			});
		});
	});
});
