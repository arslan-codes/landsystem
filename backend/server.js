import express from "express";
import bodyParser from "body-parser";
import Routes from "./Routes.js";
import cors from "cors";
import { toast } from "react-toastify";
const app = express();

const port = 8080;

app.use(bodyParser.json());
app.use(cors());

app.use("/api/v1/auth", Routes);
app.get("/", (req, res) => {
  toast.success("welcome to real state");
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
