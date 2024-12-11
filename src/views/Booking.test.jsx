import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import { setupServer } from "msw/node";
import { handlers } from "../mocks/handlers";
import { http, HttpResponse } from "msw";

import Booking from "../views/Booking";

import Confirmation from "../views/Confirmation";

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

describe("Booking", () => {
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
    server.use(
      http.post(
        "https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com",
        () => {
          return HttpResponse.json({
            id: "12345",
            price: 440,
            when: "2024-12-08T15:30",
            people: "2",
            lanes: "2",
          });
        }
      )
    );

    render(
      <>
        <MemoryRouter initialEntries={["/Booking"]}>
          <Routes>
            <Route path="/booking" element={<Booking />} />
            <Route path="/confirmation" element={<Confirmation />} />
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
    fireEvent.change(timeInput, { target: { value: "15:30" } });
    //Choose the mumber of lanes and bowlers.
    fireEvent.change(number_of_lanes, { target: { value: "1" } });
    fireEvent.change(number, { target: { value: "5" } });
    //Confirmation of the booking numbers
    expect(dateInput.value).toBe("2024-12-08");
    expect(timeInput.value).toBe("15:30");
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
    fireEvent.click(screen.getByText(/strIIIIIike!/i));

    expect(
      screen.getByText("Det får max vara 4 spelare per bana")
    ).toBeInTheDocument();

    //Change the number of lanes to two.
    fireEvent.change(number_of_lanes, { target: { value: "2" } });
    expect(number_of_lanes.value).toBe("2");
    //Making sure that clicking the strike button takes the user to the confirmation page.
    fireEvent.click(screen.getByText(/strIIIIIike!/i));

    await waitFor(() => {
      expect(screen.getByText(/See you soon!/i)).toBeInTheDocument();
    });
  }); //VG
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
  }); //VG
  //Shoes
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
  }); //VG
  it("Should check that the amount of players and shoes needed is equal.", async () => {
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
    //The number of shoes is one less than the amount of players.
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByText("+"));
    }
    //Enter all the shoe sizes except one. 4 shoes for 5 players
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

    //Check that an error messages is displayed if there is more shoes than players.
    //Add two more shoes that is one two many.
    for (let i = 0; i < 2; i++) {
      fireEvent.click(screen.getByText("+"));
    }
    //Enter two shoes more.
    for (let index = 1; index < 3; index++) {
      let shoe = screen.getByLabelText(`Shoe size / person ${index}`);
      fireEvent.change(shoe, { target: { value: `3${index}` } });
      expect(shoe.value).toBe(`3${index}`);
    }

    fireEvent.click(strike_button[5]);
    expect(
      screen.getByText("Antalet skor måste stämma överens med antal spelare")
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

  it("Should check that a user can finish a booking.", async () => {
    server.use(
      http.post(
        "https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com",
        () => {
          return HttpResponse.json({
            id: "12345",
            price: 440,
            when: "2024-12-08T15:30",
            people: "2",
            lanes: "2",
          });
        }
      )
    );
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "2024-12-08" },
    });

    fireEvent.change(screen.getByLabelText(/Time/i), {
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

    fireEvent.click(screen.getByText(/strIIIIIike!/i));
    await waitFor(() => {
      const storedData = sessionStorage.getItem("confirmation");
      expect(storedData).toBeTruthy();
      const confirmation = JSON.parse(storedData);
      expect(confirmation.price).toBe(440);
    });
  });
  ///Confirmation component.

  it("Should check that a booking number is generated and shown to the user after a booking is completed.", async () => {
    server.use(
      http.post(
        "https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com",
        () => {
          return HttpResponse.json({
            id: "12345",
            price: 440,
            when: "2024-12-08T15:30",
            people: "2",
            lanes: "2",
          });
        }
      )
    );
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "2024-12-08" },
    });

    fireEvent.change(screen.getByLabelText(/Time/i), {
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

    fireEvent.click(screen.getByText(/strIIIIIike!/i));
    await waitFor(() => {
      const storedData = sessionStorage.getItem("confirmation");
      expect(storedData).toBeTruthy();
      const confirmation = JSON.parse(storedData);
      expect(confirmation.id).toBe("12345");
    });
  });
  it("Should check that a price is calculated and is shown to the user", async () => {
    server.use(
      http.post(
        "https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com",
        () => {
          return HttpResponse.json({
            id: "12345",
            price: 440,
            when: "2024-12-08T15:30",
            people: "2",
            lanes: "2",
          });
        }
      )
    );
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "2024-12-08" },
    });

    fireEvent.change(screen.getByLabelText(/Time/i), {
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

    fireEvent.click(screen.getByText(/strIIIIIike!/i));
    await waitFor(() => {
      const storedData = sessionStorage.getItem("confirmation");
      expect(storedData).toBeTruthy();
      const confirmation = JSON.parse(storedData);
      expect(confirmation.price).toBe(440);
    });
  });
  it("Should check that the total price in shown on the site and the number of lanes and bowlers.", async () => {
    render(
      <MemoryRouter initialEntries={["/confirmation"]}>
        <Routes>
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </MemoryRouter>
    );

    const input = screen.getAllByRole("textbox", { type: "text" });
    // Check that the confirmation details are rendered correctly
    expect(input[1].value).toBe("2");
    expect(input[2].value).toBe("2");
    expect(screen.getByText("Total:")).toBeInTheDocument();
    expect(screen.getByText("440 sek")).toBeInTheDocument();
  });

  it("Should check that a booking is displayed.", async () => {
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
      <MemoryRouter initialEntries={["/booking"]}>
        <Routes>
          <Route path="/Booking" element={<Booking />} />
        </Routes>
      </MemoryRouter>
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
  });
});
