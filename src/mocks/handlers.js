import { http, HttpResponse } from "msw";

export const handlers = [
  // Intercept "GET https://example.com/user" requests...
  http.get("https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com", () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json({
      datum: "2024-12-08",
      time: "15:30",
      number_of_bowlers: "2",
      number_of_lanes: "2",
      shoe_size: "14",
    });
  }),
];
