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

import analysis from "./analysis"
var dbRef = firebase.database().ref('/');
var db = {};

dbRef.on('value', function (s) {
	db = s.val();
});

app.get("/", (req, res) => {
	res.header('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify(db));
});

app.post('/sms', (req, res) => {
	const twiml = new MessagingResponse();

	twiml.message(analysis.analyze(db.doctors[0].patients[0], req.body.Body));

	const nextNote = db.doctors[0].patients[0].notes ? db.doctors[0].patients[0].notes.length : 0;
	firebase.database().ref(`doctors/0/patients/0/notes/${nextNote}`).set({
		creator: {
			name: "Billy Doel",
			phone: req.body.From,
			role: "Other"
		},
		body: req.body.Body,
		date: new Date(Date.now()).toISOString()
	})
	db.doctors[0].patients[0].notes[nextNote] = {
        creator: {
            name: "Billy Doel",
            phone: req.body.From,
            role: "Other"
        },
        body: req.body.Body,
        date: new Date(Date.now()).toISOString()
    }

		res.writeHead(200, { "Content-Type": "text/xml"});
	res.end(twiml.toString());
})

http.createServer(app).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
