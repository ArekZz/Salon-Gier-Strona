var keys = [];
const notifier = require('mail-notifier');

const imap = {
    username: "login@gmail.com",
    password: "password",
    host: "imap.gmail.com",
    port: 993,
    tls: true,

};


const n = notifier(imap);

n.on('end', () => n.start()) // session closed
    .on('mail', mail => {
        if (mail.from[0].address == 'noreply@steampowered.com') {
            if (mail.text) {
                var login = mail.text.match(/(?<=Dear\s)\w+/gmi)[0];
                var key = mail.text.match(/^\w{5}$/gm)[0];

                if (key.length && login.length) {
                    keys[login] = key;
                }
            }
        } else {
            return
        }
    })
    .start();
module.exports = keys;