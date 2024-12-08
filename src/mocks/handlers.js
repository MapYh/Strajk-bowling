import { http, HttpResponse } from "msw";

export const handlers = [
  http.post(
    "https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com",
    async (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          when: "2024-12-08T15:30",
          people: "2",
          lanes: "2",
          id: "12345",
          price: "500",
        })
      );
    }
  ),
];
