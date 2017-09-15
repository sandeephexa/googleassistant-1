var express = require('express');
var bodyParser = require('body-parser');
var Promise = require('promise');
var reqnew = require('request');
var apps = express();
apps.use(bodyParser.json());
var flightstatus = { 'A': 'Active', 'C': 'Cancelled', 'D': 'Diverted', 'DN': 'Data Source Need', 'L': 'Landed', 'NO': 'Not Operational', 'R': 'Redirected', 'S': 'Scheduled', 'U': 'Unknown' };
let ApiAiApp = require('actions-on-google').ApiAiAssistant;
const apid = '6aac18a6';
const apkey = '40a7e359cb020a07ead5159c2d5d8162';
apps.get("/", function (req, res) {
    res.send("Server is running");
});
var callrestapi = function (apid, apkey, carrier, flight, year, month, day) {
    return new Promise(function (resolve, reject) {
        var r;
        var options = {};
        options.url = `https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/${carrier}/${flight}/arr/${year}/${month}/${day}?appId=${apid}&appKey=${apkey}&utc=false`;
        reqnew(options, (error, resps, body) => {
            try {
            console.log(body);
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
    //console.log(intent + "=>" + apid + "=>" + apkey + "=>" + carrier + "=>" + flightno + "=>" + flightdate[2] + "=>" + flightdate[1] + "=>" + flightdate[0]);
    if (intent == "flight_arriving_date") {
        return callrestapi(apid, apkey, carrier, flightno, flightdate[0], flightdate[1], flightdate[2]).then(function (result1) {
          
            var fligarriv = result1;
            if (fligarriv) {
            if(fligarriv.hasOwnProperty('error'))
            {
             console.log("sromojk");    
            app1.ask(fligarriv.error.errorMessage);
            }
             else   if (fligarriv.hasOwnProperty('appendix')) {
                    if (fligarriv.appendix.hasOwnProperty('airlines')) {
                        if (fligarriv.appendix.airlines[0].active) {
                            console.log(fligarriv.appendix.airlines[0].active);
                            if (fligarriv.appendix.hasOwnProperty('airports')) {
                                let source = fligarriv.appendix.airports[0];
                                let destination = fligarriv.appendix.airports[1];
                                let airports = source.name;
                                let citys = source.city;
                                let countrys = source.countryName;
                                let airportd = destination.name;
                                let cityd = destination.city;
                                let countryd = destination.countryName;
                                let flightstatuses = fligarriv.flightStatuses[0].status;
                                let scheduledd=fligarriv.flightStatuses[0].operationalTimes.scheduledGateArrival.dateLocal.split('T')[1];
                                let scheduleda=fligarriv.flightStatuses[0].operationalTimes.scheduledGateDeparture.dateLocal.split('T')[1];
                                let estimatedd=fligarriv.flightStatuses[0].operationalTimes.estimatedGateDeparture.dateLocal.split('T')[1];
                                let estimateda=fligarriv.flightStatuses[0].operationalTimes.estimatedGateArrival.dateLocal.split('T')[1];
                                var newflightss;
//                                 for (var property in flightstatus) {
//                                     if(property==flightstatuses)
//                                     {
//                                     newflightss=flightstatus[property];
//                                     }
// }
                                
var myKeys = Object.keys(flightstatus) 
newflightss=flightstatus[myKeys.indexOf(flightstatuses)!==-1?flightstatuses:""];
                                //app1.ask(`Flight is ${newflightss} from ${airports} ${countrys} to ${airportd} ${countryd}. Estimated Departure ${estimatedd} , Arrival ${estimateda}. Schedule Departure ${scheduledd} , Arrival ${scheduleda}. Do u want to know anything else?`);
//app1.ask(`Flight is ${newflightss} from ${airports} ${countrys} to ${airportd} ${countryd}. Estimated Departure ${estimatedd.substring(0, estimatedd.length-4)} , Arrival ${estimateda.substring(0, estimateda.length-4)}. Schedule Departure ${scheduledd.substring(0, scheduledd.length-4)} , Arrival ${scheduleda.substring(0, scheduleda.length-4)}. Do u want to know anything else?`);
 app1.ask(app1.buildRichResponse().addSimpleResponse('Srinivasan is teh good boy').addBasicCard(app1.buildBasicCard(``)
                                   .setTitle('Math & prime numbers')
.addButton('Read more', 'https://example.google.com/mathandprimes')
                                    .setImage('http://images.dailytech.com/frontpage/fp__fp-plane.png', 'Image alternate text')));
//                                  app1.askWithList(app1.buildRichResponse()
//     .addSimpleResponse('Alright'),
//     // Build a list
//     app1.buildList('FLIGHT STATUS')
//     // Add the first item to the list
//     .addItems(app1.buildOptionItem()
//       .setTitle('SOURCE')
//       .setDescription('42 is an abundant number because the sum of its ' +
//         'proper divisors 54 is greater…')
//       .setImage('http://images.dailytech.com/frontpage/fp__fp-plane.png', 'Math & prime numbers'))
//     // Add the second item to the list
//     .addItems(app1.buildOptionItem('EGYPT',
//       ['religion', 'egpyt', 'ancient egyptian'])
//       .setTitle('Ancient Egyptian religion')
//       .setDescription('42 gods who ruled on the fate of the dead in the ' +
//         'afterworld. Throughout the under…')
//       .setImage('http://images.dailytech.com/frontpage/fp__fp-plane.png', 'Egypt')
//     )
//     // Add third item to the list
//     .addItems(app1.buildOptionItem('RECIPES',
//       ['recipes', 'recipe', '42 recipes'])
//       .setTitle('42 recipes with 42 ingredients')
//       .setDescription('Here\'s a beautifully simple recipe that\'s full ' +
//         'of flavor! All you need is some ginger and…')
//       .setImage('http://images.dailytech.com/frontpage/fp__fp-plane.png', 'Recipe')
//     )
//   );
//      app1.ask(app1.buildOrder("200").setImage('http://images.dailytech.com/frontpage/fp__fp-plane.png'));                       
                            }
                        }
                    }
                }
            
            }
           
         
        }).catch(function (errdata) {

        })
    }
}
apps.post("/", function (req, res) {
    callApi(req, res);
});
apps.listen(process.env.PORT || 3000, function () {

});
