const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userModel = require("../model/userModel");
const sessionModel = require("../model/sessionModel");

async function createSessionToken(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);
  await sessionModel.createSession(userId, token, expiresAt);
  return token;
}

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "name, email, and password are required." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters." });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userModel.createUser(name, email, passwordHash);
    const token = await createSessionToken(user.id);
    return res.status(201).json({ user, token });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "This email is already in use." });
    }
    return res.status(500).json({ error: "Failed to register user." });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required." });
  }

  try {
    const user = await userModel.findUserForLoginByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const authUser = { id: user.id, name: user.name, email: user.email };
    const token = await createSessionToken(user.id);
    return res.json({ user: authUser, token });
  } catch (error) {
    return res.status(500).json({ error: "Failed to log in." });
  }
}

async function logout(req, res) {
  try {
    await sessionModel.deleteSessionByToken(req.sessionToken);
    return res.json({ message: "Logged out." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to log out." });
  }
}

async function me(req, res) {
  try {
    const user = await userModel.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch user profile." });
  }
}

module.exports = {
  register,
  login,
  logout,
  me,
};

