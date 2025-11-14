export const protectedRoute = async (req, res) => {
  if (!req.auth().isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};
