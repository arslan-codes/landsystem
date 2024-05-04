// Modify your server.js file to include a route for proxying IPFS requests
import express from "express";
import bodyParser from "body-parser";
import Routes from "./Routes.js";
import cors from "cors";
import fetch from "node-fetch"; // Import the fetch library

const app = express();

const port = 8080;

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*", // Adjust CORS settings as needed
  })
);

app.use("/api/v1/auth", Routes);

app.use("https://ipfs.io/ipfs");
// Proxy route for fetching IPFS resources
app.get("/ipfs/:cid", async (req, res) => {
  const cid = req.params.cid;
  try {
    const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching IPFS resource:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  console.log("welcome to real state");
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
