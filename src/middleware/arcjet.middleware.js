import { aj } from "../config/arcjet";

export const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: "Too many requests. Please try again later.",
        });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({
          error: "Access denied. Bot traffic is not allowed.",
        });
      } else {
        res.status(403).json({
          error: "Access denied.",
        });
      }
    }

    next();
  } catch (err) {
    console.error("Arcjet middleware error:", err);
  }
};
