require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/progress", require("./routes/progress"));
app.use("/api/duel", require("./routes/duel"));
app.use("/api/daily", require("./routes/daily"));

// Health check
app.get("/api/health", (_, res) => res.json({ status: "OK", ts: Date.now() }));

// ── DB + Start ──────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/coders-guild";

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    });
