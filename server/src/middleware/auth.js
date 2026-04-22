const sessionModel = require("../model/sessionModel");

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: "Missing auth token." });
  }

  try {
    const user = await sessionModel.findActiveSessionUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    req.user = user;
    req.sessionToken = token;
    return next();
  } catch (error) {
    return res.status(500).json({ error: "Failed to authenticate user." });
  }
}

module.exports = { requireAuth };
