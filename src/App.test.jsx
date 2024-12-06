import { render, screen } from "@testing-library/react";

import App from "./App"; // Your top-level component

describe("renders nested components with React Router", () => {
  it("Should check that all the text is diplayed correctly when the first page is loaded in.", () => {
    render(<App />);
    const booking_text = screen.getAllByText("Booking");
    // Verify the default UI
    console.log(booking_text[0]);
    expect(booking_text[0]).toBeInTheDocument();
    expect(booking_text[1]).toBeInTheDocument();
  });
});
