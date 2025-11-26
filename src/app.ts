import express from "express";
import path from "path";
import inventoryRoute from "./routes/inventory.route";

const app = express()
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use(express.static(path.join(__dirname, "ui")));

app.use("/inventory", inventoryRoute);

export default app;