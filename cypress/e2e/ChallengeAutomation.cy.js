describe('Practice Software Testing - Toolshop', () => {
    const BASE_URL = 'https://practicesoftwaretesting.com';
    
    beforeEach(() => {
      cy.fixture('data.json').as('userData');
      cy.fixture('data.json').as('passwordData');
    });
  
    describe('Homepage and Navigation', () => {
      it('should display correct application title', () => {
        cy.visit(BASE_URL);
        cy.title().should('eq', 'Practice Software Testing - Toolshop - v5.0');
      });
  
      it('should navigate to sign-in page', () => {
        cy.visit(BASE_URL);
        cy.get('[data-test="nav-sign-in"]')
          .should('be.visible')
          .click();
        cy.url().should('include', '/auth/login');
      });

      it('should navigate to registration page from login', () => {
        cy.visit(`${BASE_URL}/auth/login`);
        cy.get('[data-test="register-link"]')
          .should('be.visible')
          .click();
        cy.url().should('include', '/auth/register');
      });
    });

    describe('Registration Form Validation', () => {
        beforeEach(() => {
          cy.visit(`${BASE_URL}/auth/register`);
        });
    
        it('should display validation errors for empty form submission', () => {
          cy.get('[data-test="register-submit"]').click();
          
          const requiredFields = [
            'First name is required',
            'fields.last-name.required',
            'Date of Birth is required',
            'Address is required',
            'Postcode is required',
            'City is required',
            'State is required',
            'Country is required',
            'Phone is required.',
            'Email is required',
            'Password is required',
            'Password must be minimal 6 characters long',
            'Password can not include invalid characters.'
          ];
    
          requiredFields.forEach(error => {
            cy.contains(error).should('be.visible');
          });
        });
    
        it('should validate phone number format', () => {
          cy.get('[data-test="phone"]').type('abcdef');
          cy.get('[data-test="register-submit"]').click();
          cy.contains('Only numbers are allowed.').should('be.visible');
        });
    
        it('should validate email format', () => {
          cy.get('[data-test="email"]').type('invalid-email');
          cy.get('[data-test="register-submit"]').click();
          cy.get('[data-test="email-error"]').should('be.visible');
        });
      });

      it('Fill the form and create new user', function () {
        cy.intercept('POST', '/auth/register').as('registerRequest'); 
         cy.visit(`${BASE_URL}/auth/register`);
        cy.fillRegistrationForm();
        cy.wait(20000); 
    
        /*
        cy.wait('@registerRequest', { timeout: 10000 }).then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
        });
        */
      });
    
      it('should successfully login with registered user', () => {
        cy.visit(`${BASE_URL}/auth/login`);
        cy.get('@userData').then((userData) => {
            cy.get('[data-test="email"]').clear().type(userData.user);
            cy.get('[data-test="password"]').type(userData.password);
          });
       
        cy.get('[data-test="login-submit"]').click();
        cy.get('[data-test="nav-home"]').should('be.visible');
      });

      it('should unsuccessfully login with invalid user', () => {
        cy.visit(`${BASE_URL}/auth/login`);
        cy.get('@userData').then((userData) => {
            cy.get('[data-test="email"]').clear().type('error@mail');
            cy.get('[data-test="password"]').type(userData.password);
          });
       
        cy.get('[data-test="login-submit"]').click();
        cy.get('[data-test="nav-home"]').should('be.visible');
        cy.wait(10000); 
        cy.get('[data-test="login-error"]').should('have.text', 'Invalid email or password'); 
      });

      it('should complete purchase flow with cash on delivery', function() {
        cy.visit(`${BASE_URL}/auth/login`);
        cy.get('@userData').then((userData) => {
          cy.get('[data-test="email"]').clear().type(userData.user);
          cy.get('[data-test="password"]').type(userData.password);
          cy.get('[data-test="login-submit"]').click();
      });
      cy.wait(20000); 
      cy.get('[data-test="nav-home"]').click();
      cy.wait(20000); 
      cy.get('h5[data-test="product-name"]:contains("Combination Pliers")').click();
      cy.get('[data-test="add-to-cart"]').click();
      cy.wait(20000); 
      cy.get('[data-test="nav-cart"] > .ng-fa-icon').click();  
      cy.wait(20000); 
      cy.get('[data-test="proceed-1"]').click();
      cy.get('[data-test="proceed-2"]').click();
      cy.get('[data-test="proceed-3"]').click();
      cy.get('app-payment > .container > .row > .col-md-6 > .float-end').click();
      cy.wait(20000); 
      cy.get('[data-test="payment-method"]').select('cash-on-delivery');
      cy.get('[data-test="finish"]').click();
      cy.get('.help-block').should('have.text', 'Payment was successful');
      })
    
      

    });
    