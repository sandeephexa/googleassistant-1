var express = require('express');
var apps = express();
apps.get("/", function (req, res) {
    res.send("Server is running");
});
apps.post("/google", function (req, res) {
    console.log("ok ok");
});
apps.listen(3000 || process.env.PORT, function () {

});