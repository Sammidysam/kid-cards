import config from "./config";

const http = require("http");
const express = require("express");

const firebase = require("firebase");
firebase.initializeApp(config);

const twiliocl = require('twilio')(config.accountSid, config.authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

var dbRef = firebase.database().ref('/');
var db = {};

dbRef.on('value', function (s) {
	db = s.val();
});

app.get("/", (req, res) => {
    res.end(JSON.stringify(db));
});

app.post('/sms', (req, res) => {
	const twiml = new MessagingResponse();

	twiml.message("Thank you! I cannot provide any guidance right now, but I will record your report for future analysis.");

	const nextNote = db.doctors[0].patients[0].notes.length;
	firebase.database().ref(`doctors/0/patients/0/notes/${nextNote}`).set({
		creator: {
			name: "Sam Craig",
			phone: "7654644408",
			role: "Other"
		},
		body: req.body.Body,
		date: new Date(Date.now()).toISOString()
	})

	res.writeHead(200, { "Content-Type": "text/xml"});
	res.end(twiml.toString());
})

http.createServer(app).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
