const socket = io();

let userdata;

const submitMessageForm = document.querySelector("#submitMessageForm");
const chatList = document.querySelector("#chatList");

function connect() {
	socket.emit("connection");
}

function createChatElement(message, username) {
	const date = new Date();
	const formattedDate = date.toLocaleString("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});

	// messageBox div
	var _messageBox = document.createElement("div");
	_messageBox.className = "messageBox";

	// 프로필 이미지
	var _profile = document.createElement("div");
	_profile.className = "profile";

	var _profileImg = document.createElement("img");
	_profileImg.src = `https://api.dicebear.com/6.x/identicon/svg?seed=${username}`;
	_profileImg.alt = `${username}의 프로필 이미지`;
	_profile.appendChild(_profileImg);

	// content div
	var _content = document.createElement("div");
	_content.className = "content";

	// 닉네임
	var _row1 = document.createElement("div");
	_row1.className = "row";
	var _username = document.createElement("span");
	_username.className = "username";
	_username.textContent = username;

	// 공백
	var _blink = document.createElement("span");
	_blink.textContent = " ";

	// 타임스템프
	var _timestamp = document.createElement("span");
	_timestamp.className = "timestamp";
	_timestamp.textContent = formattedDate;

	_row1.appendChild(_username);
	_row1.appendChild(_blink);
	_row1.appendChild(_timestamp);
	_content.appendChild(_row1);

	// 메세지 내용
	var _row2 = document.createElement("div");
	_row2.className = "row";
	var _message = document.createElement("span");
	_message.className = "message";
	_message.textContent = message;
	_row2.appendChild(_message);
	_content.appendChild(_row2);

	_messageBox.appendChild(_profile);
	_messageBox.appendChild(_content);

	return _messageBox;
}

function createNotiElement(message) {
	var _notiBox = document.createElement("div");
	_notiBox.className = "notiBox";

	var _content = document.createElement("span");
	_content.className = "content";
	_content.innerText = message;

	_notiBox.appendChild(_content);

	return _notiBox;
}

function appendChatMessage(message, username) {
	const messageDiv = createChatElement(message, username);

	chatList.appendChild(messageDiv);
	chatList.scrollTop = chatList.scrollHeight;
}

socket.on("message", data => {
	console.log(data);
	appendChatMessage(data.message, data.username);
});

socket.on("rename", data => (userdata = data));

socket.on("userJoined", data => {
	const notiDiv = createNotiElement(`${data.username} 이(가) 참여했습니다. [${data.userSize}명 온라인]`);
	chatList.appendChild(notiDiv);
});

socket.on("userLefted", data => {
	const notiDiv = createNotiElement(`${data.username} 이(가) 퇴장했습니다. [${data.userSize}명 온라인]`);
	chatList.appendChild(notiDiv);
});

submitMessageForm.addEventListener("submit", e => {
	e.preventDefault();

	let message = document.querySelector("#messageInput").value;
	if (message.trim().length <= 0) return (submitMessageForm.querySelector("input").value = "");

	appendChatMessage(message, userdata.username);
	socket.emit("message", message);
	submitMessageForm.querySelector("input").value = "";
});
