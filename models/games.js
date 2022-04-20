var mongoose = require('mongoose');

var GameSchema = mongoose.Schema({
    name: {
        type: String,
        index: true,
    },
    img: {
        type: String,
    },
    login: {
        type: String
    },
    password: {
        type: String
    },
    from: {
        type: String
    },
    typ: {
        type: String
    },
    games: [String]

});

var Game = module.exports = mongoose.model('Game', GameSchema);
module.exports.createGame = function(newGame, callback) {
    Game.updateOne({ name: newGame.name }, { games: newGame.games, typ: newGame.typ, from: newGame.from, name: newGame.name, img: newGame.img, password: newGame.password, login: newGame.login }, { upsert: true }, callback);

}
module.exports.getGames = (name, cb) => {
    Game.find({ from: name.from, typ: 'game' }, cb);

}

module.exports.getAccount = (name, cb) => {
    Game.find({ from: name.from, typ: 'account' }, cb);

}
mongoose.disconnect();