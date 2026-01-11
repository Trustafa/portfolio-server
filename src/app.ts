import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Mount auth routes under /api/auth
app.use("/api/auth", authRoutes);

// Health check route
app.get("/api/health", (_req, res) => {
  res.send("Server is running!");
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
