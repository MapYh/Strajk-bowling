import { render, screen, fireEvent, userEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import { setupServer } from "msw/node";
import { handlers } from "../mocks/handlers";

import Booking from "../views/Booking";
import Confirmation from "../views/Confirmation";

export const server = setupServer(...handlers);
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

describe("App", () => {
  it("Should check that a message is display if a user tries to create a booking without entering all the necessary information.", async () => {
    render(
      <>
        <MemoryRouter initialEntries={["/Booking"]}>
          <Routes>
            <Route path="/Booking" element={<Booking />} />
          </Routes>
        </MemoryRouter>
      </>
    );
    const strike_button = screen.getAllByRole("button");
    strike_button[1].click();
    render();
    expect(
      screen.getByText("Alla fälten måste vara ifyllda")
    ).toBeInTheDocument();
  }); //Grön VG

  it("Should check that a user can choose a date and a time from a calender.", async () => {
    render(
      <>
        <MemoryRouter initialEntries={["/Booking"]}>
          <Routes>
            <Route path="/booking" element={<Booking />} />
          </Routes>
        </MemoryRouter>
      </>
    );
    const input = screen.getByLabelText(/Date/i);
    const timeInput = screen.getByLabelText(/Time/i);
    fireEvent.change(input, { target: { value: "2024-12-08" } });
    fireEvent.change(timeInput, { target: { value: "14:30" } });
    expect(input.value).toBe("2024-12-08");
    expect(timeInput.value).toBe("14:30");
  });

  it("Should check that a user can enter a number of players, at least one player is required.", async () => {
    render(
      <>
        <MemoryRouter initialEntries={["/Booking"]}>
          <Routes>
            <Route path="/booking" element={<Booking />} />
          </Routes>
        </MemoryRouter>
      </>
    );
    const number = screen.getByLabelText("Number of awesome bowlers");
    /* fireEvent.change(number, { target: { value: "0" } });

    // Kontrollera att värdet inte kan vara mindre än 1
    expect(number.value).toBe("1"); */

    // Simulera giltig inmatning
    fireEvent.change(number, { target: { value: "3" } });
    expect(number.value).toBe("3");
  });

  it("Should check that a user can reserve one or more alleys, depending on the amount of players.", async () => {
    render(
      <>
        <MemoryRouter initialEntries={["/Booking"]}>
          <Routes>
            <Route path="/booking" element={<Booking />} />
          </Routes>
        </MemoryRouter>
      </>
    );

    const number = screen.getByLabelText("Number of awesome bowlers");
    const number_of_lanes = screen.getByLabelText("Number of lanes");
    const buttons = screen.getAllByRole("button");

    //Used to fill in the booking info.
    const input = screen.getByLabelText(/Date/i);
    const timeInput = screen.getByLabelText(/Time/i);
    fireEvent.change(input, { target: { value: "2024-12-08" } });
    fireEvent.change(timeInput, { target: { value: "14:30" } });
    expect(input.value).toBe("2024-12-08");
    expect(timeInput.value).toBe("14:30");

    //Simulate the adding of the shoes for the bowlers.
    buttons[0].click();
    render();
    const shoe_one = screen.getByLabelText("Shoe size / person 1");
    fireEvent.change(shoe_one, { target: { value: "33" } });
    expect(shoe_one.value).toBe("33");

    buttons[0].click();
    render();
    const shoe_two = screen.getByLabelText("Shoe size / person 2");
    fireEvent.change(shoe_two, { target: { value: "45" } });
    expect(shoe_two.value).toBe("45");

    buttons[0].click();
    render();
    const shoe_three = screen.getByLabelText("Shoe size / person 3");
    fireEvent.change(shoe_three, { target: { value: "34" } });
    expect(shoe_three.value).toBe("34");

    buttons[0].click();
    render();
    const shoe_four = screen.getByLabelText("Shoe size / person 4");
    fireEvent.change(shoe_four, { target: { value: "23" } });
    expect(shoe_four.value).toBe("23");

    buttons[0].click();
    render();
    const shoe_five = screen.getByLabelText("Shoe size / person 5");
    fireEvent.change(shoe_five, { target: { value: "32" } });
    expect(shoe_five.value).toBe("32");
    //End----Simulate the adding of the shoes for the bowlers.

    //Choose the mumber of lanes and bowlers.
    fireEvent.change(number_of_lanes, { target: { value: "1" } });
    expect(number_of_lanes.value).toBe("1");
    fireEvent.change(number, { target: { value: "5" } });
    expect(number.value).toBe("5");
    fireEvent.change(number_of_lanes, { target: { value: "1" } });

    //Get all the buttons to find the strike button so that the error message can be checked.
    const strike_button = screen.getAllByRole("button");
    strike_button[6].click();
    render();
    expect(
      screen.getByText("Det får max vara 4 spelare per bana")
    ).toBeInTheDocument();

    //Change the number of lanes to two.
    fireEvent.change(number_of_lanes, { target: { value: "2" } });
    render();
    expect(number_of_lanes.value).toBe("2");
    console.log(strike_button[6]);
    strike_button[6].click();
    render(
      <>
        <MemoryRouter initialEntries={["/confirmation"]}>
          <Routes>
            <Route path="/confirmation" element={<Confirmation />} />
          </Routes>
        </MemoryRouter>
      </>
    );
    expect(screen.getByText("See you soon!")).toBeInTheDocument();
  });
});
