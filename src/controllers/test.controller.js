// controllers/auth.test.controller.js
import { getAuth } from "@clerk/express";

export const testAuth = (req, res) => {
  const auth = getAuth(req);

  res.json({
    message: "Clerk auth test",
    auth,
  });
};
