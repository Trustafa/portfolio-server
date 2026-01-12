import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import assetRoutes from "./routes/asset.routes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);

app.get("/api/health", (_req, res) => {
  res.send("Server is running!");
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
