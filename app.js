require("dotenv").config();
const path = require("path");
const express = require("express");
const getRamdomUserName = require("./utils/username");
// const bodyParser = require("body-parser");
const app = express();
const http = require("http");
const server = http.createServer(app);

const socketIO = require("socket.io");
const io = socketIO(server);

const port = 3000 || process.env.PORT;
global.__rootPath = path.resolve(process.cwd());

app.use(express.static(path.join(__dirname, "public")));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use("/", require("./routes/index"));

io.on("connection", socket => {
	socket.on("message", async data => {
		let username = await getRamdomUserName();
		console.log(username);
		const { message } = data;
		socket.broadcast.emit("message", { message, username });
	});
});

server.listen(port, () => console.log(`App is listening on port ${port}!\n\nhttp://localhost:${port}`));
