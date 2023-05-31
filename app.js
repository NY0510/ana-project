require("dotenv").config();
const path = require("path");
const express = require("express");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const socketIoSession = require("express-socket.io-session");
const app = express();
const http = require("http");
const server = http.createServer(app);

const socketIO = require("socket.io");
const io = socketIO(server);

const port = 3000 || process.env.PORT;
global.__rootPath = path.resolve(process.cwd());

const session = expressSession({
	key: "userAuth",
	secret: "foobar",
	cookie: { expires: false },
	resave: false,
	saveUninitialized: false,
});

app.use(express.static(path.join(__dirname, "public")));
app.use(session);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", require("./routes/index"));

io.use(socketIoSession(session), { autoSave: true });
// io.use(sharedsession(session));
io.on("connection", socket => {
	socket.on("message", data => {
		let username = socket.handshake.session.user.username;
		console.log(username);
		const { message } = data;
		socket.broadcast.emit("message", { message, username });
	});
});

server.listen(port, () => console.log(`App is listening on port ${port}!\n\nhttp://localhost:${port}`));
