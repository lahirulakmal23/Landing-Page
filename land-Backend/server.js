import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import checkoutRoutes from "./Modules/Register/Route/checkout.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health (optional)
app.get("/health", (req, res) => res.json({ ok: true }));

// Mount routes
app.use("/api/checkout", checkoutRoutes);

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/crowdflow";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB error:", err.message);
    process.exit(1);
  });

  
