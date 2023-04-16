const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db.js");
dotenv.config();

//mongodb connection
connectDB();

//rest objects
const app = express();

//middlewares
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes.js"));
app.use("/api/v1/doctor", require("./routes/doctorRouter.js"));
//listen

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port, (req, res) => {
  console.log(`Listening on PORT ${port}`);
});
