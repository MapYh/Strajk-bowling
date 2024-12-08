import { http, HttpResponse } from "msw";

export const handlers = [
  // Intercept "GET https://example.com/user" requests...
  http.get("https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com", () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json({
      when: "2024-12-08T15:30",
      people: "2",
      lanes: "2",
      id: "12345",
      price: "500",
    });
  }),
];
