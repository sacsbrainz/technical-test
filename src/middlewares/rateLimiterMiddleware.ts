import { MemoryStore, rateLimit } from "express-rate-limit";

const rateLimiterUsingThirdParty = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  store: new MemoryStore(),
  message: "too many requests try again later",
});

export default rateLimiterUsingThirdParty;
