import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { setupServer } from "msw/node";
import { handlers } from "./mocks/handlers.js";
import { http, HttpResponse } from "msw";

import App from "./App";
import Booking from "./views/Booking";
import Confirmation from "./views/Confirmation";

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
  it("Should check that if a user navigates to the confirmation page before booking the right message displays.", () => {
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

  it("Should check the navigaton from the booking page to the confirmation page when a booking is done.", async () => {
    //Mock server response
    server.use(
      http.post(
        "https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com",
        () => {
          return HttpResponse.json({
            when: "2024-12-08T15:30",
            people: "2",
            lanes: "2",
            id: "12345",
            price: "440",
          });
        }
      )
    );
    render(
      <>
        <App />
        <MemoryRouter initialEntries={["/booking"]}>
          <Routes>
            <Route path="/Booking" element={<Booking />} />
            <Route path="/Booking" element={<Confirmation />} />
          </Routes>
        </MemoryRouter>
      </>
    );
    //Fill the booking fields.
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: "2024-12-08" },
    });

    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "15:30" },
    });

    fireEvent.change(screen.getByLabelText(/Number of awesome bowlers/i), {
      target: { value: "2" },
    });

    fireEvent.change(screen.getByLabelText(/Number of lanes/i), {
      target: { value: "2" },
    });
    for (let i = 0; i < 2; i++) {
      fireEvent.click(screen.getByText("+"));
    }
    for (let index = 1; index < 3; index++) {
      let shoe = screen.getByLabelText(`Shoe size / person ${index}`);
      fireEvent.change(shoe, { target: { value: `3${index}` } });
      expect(shoe.value).toBe(`3${index}`);
    }
    //End of fill.
    fireEvent.click(screen.getByText(/strIIIIIike!/i));
    await waitFor(() => {
      const storedData = sessionStorage.getItem("confirmation");
      expect(storedData).toBeTruthy();
      const confirmation = JSON.parse(storedData);
      expect(confirmation.price).toBe("440");
      expect(confirmation.people).toBe("2");
      expect(confirmation.lanes).toBe("2");
      expect(confirmation.when).toBe("2024-12-08T15:30");
      expect(confirmation.id).toBe("12345");
    });

    expect(screen.getByText(/See you soon!/i)).toBeInTheDocument();
    const navigate_button = screen.getAllByRole("img");
    navigate_button[1].click();
    const booking_button = screen.getByRole("link", {
      name: "Booking",
    });
    fireEvent.click(booking_button);
    expect(screen.getByText(/When, WHAT & Who/i)).toBeInTheDocument();

    navigate_button[0].click();
    const confirmation_button = screen.getByRole("link", {
      name: "Confirmation",
    });
    fireEvent.click(confirmation_button);
    const when = screen.getByLabelText(/when/i);
    const who = screen.getByLabelText(/who/i);
    const lanes = screen.getByLabelText(/lanes/i);
    const booking_number = screen.getByLabelText(/Booking number/i);
    expect(screen.getByText(/See you soon!/i)).toBeInTheDocument();
    expect(when.value).toBe("2024-12-08 15:30");
    expect(who.value).toBe("2");
    expect(lanes.value).toBe("2");
    expect(booking_number.value).toBe("12345");
    expect(screen.getByText("Total:")).toBeInTheDocument();
    expect(screen.getByText("440 sek")).toBeInTheDocument();
  });
});
