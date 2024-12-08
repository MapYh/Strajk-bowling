import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import { setupServer } from "msw/node";
import { handlers } from "./mocks/handlers.js";

import App from "./App";
import Booking from "./views/Booking";

// Start the mock server before all tests
beforeAll(() => {
  server.listen();
  console.log("MSW Server started!");
});

// Reset any request handlers after each test (to avoid test pollution)
afterEach(() => server.resetHandlers());

// Stop the mock server after all tests
afterEach(() => {
  server.resetHandlers();
  sessionStorage.clear(); // Clear sessionStorage after each test
});

afterAll(() => server.close());

export const server = setupServer(...handlers);

describe("App", () => {
  it("Should check that if a user navigates to the confirmation page before booking the right messages displays.", () => {
    render(
      <>
        <App />
      </>
    );

    const navigate_button = screen.getAllByRole("img");
    navigate_button[0].click();
    const confirmation_button = screen.getByRole("link", {
      name: "Confirmation",
    });

    confirmation_button.click();
    sessionStorage.clear();
    render();

    expect(screen.getByText("Inga bokning gjord!")).toBeInTheDocument();
  }); //Grön

  it("Should check that a message is display if a user tries to create a booking without entering all the necessary information.", async () => {
    render(
      <>
        <Router>
          <Booking />
        </Router>
      </>
    );
    const strike_button = screen.getAllByRole("button");
    strike_button[1].click();
    render();
    expect(
      screen.getByText("Alla fälten måste vara ifyllda")
    ).toBeInTheDocument();
  }); //Grön VG

  /*
 it("Should check that a booking is displayed.", async () => {
    const response = await fetch(
      "https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com",
      {
        method: "GET",
        headers: {
          "x-api-key": "738c6b9d-24cf-47c3-b688-f4f4c5747662",
        },
      }
    );
    const data = await response.json();
    
    sessionStorage.setItem(data.key, data.value);

    expect(response.status).toBe(200);
    expect(response.statusText).toBe("OK");
    expect(await data).toEqual({
      datum: "2024-12-08",
      time: "15:30",
      number_of_bowlers: "2",
      number_of_lanes: "2",
      shoe_size: "14",
    });
    render(
      <>
        <Router>
          <Booking />
        </Router>
      </>
    );
    const strike_button = screen.getAllByRole("button");
    console.log("buttons", strike_button);
    strike_button[1].click();
    render();
    

    expect(screen.getByText("Datum: 2024-12-08")).toBeInTheDocument();
    expect(screen.getByText("Tid: 15:30")).toBeInTheDocument();
    expect(screen.getByText("Banor: 2")).toBeInTheDocument();
    expect(screen.getByText("Bowlare: 2")).toBeInTheDocument(); 
  });*/

  /*  it("Should check that user can navigate to the booking page.", () => {
    render(
      <>
        <App />
      </>
    );

    const navigate_button = screen.getAllByRole("img");
    navigate_button[0].click();
    const confirmation_button = screen.getByRole("link", {
      name: "Confirmation",
    });

    confirmation_button.click();

    render();

    expect(screen.getByText("Inga bokning gjord!")).toBeInTheDocument();
  }); */
});
