const mongoose = require("mongoose");

// --- Mongoose Schema for 'users' collection in 'studentDB' ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model("User", userSchema);

// --- User Class ---
class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  /**
   * Registers a new user by saving their credentials to MongoDB.
   * Passwords are stored as plain text per task requirements.
   * (In production, always hash passwords with bcrypt.)
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async register() {
    const existing = await UserModel.findOne({ username: this.username });
    if (existing) {
      return { success: false, message: "Username already exists" };
    }

    const newUser = new UserModel({
      username: this.username,
      password: this.password,
    });

    await newUser.save();
    return { success: true, message: "User registered successfully" };
  }

  /**
   * Validates login credentials against the MongoDB 'users' collection.
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async login() {
    const found = await UserModel.findOne({ username: this.username });

    if (!found) {
      return { success: false, message: "User not found" };
    }

    if (found.password !== this.password) {
      return { success: false, message: "Incorrect password" };
    }

    return { success: true, message: "Login successful" };
  }
}

module.exports = { User, UserModel };