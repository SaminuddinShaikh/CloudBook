const authRoute = require("./routes/auth");
const notesRoute = require("./routes/notes");
const connectToMongo = require("./db");
const express = require("express");

connectToMongo();
const app = express();
const port = 5000;

app.use(express.json()); //to get response add this middleware

app.use("/api/auth", authRoute);
app.use("/api/notes", notesRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
