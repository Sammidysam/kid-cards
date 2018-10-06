import config from "./config";

const http = require("http");

const firebase = require("firebase");
firebase.initializeApp(config);

http.createServer((req, res) => {
	res.writeHead(200, {'Content-Type': 'application/json'});
	firebase.database().ref('/').once('value').then(function (snapshot) {
		res.end(JSON.stringify(snapshot.val()));
	});
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
