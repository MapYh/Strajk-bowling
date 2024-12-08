import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Router } from "react-router-dom";

import { setupServer } from "msw/node";
import { handlers } from "./mocks/handlers.js";

import App from "./App";
import Booking from "./views/Booking";
import Confirmation from "./views/Confirmation";

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
        <MemoryRouter initialEntries={["/Booking"]}>
          <Routes>
            <Route path="/Booking" element={<Booking />} />
          </Routes>
        </MemoryRouter>
        {/* <Router>
          <Booking />
        </Router> */}
      </>
    );
    const strike_button = screen.getAllByRole("button");
    strike_button[1].click();
    render();
    expect(
      screen.getByText("Alla fälten måste vara ifyllda")
    ).toBeInTheDocument();
  }); //Grön VG//Grön

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
      when: "2024-12-08T15:30",
      people: "2",
      lanes: "2",
      id: "12345",
      price: "500",
    });

    global.sessionStorage.setItem("confirmation", JSON.stringify(data));
    render(
      <MemoryRouter initialEntries={["/confirmation"]}>
        <Routes>
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </MemoryRouter>
    );

    const inputTime = screen.getAllByRole("textbox", { type: "text" });
    // Check that the confirmation details are rendered correctly
    expect(inputTime[0].value).toBe("2024-12-08 15:30");
    expect(inputTime[1].value).toBe("2");
    expect(inputTime[2].value).toBe("2");
    expect(inputTime[3].value).toBe("12345");
    expect(screen.getByText("Total:")).toBeInTheDocument();
    expect(screen.getByText("500 sek")).toBeInTheDocument();

    // Check that the "Inga bokning gjord!" text is NOT displayed
    expect(screen.queryByText("Inga bokning gjord!")).toBeNull();
  }); //Grön

  it("Should check that user can navigate from the booking page to the confirmation page when the booking is done.", async () => {
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
      when: "2024-12-08T15:30",
      people: "2",
      lanes: "2",
      id: "12345",
      price: "500",
    });

    global.sessionStorage.setItem("confirmation", JSON.stringify(data));
    render(
      <MemoryRouter initialEntries={["/confirmation"]}>
        <Routes>
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </MemoryRouter>
    );

    const inputTime = screen.getAllByRole("textbox", { type: "text" });
    // Check that the confirmation details are rendered correctly
    expect(inputTime[0].value).toBe("2024-12-08 15:30");
    expect(inputTime[1].value).toBe("2");
    expect(inputTime[2].value).toBe("2");
    expect(inputTime[3].value).toBe("12345");
    expect(screen.getByText("Total:")).toBeInTheDocument();
    expect(screen.getByText("500 sek")).toBeInTheDocument();

    // Check that the "Inga bokning gjord!" text is NOT displayed
    expect(screen.queryByText("Inga bokning gjord!")).toBeNull();
    //Confirms that we are on the confirmation page.
    expect(screen.getByText("See you soon!")).toBeInTheDocument();

    const navigate_button = screen.getAllByRole("img");
    navigate_button[0].click();

    const Booking_button = screen.getByRole("link", {
      name: "Booking",
    });

    Booking_button.click();
    const booking_heading = screen.getByRole("heading");

    expect(booking_heading).toBeInTheDocument();

    //And check that the user can go back to the confirmation page again.
    navigate_button[0].click();
    const confirmation_button = screen.getByRole("link", {
      name: "Booking",
    });
    confirmation_button.click();
    expect(screen.getByText("See you soon!")).toBeInTheDocument();
  }); //Grön
});
