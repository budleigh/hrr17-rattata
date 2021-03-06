var Director = require('./director');
var betMaster = require('./betMaster');

function initGameSender (io) {
  this.io = io;

  // use local one for now, there's no reason to interact with it elsewhere
  var director = new Director(1000, 15000);

  // queue up the first battle
  director.queueNextBattle();

  // if a battle is ongoing, send its state to the client when they connect
  io.sockets.on('connection', function (socket) {
    if (director.battle) {
      socket.emit('start of battle', director.battle.serialize());
    }
  });

  // hook up event callbacks to send data to all connected clients
  director.onStartOfBattle(createSender(io, 'start of battle'));
  director.onStartOfBattle(director.stopCountdown.bind(director));
  director.onTick(createSender(io, 'tick'));
  director.onEndOfBattle(betMaster.payout);
  director.onEndOfBattle(director.startCountdown.bind(director, io));
  director.onEndOfBattle(createSender(io, 'end of battle'));
}

// returns a callback function that sends `data` to all sockets
// that are connected to `io`
function createSender (io, event) {
  return function (data) {
    io.sockets.emit(event, data);
  };
}

module.exports = initGameSender;
