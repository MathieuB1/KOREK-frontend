describe('Test the basic', () => {
    it('Create a User"', () => {

        // Create the user
        cy.visit('http://localhost:4100');
        cy.contains('Sign up').dblclick();

        cy.get('input').should('have.length', 6);
        cy.get('input').eq(1).type("hey_tester");
        cy.get('input').eq(2).type("hey_tester");
        cy.get('input').eq(3).type("hey_tester");
        cy.get('input').eq(4).type("heytester@heytester.fr");
        cy.get('input').eq(5).type("hey_tester");

        cy.get('form').submit();
        cy.contains('Sign in').click();

        // Login
        cy.get('input').should('have.length', 2);
        cy.get('input').eq(0).type("hey_tester");
        cy.get('input').eq(1).type("hey_tester");

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
        cy.contains('inserted');

        // Delete User
        cy.visit('http://localhost:4100/settings');
        cy.contains('Delete User').click();

        // Timeout on travis CI
        //cy.contains('Authentication credentials were not provided');

    })
})