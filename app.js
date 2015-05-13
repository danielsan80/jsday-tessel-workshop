var mqtt = require('mqtt');
var tessel = require('tessel');
var led = tessel.led[0];

var climatelib = require('climate-si7020');
var climate = climatelib.use(tessel.port['B']);

climate.on('ready', function () {
    console.log('Climate module ready.');

    var client = mqtt.connect('mqtt://test.mosca.io?clientId=93247098723450');

    client.on('connect', function () {
        console.log("Connected!");

        client.publish("jsday/presence_0", "Ok!");

        setInterval(function () {
            climate.readTemperature('c', function (err, temp) {
                climate.readHumidity(function (err, humid) {
                    console.log('Temperature: ' + temp.toFixed(4));
                    console.log('Humidity: ' + humid.toFixed(4));

                    var time = new Date();

                    var data = {
                        time: time.getTime(),
                        temp: temp.toFixed(4),
                        humid: humid.toFixed(4),
                    };

                    client.publish("jsday/tessel_climate", JSON.stringify(data));
                });
            });

        }, 1000);

    });


});

