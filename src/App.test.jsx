import { fireEvent, render, screen } from "@testing-library/react";

import { setupServer } from "msw/node";
import { handlers } from "./mocks/handlers.js";

import App from "./App";

export const server = setupServer(...handlers);

// Start the mock server before all tests
beforeAll(() => {
  server.listen();
  console.log("MSW Server started!");
});
afterAll(() => server.close());
// Stop the mock server after all tests
afterEach(() => {
  server.resetHandlers();
});

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

    fireEvent.click(confirmation_button);

    expect(screen.getByText("Inga bokning gjord!")).toBeInTheDocument();
  });

  it("Should check the navigaton to and from the booking page.", async () => {
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

    fireEvent.click(confirmation_button);
    expect(screen.getByText("Inga bokning gjord!")).toBeInTheDocument();

    navigate_button[0].click();
    const booking_button = screen.getByRole("link", {
      name: "Booking",
    });
    fireEvent.click(booking_button);

    expect(screen.getByText("When, WHAT & Who")).toBeInTheDocument();
  });
});
