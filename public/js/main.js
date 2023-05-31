const socket = io();
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

// sendbutton.addEventListener("click", () => {

// });

socket.on("message", data => {
	appendChatMessage(data.message, data.username);
});

window.onload = () => {
	submitMessageForm.addEventListener("submit", e => {
		e.preventDefault();
		let message = document.querySelector("#messageInput").value;
		// let username = document.querySelector("#username").value;

		appendChatMessage(message);

		socket.emit("message", { message });
		submitMessageForm.querySelector("input").value = "";
	});
};
