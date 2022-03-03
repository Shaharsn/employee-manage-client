/// <reference types="cypress" />
/// <reference types="cypress-wait-until" />

import { new_employee } from "../support/gql/new_employee";
import { new_project } from "../support/gql/new_project";
import { delete_employee } from "../support/gql/delete_employee";
import { delete_project } from "../support/gql/delete_project";
import { aliasQuery, aliasMutation } from "../utils/graphql-test-utils";

describe("Our first test", () => {
  beforeEach(() => {
    // Gathering all the Graphql Queries and Mutations
    cy.intercept("POST", Cypress.env("gqlUrl"), (req) => {
      // Queries
      aliasQuery(req, "Projects");
      aliasQuery(req, "EmployeeByEmail");
      aliasQuery(req, "Employees");

      // Mutations
      aliasMutation(req, "AddEmployee");
      aliasMutation(req, "AddProject");
      aliasMutation(req, "UpdateEmployee");
      aliasMutation(req, "UpdateProject");
      aliasMutation(req, "UpdateEmployeeProjects");
      aliasMutation(req, "UpdateProjectEmployees");
      aliasMutation(req, "DeleteEmployee");
      aliasMutation(req, "DeleteProject");
    });

    cy.openHomePage();
  });

  it("Check tables visualization", () => {
    // Check visualization of the Employees table
    cy.contains("div span", "Employees")
      .parents("div.MuiPaper-root")
      .find("table thead tr")
      .first()
      .find("th")
      .then((th) => {
        cy.wrap(th).eq(0).should("contain", "Name");
        cy.wrap(th).eq(1).should("contain", "Email");
        cy.wrap(th).eq(2).should("contain", "Role");
        cy.wrap(th).eq(3).should("contain", "Assigned Projects");
        cy.wrap(th).eq(4).should("contain", "Actions");
      });

    // Check visualization of the Projects table
    cy.contains("div span", "Projects")
      .parents("div.MuiPaper-root")
      .find("table thead tr")
      .first()
      .find("th")
      .then((th) => {
        cy.wrap(th).eq(0).should("contain", "Name");
        cy.wrap(th).eq(1).should("contain", "Description");
        cy.wrap(th).eq(2).should("contain", "Assigned Users");
        cy.wrap(th).eq(3).should("contain", "Actions");
      });
  });

  it("Add new Employee and Delete the Employee", () => {
    const testUser = {
      name: "Test User",
      email: "testuser@test.com",
      role: "Developer",
    };

    // Find and open the new Employee modal
    cy.contains("div span", "Employees")
      .parents("div.MuiCardHeader-root")
      .find("button")
      .click();

    // Fill the new Employee form
    cy.contains("div", "New Employee")
      .find("form")
      .then((form) => {
        cy.wrap(form).find('[id="name"]').type(testUser.name);
        cy.wrap(form).find('[id="email"]').type(testUser.email);
        cy.wrap(form).find('[id="role"]').click();

        cy.contains("li", testUser.role).click();
      });

    // Adding the new user to the list
    cy.contains("div", "New Employee").find("div").find("button").click();

    // Waiting for the response from GraphQL regarding "AddEmployee" mutation
    cy.wait("@gqlAddEmployeeMutation").then((xhr: any) => {
      cy.wait(500);

      console.log(xhr);
      expect(xhr.response.statusCode).to.equal(200);

      cy.contains("div span", "Employees")
        .parents("div.MuiPaper-root")
        .find("table tbody tr")
        .contains("tr", testUser.name)
        .find("th")
        .then((th) => {
          cy.wrap(th).eq(0).should("contain", testUser.name);
          cy.wrap(th).eq(1).should("contain", testUser.email);
          cy.wrap(th).eq(2).should("contain", testUser.role.toUpperCase());

          cy.wait(1500); // wait just for showing results

          // Open the Delete modal
          cy.wrap(th).find('[aria-label="delete"]').click();
        });
    });

    // Delete the new Employee form
    cy.contains("div", "Delete Employee").find("div").find("button").click();
  });

  it("Add new Project and Delete the Employee", () => {
    const testProject = {
      name: "Test Project",
      description: "Test description",
    };

    // Find and open the new Employee modal
    cy.contains("div span", "Projects")
      .parents("div.MuiCardHeader-root")
      .find("button")
      .click();

    // Fill the new Project form
    cy.contains("div", "New Project")
      .find("form")
      .then((form) => {
        cy.wrap(form).find('[id="name"]').type(testProject.name);
        cy.wrap(form).find('[id="description"]').type(testProject.description);
      });

    // Adding the new project to the list
    cy.contains("div", "New Project").find("div").find("button").click();

    // Waiting for the response from GraphQL regarding "AddProject" mutation
    cy.wait("@gqlAddProjectMutation").then((xhr: any) => {
      cy.wait(500);

      console.log(xhr);
      expect(xhr.response.statusCode).to.equal(200);

      cy.contains("div span", "Project")
        .parents("div.MuiPaper-root")
        .find("table tbody tr")
        .contains("tr", testProject.name)
        .find("th")
        .then((th) => {
          cy.wrap(th).eq(0).should("contain", testProject.name);
          cy.wrap(th).eq(1).should("contain", testProject.description);

          cy.wait(1500); // wait just for showing results

          // Open the Delete modal
          cy.wrap(th).find('[aria-label="delete"]').click();
        });
    });

    // Delete the new Project form
    cy.contains("div", "Delete Project").find("div").find("button").click();
  });

  it("Assign employee to projects", () => {
    // Adding new Employee and Project by using the commands - by cy.request (API - without visible clicks)
    cy.runMutation(new_employee, "addEmployee", "99999");
    cy.runMutation(new_project, "addProject", "99999");

    // W T F.... why sometimes the project not been added (not related to the time we wait)
    cy.wait(1000);

    // Get the Employee list
    cy.contains("div span", "Employees")
      .parents("div.MuiPaper-root")
      .find("table tbody tr")
      .contains("tr", "Test User")
      .find("th")
      .then((th) => {
        // Open the Employee's Project
        cy.wrap(th).eq(3).find("button").click();

        // sign the new "Test Employee" to the new "Test Project"
        cy.contains("div h2", "Test User's Projects")
          .parents("div.MuiBox-root")
          .contains("li", "Test Project")
          .find("input")
          .check()
          .parents("div.MuiBox-root")
          .contains("button", "Save")
          .click();
      });

    cy.wait([
      "@gqlUpdateEmployeeProjectsMutation",
      "@gqlUpdateProjectEmployeesMutation",
    ]).then(() => {
      cy.contains("div span", "Projects")
        .parents("div.MuiPaper-root")
        .find("table tbody tr")
        .contains("tr", "Test Project")
        .find("th")
        .then((th) => {
          // Open the Project's Employees
          cy.wrap(th).eq(2).find("button").click();

          // Validate the user been added to the Project's Employees list
          cy.contains("div h2", "Test Project's Employees")
            .parents("div.MuiBox-root")
            .contains("li", "Test User")
            .find("input")
            .should("be.checked")
            .parents("div.MuiBox-root")
            .find("button")
            .first()
            .click();
        });

      cy.wait(500);

      //Delete the new User and new Project - by cy.request (API - without visible clicks)
      cy.runMutation(delete_employee, "deleteEmployee", "99999");
      cy.runMutation(delete_project, "deleteProject", "99999");

      cy.reload();
    });
  });
});
