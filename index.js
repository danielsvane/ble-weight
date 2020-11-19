var bleno = require('bleno');

var PrimaryService = bleno.PrimaryService;
var Characteristic = bleno.Characteristic;

// Should get this from RS232
function getWeight () {
  var weight = Math.round(Math.random() * (12000 - 1200) + 1200);
  return weight.toString();
}

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('Scanvaegt', ['ec00']);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      new PrimaryService({
        uuid: 'ec00',
        characteristics: [
          new Characteristic({
            uuid: 'ec0e',
            properties: ['read'],
            onReadRequest: function(_, callback) {
              var weight = getWeight()
              console.log('Read request received, sending:', weight);
              callback(this.RESULT_SUCCESS, new Buffer(weight));
            }
          })
        ]
      })
    ]);
  }
});