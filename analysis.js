var moment = require("moment")

var analysis = {
	fever: function (patient) {
		var last = patient.notes.sort(function (a, b) {
			return new Date(b.date) - new Date(a.date)
		}).find(function (e) {
			return e.body.includes("fever")
		})

		if (last !== undefined)
			return `Thank you! Last fever was on ${moment(last.date).fromNow()} with notes: ${last.body}`
		else
			return "Thank you! No information about last fever."
	},
	medhist: function (patient, medication) {
		var started = patient.notes.sort(function (a, b) {
			return new Date(b.date) - new Date(a.date)
		}).find(function (e) {
			return e.body.includes(`started taking ${medication}`)
		})

		if (started !== undefined)
			return `Thank you! You started taking ${medication} on ${moment(started.date).fromNow()} with notes: ${started.body}`
		else
			return `Thank you! No previous information about ${medication}.`
	},
	analyze: function (patient, text) {
		if (text.includes("fever")) {
			return this.fever(patient);
		} if (text.includes("Adderall")) {
			return this.medhist(patient, "Adderall")
		} if (text.includes("Focalin")) {
			return this.medhist(patient, "Focalin")
		} else {
			return "Thank you! I cannot provide any guidance right now, but I will record your report for future analysis.";
		}
	}
}

export default analysis
