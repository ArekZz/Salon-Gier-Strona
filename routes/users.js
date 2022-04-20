var express = require('express');
var router = express.Router();
var multer = require('multer');
let mail = require('../models/mail')
require('dotenv').config();
var multerGoogleStorage = require("multer-google-storage");
var uploadHandler = multer({
    storage: multerGoogleStorage.storageEngine(),
});
var User = require('../models/user');
var Game = require('../models/games');
var logger = require('morgan')
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    RememberMeStrategy = require('passport-remember-me').Strategy;
let usedkeys = [];
let received = [];
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'BŁĘDNY LOGIN!' });
            }
            if (user.password !== password) {
                return done(null, false, { message: 'BŁĘDNE HASŁO!' })
            }
            return done(null, user);
        });
    }
));

router.post('/login',
    passport.authenticate('local', { failureRedirect: '/', failureFlash: true }),
    function(req, res, next) {
        res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
        if (req.user.admin) {
            res.location('/users/admin')
            res.redirect('/users/admin')
        } else if (!req.user.banned) {
            res.location('/users/panel')
            res.redirect('/users/panel')
        } else {
            req.logOut();
            res.render('index', { msg: "TWOJE KONTO JEST ZABLOKOWANE!" });


        }
    });
router.post('/ban', checkAdmin, (req, res, next) => {
    User.ban(req.body.user, req.body.ban, (err, done) => {

    });
})
router.post('/hook', (req, res, next) => {
    register(req.get('X-Notification-Secret'), req.body, req.hostname);
    res.sendStatus(200);
})
router.get('/remove/:title', checkAdmin, (req, res, next) => {
    let title = req.params.title;
    Game.deleteOne({ name: title }, (err) => {
        if (!err) { res.sendStatus(200) } else {
            res.sendStatus(404)
        }

    })
})
router.get('/getug/:user', checkAdmin, (req, res) => {
    User.findOne({ username: req.params.user }, (err, user) => {
        let { games } = user;
        res.send({ user: games });
    })
});
router.get('/panel', checkAuthentication, (req, res, next) => {
    if (!req.user.done) {
        Game.getGames(req.user, (err, list) => {
            let owned = req.user.games;
            if (owned == null) owned = [];
            let filtered = list.filter(game => !owned.includes(game.name))
            let GameInfo = filtered.reduce((prev, next) => {
                prev.push({ name: next.name, img: next.img })
                return prev
            }, [])
            res.render('panel', { games: GameInfo, title: 'Panel' });
        })
    } else {
        res.location('/users/succes')
        res.redirect('/users/succes')
    }
})
router.get('/succes', checkAuthentication, (req, res, next) => {
    let owned = Game.find({ name: { $in: req.user.games } }, (err, doc) => {
        res.render('succes', { owned: doc, title: 'Konto' });
    })

})
router.get('/admin', checkAuthentication, checkAdmin, (req, res, next) => {
    Game.find({ from: req.user.username }, (err, list) => {
        User.find({ admin: false }, (err, users) => {
            res.render('admin', { games: list, users: users, title: 'Zarzadzanie' });
        })
    })
})
router.post('/addGame', uploadHandler.single('file'), (req, res, next) => {

    let game = JSON.parse(JSON.stringify(req.body));
    if (game.name !== '' && game.file !== undefined) {
        var ggame = new Game({
            name: game.name,
            img: 'https://storage.cloud.google.com/wiadro12331/' + req.file.filename,
            login: game.login,
            password: game.password,
            from: req.user.username,
            typ: req.body.typ

        })
        Game.createGame(ggame, (err, done) => {
            if (done) res.sendStatus(200);
            else {
                res.sendStatus(400);
            }
        })
    } else {
        res.sendStatus(400);
    }
})
router.post('/addGameURL', checkAdmin, (req, res, next) => {
    let game = JSON.parse(JSON.stringify(req.body));
    var ggame = new Game({
        name: game.name,
        img: game.img,
        login: game.login,
        password: game.password,
        from: req.user.username,
        typ: "game"
    })
    Game.createGame(ggame, (err, done) => {
        if (done) res.sendStatus(200);
        else {
            res.sendStatus(403);
        }
    })
})
router.post('/addAcc', checkAdmin, (req, res, next) => {
    let game = JSON.parse(JSON.stringify(req.body));
    var ggame = new Game({
        name: game.name,
        img: "https://steamstore-a.akamaihd.net/public/shared/images/responsive/share_steam_logo.png",
        login: game.login,
        password: game.password,
        games: game.games,
        typ: "account",
        from: req.user.username
    })
    Game.createGame(ggame, (err, done) => {
        if (done) res.sendStatus(200)
        else {
            res.sendStatus(403);
        }
    })
})

router.get('/key/:title', (req, res, next) => {
    var keys = require('../models/guard');
    console.log(keys);
    var user = req.user.username;
    let title = req.params.title;
    if (keys[title]) {
        if (received[user]) {
            if (!received[user].includes(title)) {
                usedkeys.push(keys[title])
                received[user].push(title);
                received[user][title] = keys[title];
                res.send({ msg: keys[title] });
            } else {
                res.send({ msg: `Wykorzystales juz klucz do tej gry,poczekaj 3 dni lub uzyj kodu ${received[user][title]}!` })
            }
        } else {
            received[user] = [];
            usedkeys.push(keys[title])
            received[user].push(title);
            received[user][title] = keys[title];
            res.send({ msg: keys[title] });
        }
    } else {
        res.send({ msg: "Zaloguj się do konta steam i sprobuj ponownie za chwile" });
    }
});

router.get('/cron', (req, res, next) => {
    received = [];
    usedkeys = [];
    keys = [];
    res.sendStatus(200);
})
router.post('/confirm', (req, res, next) => {
    User.confirm(req.user, req.body, (err, done) => {
        if (err) {
            res.sendStatus(400);
        } else {
            res.sendStatus(200);

        }
    })
})
router.post('/addTo', checkAuthentication, (req, res, next) => {
    var username = req.user.username;
    Game.findOne({ login: req.body.login }, (err, doc) => {
        if (doc !== null) {
            if (doc.password == req.body.password) {
                if (req.user.games.includes(doc.name)) {
                    res.sendStatus(404);
                } else {
                    User.confirm(req.user, doc.name, (err, done) => {
                        res.sendStatus(200);
                    });
                }


            } else {
                res.sendStatus(404);
            }
        } else {
            res.sendStatus(404);
        }
    })
})
router.post('/register', function(req, res, next) {
    register('salongier', req.body, req.hostname);

});

async function register(from, payment, host) {
    let user = payment.buyer;
    let datab = payment.database;
    User.createUser({
        username: user.email,
        password: 'xyz' + user.id,
        admin: false,
        done: false,
        from: from,
        games: datab.id
    }, (err, done) => {});
    await mail.send(user, host);
}

function checkAdmin(req, res, next) {
    if (req.user.admin) {
        next();
    } else {
        res.redirect("/");
    }
}

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/");
    }
}
module.exports = router;