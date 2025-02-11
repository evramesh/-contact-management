const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routesconst contactRoutes = require("./src/routes/contacts");  // ✅ Correct path
const contactRoutes = require("./src/routes/contacts"); // ✅ Correct path
app.use("/contacts", contactRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to the Contact Management API!");
});
// Start Server

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
