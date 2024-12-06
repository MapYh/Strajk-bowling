import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import App from "./App"; // Your top-level component

test("renders nested components with React Router", () => {
  render(<App />);

  const booking_text = screen.getAllByText("Booking");
  // Verify the default UI
  console.log(booking_text[0]);
  expect(booking_text[0]).toBeInTheDocument();
});
