var express = require('express');
var bodyParser = require('body-parser');
var apps = express();
apps.use(bodyParser.json());
let ApiAiApp = require('actions-on-google').ApiAiAssistant;

apps.get("/", function (req, res) {
    res.send("Server is running");
});
function callApi(req, res) {
    const app1 = new ApiAiApp({ request: req, response: res });
    const FlightID = 'flight_id';  // the action name from the API.AI intent
    const FlightArrival = 'flight_arriving_date';
    let flightid = app1.getArgument('flightid');
    var intent = app1.getIntent();
    console.log(intent);
    switch (intent) {
        case 'flight_id':
            app1.ask("Flight is arrived. Actual Departs time is 7:44PM IST and Arrival time is 9:19PM IST. Scheduled Departs time is 9:10PM and arrival time is 10:10PM IST");
            break;
        case 'flight_arriving_date':
            app1.ask("Flight is arrived. Actual Departs time is 7:44PM IST and Arrival time is 9:19PM IST. Scheduled Departs time is 9:10PM and arrival time is 10:10PM IST");
            break;
    }
    console.log(flightid);
}
apps.post("/", function (req, res) {
    callApi(req, res);

});
apps.listen(3000 || process.env.PORT, function () {

});