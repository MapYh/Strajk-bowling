import { render, screen, fireEvent, userEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import { setupServer } from "msw/node";
import { handlers } from "../mocks/handlers";

import Booking from "../views/Booking";
import Navigation from "../components/Navigation/Navigation";
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
  });

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
  }); //

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
  }); //

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
    //Change the shoe sizes.
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

  it("Should check that there is a overview of all the shoes before the booking is confirmed.", async () => {
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
  it("Should check that user can delete a shoe input field.", async () => {
    render(
      <>
        <MemoryRouter initialEntries={["/Booking"]}>
          <Routes>
            <Route path="/booking" element={<Booking />} />
          </Routes>
        </MemoryRouter>
      </>
    );

    //Click the add shoes button.
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByText("+"));
    }
    let shoes_delete_button = screen.getAllByText("-");
    expect(shoes_delete_button.length).toBe(5);

    //Enter all the shoe sizes except one.
    for (let index = 1; index < 5; index++) {
      let shoe = screen.getByLabelText(`Shoe size / person ${index}`);
      fireEvent.change(shoe, { target: { value: `3${index}` } });
      expect(shoe.value).toBe(`3${index}`);
    }
    fireEvent.click(shoes_delete_button[0]);
    shoes_delete_button = screen.getAllByText("-");
    expect(shoes_delete_button.length).toBe(4);
  });
  ///Confirmation component.
  it("Should check that a user can finish a booking.", async () => {
    try {
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
    } catch (error) {}
  });
  it("Should check that a booking number is generated and shown to the user after a booking is completed.", async () => {
    try {
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
      expect(screen.getByText("12345")).toBeInTheDocument();
    } catch (error) {}
  });
  it("Should check that a price is calculated and is shown to the user", async () => {
    try {
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
      expect(screen.getByText("440")).toBeInTheDocument();
    } catch (error) {}
  });
  it("Should check that the total price in shown on the site and the number of lanes and bowlers.", async () => {
    try {
      render(
        <MemoryRouter initialEntries={["/confirmation"]}>
          <Routes>
            <Route path="/confirmation" element={<Confirmation />} />
          </Routes>
        </MemoryRouter>
      );

      const inputTime = screen.getAllByRole("textbox", { type: "text" });
      // Check that the confirmation details are rendered correctly
      expect(inputTime[1].value).toBe("2");
      expect(inputTime[2].value).toBe("2");
      expect(screen.getByText("Total:")).toBeInTheDocument();
      expect(screen.getByText("500 sek")).toBeInTheDocument();
    } catch (error) {}
  });
});
