import { http } from "msw";

export const handlers = [
  http.post("https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com", () => {
    return HttpResponse.json({
      booking: {
        id: "12345",
        price: 440,
        when: "2024-12-08T15:30",
        people: "2",
        lanes: "2",
      },
    });
  }),
];
