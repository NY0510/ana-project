const socket = io();

let userdata;

const submitMessageForm = document.querySelector(".submitMessageForm");

function appendChatMessage(message, username) {
	let messageDiv = document.createElement("div");
	let usernameDiv = document.createElement("div");
	let messageContent = document.createElement("div");

	usernameDiv.innerText = username;
	messageContent.innerText = message;

	messageDiv.classList.add("message");

	messageDiv.appendChild(usernameDiv);
	messageDiv.appendChild(messageContent);

	chatlist.appendChild(messageDiv);
	chatlist.scrollTop = chatlist.scrollHeight;
}

socket.on("userSizeUpdated", data => {
	console.log(data);
});

socket.on("userJoined", data => (userdata = data));

socket.on("message", data => {
	appendChatMessage(data.message, data.username);
});

submitMessageForm.addEventListener("submit", e => {
	e.preventDefault();

	let message = document.querySelector("#messageInput").value;
	if (message.length <= 0) return;

	appendChatMessage(message, userdata.username);
	socket.emit("message", message);
	submitMessageForm.querySelector("input").value = "";
});
