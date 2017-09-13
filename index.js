var express = require('express');
var bodyParser = require('body-parser');
var Promise = require('promise');
var reqnew = require('request');
var apps = express();
apps.use(bodyParser.json());
var flightstatus = { 'A': 'Active', 'C': 'Cancelled', 'D': 'Diverted', 'DN': 'Data Source Need', 'L': 'Landed', 'NO': 'Not Operational', 'R': 'Redirected', 'S': 'Scheduled', 'U': 'Unknown' };
let ApiAiApp = require('actions-on-google').ApiAiAssistant;
const appid = '6aac18a6';
const appkey = '40a7e359cb020a07ead5159c2d5d8162';
apps.get("/", function (req, res) {
    res.send("Server is running");
});
var callrestapi = function (apid, apkey, carrier, flight, year, month, day) {
    return new Promise(function (resolve, reject) {
        var r;
        var options = {};
        options.url = `https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/${carrier}/${flight}/arr/${year}/${month}/${day}`;
        reqnew(options, (error, resps, body) => {
            try {

                if ((typeof body) == "string") {

                    var result = JSON.parse(body);
                    r = result;
                } else {

                    r = body;
                }

                // Call callback with no error, and result of request
                resolve(r);

            } catch (e) {

                // Call callback with error
                reject(e);
            }


        });
    });
}

function callApi(req, res) {
    console.log(req);
    const app1 = new ApiAiApp({ request: req, response: res });
    var intent = app1.getIntent();
    // if (intent == "flight_id") {
    //     return callrestapi(zodiac).then(function (result1) {
    //         app1.ask("Flight is arrived. Actual Departs time is 7:44PM IST and Arrival time is 9:19PM IST. Scheduled Departs time is 9:10PM and arrival time is 10:10PM IST");
    //     });
    // }
    let flightdate = app1.getArgument('date').split('-');
    let flightno = app1.getArgument('any');
    let carrier = app1.getArgument('flight_names');
    console.log(intent);
    if (intent == "flight_arriving_date") {
        return callrestapi(apid, apkey, carrier, flightno, flightdate[2], flightdate[1], flightdate[0]).then(function (result1) {
            var fligarriv = result1;
            console.log(JSON.stringify(fligarriv));
            if (fligarriv.hasOwnProperty('appendix')) {
                if (fligarriv.appendix.hasOwnProperty('airlines')) {
                    if (fligarriv.appendix.airlines[0].active) {
                        console.log(fligarriv.appendix.airlines[0].active);
                        if (fligarriv.appendix.hasOwnProperty('airports')) {
                            let source = fligarriv.appendix.airports[0];
                            let airports = source.name;
                            let city = source.city;
                            let country = source.countryName;
                            console.log(airports + city + country);

                        }
                    }
                }
            }
        });
    }
}
apps.post("/", function (req, res) {
    callApi(req, res);
});
apps.listen(process.env.PORT || 3000, function () {

});
