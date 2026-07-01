const express = require("express");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/taskRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("Task Tracker API is Running 🚀");
});

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("✅ MongoDB Connected");

        app.listen(process.env.PORT, () => {
            console.log(`🚀 Server running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });