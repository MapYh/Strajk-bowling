import { render, screen } from "@testing-library/react";

import App from "./App";

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

    render();

    expect(screen.getByText("Inga bokning gjord!")).toBeInTheDocument();
  });
});
