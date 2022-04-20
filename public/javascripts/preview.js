document.querySelector('#file').addEventListener('change', readURL);
document.querySelector('#nameg').addEventListener('change', change);
var acctype = 'account';
let img;
let loader;

window.onload = () => {
    loader = document.querySelector('.loader');
    window.addEventListener('keypress', (e) => {
        if (e.which == 13 || e.key == 'Enter' || e.code == 'Enter') {
            prep(e);
        } else {
            return
        }
    });

    document.querySelector('button').addEventListener('click', (e) => {
        prep(e);
    });
}
document.querySelectorAll('.useracc').forEach(user => user.addEventListener('click', checkuser));
var floating = document.querySelector('.floatingdesc');
floating.addEventListener('click', hidefloat);

function hidefloat() {
    this.classList.remove('showfloat')

}

function checkuser() {

    let games;
    if (this.dataset.received == 'yes') {

        fetch(`/users/getug/${this.dataset.email}`)
            .then(res => res.json())
            .then(res => games = res.user)
            .finally(() => {
                floating.classList.add('showfloat')
                let txt = games.map(game => `<p>${game}</p>`).join('')
                floating.innerHTML = `<h2>Gry użytkownika ${this.dataset.email}</h2>` + txt;
            })
    } else {
        return
    }
}

function prep(x) {
    var name = document.querySelector('#name').value;
    var login = document.querySelector('#login').value;
    var password = document.querySelector('#password').value;
    var url = document.querySelector('#url').value;
    x.preventDefault();
    var Form = new FormData();
    Form.append('name', name);
    Form.append('login', login);
    Form.append('password', password);
    Form.append('file', img);
    Form.append('url', url);
    Form.append('typ', acctype);
    sendData(Form);
}
document.querySelectorAll('.option').forEach(option => option.addEventListener('click', display));
document.querySelectorAll('.ban').forEach(ban => ban.addEventListener('click', bant));

function bant() {
    var ban;
    var tobannick = this.dataset.ban;
    var toban = this.dataset.banned;
    if (toban == 'true') {
        ban = false;
    } else {
        ban = true;
    }
    let ans = confirm(`Napewno chcesz zbanowac: ${tobannick}?`);
    if (ans) {
        fetch(`/users/ban`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: tobannick, ban: ban })
        });
    } else {
        return
    }
}

function display(e) {
    var gametable = document.querySelector('.game');
    var usertable = document.querySelector('.user');
    if (this.dataset.option == 'game') {
        gametable.style.display = 'block';
        usertable.style.display = 'none';
    } else {
        gametable.style.display = 'none';
        usertable.style.display = 'block';
    }
}

var gametable = document.querySelectorAll('.game-row').forEach(game => game.addEventListener('click', accgame));
let gamelist = [];

function accgame() {

    if (acctype == 'account') {
        var nameholder = this.querySelector('.nm');
        var name = nameholder.textContent;
        if (!gamelist.includes(name)) {
            gamelist.push(name);
            this.style.background = 'green';
        } else {
            gamelist.splice(gamelist.indexOf(name), 1);
            this.style.background = '';
        }
    } else {
        return
    }
}

document.querySelectorAll('.typ').forEach(option => option.addEventListener('click', typ));
var game = document.querySelector('.gra').click();

function typ(e) {
    var game = document.querySelector('.gra');
    var account = document.querySelector('.konto');
    game.style.color = 'grey';
    account.style.color = 'grey';
    var type = this.dataset.typ;
    if (type == 'game') {
        game.style.color = '#403866';
        show(document.querySelector('.game-cont'));
        hide(document.querySelector('.account-cont'));
        document.querySelector('.prev').style.display = 'flex';
    } else {
        account.style.color = '#403866';
        show(document.querySelector('.account-cont'));
        hide(document.querySelector('.game-cont'));
        document.querySelector('.prev').style.display = 'none';
        acctype = 'account';
        document.querySelector('.checkbox').checked = false;
    }

}
document.querySelector('.checkbox').addEventListener('change', checkbox);

function checkbox() {
    var checked = this.checked;
    if (checked) {
        acctype = 'game';
    } else {
        acctype = 'account';
    }
}
document.querySelector('.acc-log').addEventListener('click', sendacc);
document.querySelectorAll('.img').forEach(del => del.addEventListener('click', remove));

function remove() {
    var toremove = this.dataset.del;
    let ans = confirm(`Napewno chcesz usunąc: ${toremove}?`);
    if (ans) {
        loader.style.display = 'block';
        fetch(`/users/remove/${toremove}`).finally(() => {
            loader.style.display = 'none';
        })
        document.querySelector('.gamelist tbody').removeChild(this.parentElement);
    } else {
        return
    }
}
document.querySelector('.search').addEventListener('keydown', sort);

function sort() {
    var value = this.value;
    var regexp = new RegExp(value, 'gi');
    document.querySelectorAll('.game-row').forEach(gamerow => {
        var gamename = gamerow.querySelector('.nm').textContent;
        if (regexp.test(gamename)) {
            gamerow.style.display = '';

        } else {
            gamerow.style.display = 'none';
        }
    })
}

function sendacc() {
    document.querySelectorAll('.game-row').forEach(gamerow => {
        gamerow.style.background = '';
    })
    var id = document.querySelector('#name').value
    var login = document.querySelector('#login').value
    var password = document.querySelector('#password').value

    if (id !== '' && login !== '' && password !== '') {
        var data = JSON.stringify({ name: id, login: login, password: password, games: gamelist });
        loader.style.display = 'block';
        fetch('/users/addAcc', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: data
        }).then(() => {
            loader.style.display = 'none';
        })

        gamelist = [];
    } else {
        alert('Uzupelnij Dane');
    }
}

function show(elem) {
    elem.style.display = 'block';
}

function hide(elem) {
    elem.style.display = 'none';
}

function change(input) {
    document.querySelector('.two').innerHTML = this.value;
}

function readURL(input) {
    var reader = new FileReader();
    reader.onload = function(e) {
        document.querySelector('.top').style.background = `url(${reader.result})`;
        document.querySelector('.top').style.backgroundSize = `100% 100%`;
    };
    img = input.target.files[0];
    reader.readAsDataURL(input.target.files[0]);

}

document.querySelector('#url').addEventListener('change', changeImg);

function changeImg() {
    var url = document.querySelector('#url').value;
    document.querySelector('.top').style.background = `url(${url})`;
    document.querySelector('.top').style.backgroundSize = `100% 100%`;
}
var sendData = (data) => {
    loader.style.display = 'block';
    if (document.querySelector('#url').value !== '' || document.querySelector('#url').disabled) {
        var name = document.querySelector('#nameg').value;
        var login = document.querySelector('#loging').value;
        var password = document.querySelector('#passwordg').value;
        var img = document.querySelector('#url').value;
        let toString = { name: name, login: login, password: password, img: img, typ: acctype };
        fetch(`/users/addGameURL`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(toString)
            })
            .then((response) => {
                if (response.status == 500) {
                    alert('Blad podczas dodawania Gry');
                }
            }).finally(() => {
                loader.style.display = 'none';
            })
    } else {
        fetch(`/users/addGame`, {
                method: 'POST',
                body: data
            })
            .then((response) => {
                if (response.status == 500) {
                    alert('Blad podczas dodawania Gry');
                }
            }).finally(() => {
                loader.style.display = 'none';
            })
    }

}