require("dotenv").config();
const path = require("path");
const express = require("express");

global.__rootPath = path.resolve(process.cwd());

const app = express();
const port = 3000 || process.env.PORT;

app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/index"));
app.listen(port, () => console.log(`App is listening on port ${port}!\n\nhttp://localhost:${port}`));
