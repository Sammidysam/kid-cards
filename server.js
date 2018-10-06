import config from "./config";

const http = require("http");
const express = require("express");

const firebase = require("firebase");
firebase.initializeApp(config);

const twiliocl = require('twilio')(config.accountSid, config.authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();

app.get("/", (req, res) => {
	res.writeHead(200, {'Content-Type': 'application/json'});
    firebase.database().ref('/').once('value').then(function (snapshot) {
        res.end(JSON.stringify(snapshot.val()));
    });
});

app.post('/sms', (req, res) => {
	const twiml = new MessagingResponse();

	twiml.message("I cannot provide any guidance, but I will record your report for future input.");

	res.writeHead(200, { "Content-Type": "text/xml"});
	res.end(twiml.toString());
})

http.createServer(app).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
