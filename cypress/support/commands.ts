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
declare namespace Cypress {
  interface Chainable<Subject> {
    openHomePage(): Cypress.Chainable<any>;
    runMutation(
      query: string,
      mutationName: string,
      idToCheck: string
    ): Cypress.Chainable<any>;
  }
}

Cypress.Commands.add("openHomePage", () => {
  //cy.intercept("POST", Cypress.env("gqlUrl")).as("employeeList");

  cy.visit("/");
  cy.get("input[id='email']").type("shaharshilman@gmail.com");
  cy.contains("button", "Sign In").click();

  // WAIT for the “postArticle” to return after the API call finish (getting by ‘@’)
  cy.wait("@gqlEmployeeByEmailQuery").then((xhr: any) => {
    expect(xhr.response.statusCode).to.equal(200);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(xhr.response.body.data.employeeByEmail).to.not.be.empty;
    expect(xhr.response.body.data.employeeByEmail[0].name).to.be.equal(
      "Shahar"
    );
  });
});

// Running GraphQL Mutation
Cypress.Commands.add(
  "runMutation",
  (mutation: string, mutationName: string, idToCheck: string) => {
    // New Employee/Project by cy.request (API - without visible clicks)
    return cy
      .request({
        url: Cypress.env("gqlUrl"),
        method: "POST",
        body: {
          query: mutation,
        },
      })
      .then((res) => {
        expect(res.body.data[mutationName].id).to.equal(idToCheck);

        return res;
      });
  }
);
