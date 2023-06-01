require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);

const getRamdomUserName = require("./utils/username");

const port = 3000 || process.env.PORT;
global.__rootPath = path.resolve(process.cwd());

app.use(express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/index"));

let userSize = 0;
io.on("connection", async socket => {
	let addedUser = false;

	if (addedUser) return;

	++userSize;
	addedUser = true;
	socket.username = await getRamdomUserName();

	io.emit("userSizeUpdated", { userSize: userSize });
	io.emit("userJoined", { username: socket.username });

	// socket.on("connect", async socket => {
	// });

	socket.on("disconnect", socket => {
		if (addedUser) {
			--userSize;

			io.emit("userSizeUpdated", { userSize: userSize });
			io.emit("userLefted", { username: socket.username });
		}
	});

	socket.on("message", data => {
		if (socket.username) {
			if (data.length <= 0) return;
			socket.broadcast.emit("message", {
				username: socket.username,
				message: data,
			});

			console.log(`${socket.username}: ${data.message}`);
		}
	});
});

server.listen(port, () => console.log(`App is listening on port ${port}!\n\nhttp://localhost:${port}`));
