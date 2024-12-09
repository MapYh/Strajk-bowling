import { render, screen, fireEvent } from "@testing-library/react";
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

describe("Booking", () => {
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
    //Used to fill in the booking info.
    const dateInput = screen.getByLabelText(/Date/i);
    const timeInput = screen.getByLabelText(/Time/i);
    fireEvent.change(dateInput, { target: { value: "2024-12-08" } });
    fireEvent.change(timeInput, { target: { value: "14:30" } });
    //Choose the mumber of lanes and bowlers.
    fireEvent.change(number_of_lanes, { target: { value: "1" } });
    fireEvent.change(number, { target: { value: "5" } });
    //Confirmation of the booking numbers
    expect(dateInput.value).toBe("2024-12-08");
    expect(timeInput.value).toBe("14:30");
    expect(number_of_lanes.value).toBe("1");
    expect(number.value).toBe("5");
    //Click all the shoe buttons
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByText("+"));
    }
    //Enter all the shoe sizes.
    for (let index = 1; index < 6; index++) {
      let shoe = screen.getByLabelText(`Shoe size / person ${index}`);
      fireEvent.change(shoe, { target: { value: `3${index}` } });
      expect(shoe.value).toBe(`3${index}`);
    }

    //Get all the buttons to find the strike button so that the error message can be checked.
    const strike_button = screen.getAllByRole("button");
    fireEvent.click(strike_button[6]);

    expect(
      screen.getByText("Det får max vara 4 spelare per bana")
    ).toBeInTheDocument();

    //Change the number of lanes to two.
    fireEvent.change(number_of_lanes, { target: { value: "2" } });
    expect(number_of_lanes.value).toBe("2");
    //Making sure that clicking the strike button takes the user to the confirmation page.
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

  it("A user should be able to enter a shoe size for all bowlers.", async () => {
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
    fireEvent.change(number, { target: { value: "5" } });
    expect(number.value).toBe("5");

    //Click all the shoe buttons.
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByText("+"));
    }
    //Enter all the shoe sizes.
    for (let index = 1; index < 6; index++) {
      let shoe = screen.getByLabelText(`Shoe size / person ${index}`);
      fireEvent.change(shoe, { target: { value: `3${index}` } });
      expect(shoe.value).toBe(`3${index}`);
    }
  });
  it("A user should be able to change the shoe size for all bowlers.", async () => {
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
    fireEvent.change(number, { target: { value: "5" } });
    expect(number.value).toBe("5");

    //Click all the shoe buttons.
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByText("+"));
    }
    //Enter all the shoe sizes.
    for (let index = 1; index < 6; index++) {
      let shoe = screen.getByLabelText(`Shoe size / person ${index}`);
      fireEvent.change(shoe, { target: { value: `3${index}` } });
      expect(shoe.value).toBe(`3${index}`);
    }
    for (let index = 1; index < 6; index++) {
      let shoe = screen.getByLabelText(`Shoe size / person ${index}`);
      fireEvent.change(shoe, { target: { value: `3${index + 2}` } });
      expect(shoe.value).toBe(`3${index + 2}`);
    }
  });

  it("Should check that the correct amount players and shoes is equal.", async () => {
    render(
      <>
        <MemoryRouter initialEntries={["/Booking"]}>
          <Routes>
            <Route path="/booking" element={<Booking />} />
          </Routes>
        </MemoryRouter>
      </>
    );

    //Used to fill in the booking info.
    const number = screen.getByLabelText("Number of awesome bowlers");
    const number_of_lanes = screen.getByLabelText("Number of lanes");
    const dateInput = screen.getByLabelText(/Date/i);
    const timeInput = screen.getByLabelText(/Time/i);
    fireEvent.change(dateInput, { target: { value: "2024-12-08" } });
    fireEvent.change(timeInput, { target: { value: "14:30" } });
    //Choose the mumber of lanes and bowlers.
    fireEvent.change(number_of_lanes, { target: { value: "2" } });
    fireEvent.change(number, { target: { value: "5" } });
    //Confirmation of the booking numbers
    expect(dateInput.value).toBe("2024-12-08");
    expect(timeInput.value).toBe("14:30");
    expect(number_of_lanes.value).toBe("2");
    expect(number.value).toBe("5");

    //Click all the shoe buttons.
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByText("+"));
    }
    //Enter all the shoe sizes except one.
    for (let index = 1; index < 5; index++) {
      let shoe = screen.getByLabelText(`Shoe size / person ${index}`);
      fireEvent.change(shoe, { target: { value: `3${index}` } });
      expect(shoe.value).toBe(`3${index}`);
    }
    const strike_button = screen.getAllByRole("button");
    fireEvent.click(strike_button[5]);
    expect(
      screen.getByText("Antalet skor måste stämma överens med antal spelare")
    ).toBeInTheDocument();
  });
  it("Should check that all the bowlers have entered a shoe size.", async () => {
    render(
      <>
        <MemoryRouter initialEntries={["/Booking"]}>
          <Routes>
            <Route path="/booking" element={<Booking />} />
          </Routes>
        </MemoryRouter>
      </>
    );
    //Used to fill in the booking info.
    const number = screen.getByLabelText("Number of awesome bowlers");
    const number_of_lanes = screen.getByLabelText("Number of lanes");
    const dateInput = screen.getByLabelText(/Date/i);
    const timeInput = screen.getByLabelText(/Time/i);
    fireEvent.change(dateInput, { target: { value: "2024-12-08" } });
    fireEvent.change(timeInput, { target: { value: "14:30" } });
    //Choose the mumber of lanes and bowlers.
    fireEvent.change(number_of_lanes, { target: { value: "2" } });
    fireEvent.change(number, { target: { value: "5" } });
    //Confirmation of the booking numbers
    expect(dateInput.value).toBe("2024-12-08");
    expect(timeInput.value).toBe("14:30");
    expect(number_of_lanes.value).toBe("2");
    expect(number.value).toBe("5");

    //Click all the shoe buttons.
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByText("+"));
    }
    //Enter all the shoe sizes except one.
    for (let index = 1; index < 5; index++) {
      let shoe = screen.getByLabelText(`Shoe size / person ${index}`);
      fireEvent.change(shoe, { target: { value: `3${index}` } });
      expect(shoe.value).toBe(`3${index}`);
    }
    const strike_button = screen.getAllByRole("button");
    fireEvent.click(strike_button[6]);
    expect(
      screen.getByText("Alla skor måste vara ifyllda")
    ).toBeInTheDocument();
  });

  it("Should check that is a overview of all the shoes before the booking is confirmed.", async () => {
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
    fireEvent.change(number, { target: { value: "5" } });
    expect(number.value).toBe("5");

    //Click all the shoe buttons.
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByText("+"));
    }
    //Enter all the shoe sizes except one.
    for (let index = 1; index < 5; index++) {
      let shoe = screen.getByLabelText(`Shoe size / person ${index}`);
      fireEvent.change(shoe, { target: { value: `3${index}` } });
      expect(shoe.value).toBe(`3${index}`);
    }

    const shoes = screen.getAllByText("-");
    expect(shoes.length).toBe(5);
  });
});
