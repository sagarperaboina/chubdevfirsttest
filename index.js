import express from "express";
import bodyParser from "body-parser";
import aiRoutes from "./routes/aiRoutes.js";
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// AI Routes
x
app.get("/", (req, res) => {
  res.send("AI Backend Running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
