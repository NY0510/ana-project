require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);

const getRamdomUserName = require("./utils/username");

const port = process.env.PORT | 3000;
global.__rootPath = path.resolve(process.cwd());

app.use(express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/index"));

let userSize = 0;
io.on("connection", async socket => {
	let addedUser = false;

	socket.on("connection", async data => {
		if (addedUser) return;

		++userSize;
		addedUser = true;
		socket.username = await getRamdomUserName();
		socket.emit("rename", { username: socket.username });
		io.sockets.emit("userJoined", { username: socket.username, userSize: userSize });
		console.log(`[User] ${socket.username} is connected`);
	});

	socket.on("disconnect", data => {
		if (addedUser) {
			--userSize;

			io.sockets.emit("userLefted", { username: socket.username, userSize: userSize });
			console.log(`[User] ${socket.username} is disconnected`);
		}
	});

	socket.on("message", data => {
		if (socket.username) {
			if (data.trim().length <= 0) return;
			socket.broadcast.emit("message", {
				username: socket.username,
				message: data,
			});

			console.log(`[Message] ${socket.username}: ${data}`);
		}
	});
});

server.listen(port, () => console.log(`App is listening on port ${port}!\n\nhttp://localhost:${port}`));
