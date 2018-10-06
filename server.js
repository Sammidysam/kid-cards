import config from "./config";

const http = require("http");
const express = require("express");

const firebase = require("firebase");
firebase.initializeApp(config);

const twiliocl = require('twilio')(config.accountSid, config.authToken);

const app = express();

app.get("/", (req, res) => {
	res.writeHead(200, {'Content-Type': 'application/json'});
    firebase.database().ref('/').once('value').then(function (snapshot) {
        res.end(JSON.stringify(snapshot.val()));
    });
});

app.post('/sms', (req, res) => {
	const twiml = new MessagingResponse();

	twiml.message("Thanks for your message!");

	res.writeHead(200, { "Content-Type": "text/xml"});
	res.end(twiml.toString());
})

http.createServer(app).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
