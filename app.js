var mqtt = require('mqtt');
var tessel = require('tessel');
var led = tessel.led[0];

var climatelib = require('climate-si7020');
var ambientlib = require('ambient-attx4');

var client = mqtt.connect('mqtt://test.mosca.io?clientId=93247098723450');

client.on('connect', function () {
    console.log("Connected!");

    client.publish("jsday/presence_0", "Ok!");

    var climate = climatelib.use(tessel.port['B']);

    climate.on('ready', function () {
        console.log('Climate module ready.');

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

    var ambient = ambientlib.use(tessel.port['A']);

    ambient.on('ready', function () {
        console.log("Ambient module ready.");

        setInterval(function () {
            ambient.getLightLevel( function (err, light) {
                ambient.getSoundLevel(function (err, sound) {
                    console.log('Sound: ' + sound.toFixed(4));
                    console.log('Light: ' + light.toFixed(4));

                    var time = new Date();

                    var data = {
                        time: time.getTime(),
                        light: light.toFixed(4),
                        sound: sound.toFixed(4),
                    };

                    client.publish("jsday/tessel_ambient", JSON.stringify(data));
                });
            });

        }, 1000);

    });
});

