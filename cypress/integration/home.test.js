/// <reference types="cypress" />

describe("Home page", () => {
  beforeEach(() => {
    cy.fixture('courses.json').as("courseJSON");
    cy.intercept('/api/courses', "@courseJSON").as("courses")
    cy.visit("/")
  })
  it("should display a list of courses", () => {

    cy.contains("All Courses");
    cy.wait("@courses");

    cy.get("mat-card").should("have.length", 9)
  })
})
