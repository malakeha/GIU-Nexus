const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./config/db");

// Route files
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const profileRoutes = require("./routes/profileRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

// Error middleware
const errorHandler = require("./middleware/errorHandler");

// Connect database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.send("GIU Nexus API Running...");
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/applications", applicationRoutes);

// Error Handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});