describe('Test the basic', () => {
    it('Create a User"', () => {

        // Create the user
        cy.visit('/');
        cy.contains('Sign up').dblclick();

        cy.get('input').should('have.length', 6);
        cy.get('input').eq(1).clear().type("heytester1");
        cy.get('input').eq(2).clear().type("heytester1");
        cy.get('input').eq(3).clear().type("heytester1");
        cy.get('input').eq(4).clear().type("heytester1@heytester1.fr");
        cy.get('input').eq(5).clear().type("heytester1");

        cy.get('form').submit();
        cy.contains('Sign in').click();

        // Login
        cy.get('input').should('have.length', 2);
        cy.get('input').eq(0).clear().type("heytester1");
        cy.get('input').eq(1).clear().type("heytester1");

        cy.get('form').submit();
        cy.contains('No articles are here');

        // Create New Post
        cy.contains('New Post').click();
        cy.contains('Drop files here to upload');

        cy.get('input').should('have.length', 9);
        cy.get('input').eq(0).type("inserted");
        cy.contains('Publish Product').click();
        cy.contains('inserted');

        cy.contains('Home').click();
        cy.wait(1000);
        cy.contains('inserted');

    })

    it('Delete the test user', () => {
        cy.visit('/login');

        cy.get('input').should('have.length', 2);
        cy.get('input').eq(0).clear().type("heytester1");
        cy.get('input').eq(1).clear().type("heytester1");

        cy.get('form').submit();
        cy.wait(1000);

        // Delete User
        cy.visit('/settings');
        cy.wait(1000);
        cy.contains('Delete User').click();
        cy.wait(1000);

        // // Try to login when User has been deleted
        cy.visit('/login');
        // Login
        cy.get('input').should('have.length', 2);
        cy.get('input').eq(0).clear().type("heytester1");
        cy.get('input').eq(1).clear().type("heytester1");
        cy.contains('Sign in').click();

        cy.contains('Unable to log in with provided credentials');
        cy.should('have.text', 'non_field_errors : Unable to log in with provided credentials.');

    })
})