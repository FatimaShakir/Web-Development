const express = require("express");
const session = require("express-session");
const connectDB = require("./aidb");
const { User } = require("./aiuser");

const app = express();
const PORT = 3000;

// --- Connect to MongoDB ---
connectDB();

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "studentDB_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
  })
);

// --- Authentication Middleware ---
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized. Please log in first." });
}

// ============================================================
// ROUTES
// ============================================================

/**
 * POST /register
 * Registers a new user in MongoDB.
 * Body: { username, password }
 */
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const user = new User(username, password);
    const result = await user.register();

    if (!result.success) {
      return res.status(409).json({ message: result.message });
    }

    return res.status(201).json({ message: result.message });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * POST /login
 * Validates credentials and creates a session.
 * Body: { username, password }
 */
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const user = new User(username, password);
    const result = await user.login();

    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }

    // Create session
    req.session.user = username;

    return res.status(200).json({ message: result.message });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * GET /dashboard
 * Protected route — only accessible when logged in.
 */
app.get("/dashboard", isAuthenticated, (req, res) => {
  return res.status(200).json({ message: `Welcome ${req.session.user}` });
});

/**
 * GET /logout
 * Destroys the session and logs the user out.
 */
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err.message });
    }
    return res.status(200).json({ message: "Logout successful" });
  });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});