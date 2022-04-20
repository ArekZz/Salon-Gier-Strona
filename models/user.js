var mongoose = require('mongoose');
var Game = require('./games');
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    admin: {
        type: Boolean
    },
    done: {
        type: Boolean
    },
    from: {
        type: String,
    },
    games: [String],
    banned: {
        type: Boolean,
    }
});

var User = module.exports = mongoose.model('User', UserSchema);
module.exports.ban = function(user, ban, cb) {
    console.log(user, ban);
    User.updateOne({ username: user }, { banned: ban }, { upsert: true }, cb);
}
module.exports.createUser = async function(newUser, callback) {
    let owned = [];
    let fullList = [];
    let filtered;

    await User.updateOne({ username: newUser.username }, { username: newUser.username, password: newUser.password, admin: false, done: false, from: newUser.from }, { upsert: true }, (err, done) => {
        if (err) {
            owned = [];
        } else {
            if (done) {
                User.findOne({ username: newUser.username }, (err, user) => {
                    owned = user.games;
                })
            } else {
                owned = [];
            }
        }
    })
    await Game.findOne({ name: newUser.games }, (err, game) => {

        if (game !== null) {
            fullList = owned.concat(game.games);
        } else {
            fullList = owned;
        }
        filtered = [...new Set(fullList)];
    })
    await User.updateOne({ username: newUser.username }, { games: filtered, username: newUser.username, password: newUser.password, admin: false, done: false, from: newUser.from }, { upsert: true }, callback);

}
module.exports.confirm = (user, games, callback) => {
        let owned = user.games;
        let fullList = owned.concat(games);
        User.updateOne({ username: user.username }, { games: fullList, done: true }, callback);
    }
    // module.exports.setLimit = (from, limit) => {
    //     User.updateOne({ username: from }, { limit: limit });
    // }
    // module.exports.getLimit = (from, cb) => {
    //     User.findOne({ username: from }, cb);
    // }
mongoose.disconnect();