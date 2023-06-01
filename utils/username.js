const axios = require("axios");

async function getRamdomUserName() {
	const baseUrl = "https://nickname.hwanmoo.kr/?format=json&count=1&max_length=6";

	const response = await axios.get(baseUrl);
	const username = response.data.words[0];
	return username;
}

module.exports = getRamdomUserName;
