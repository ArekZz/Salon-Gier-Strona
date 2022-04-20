window.onload = () => {
    var button = document.querySelector('.button');
    var throttle = (func, ms = 30000, context = window) => {
        let to;
        let wait = false;
        return (...args) => {
            button.style.background = 'red';
            let later = () => {
                func.apply(context, args);
            };
            if (!wait) {
                later();
                wait = true;
                to = setTimeout(() => {
                    wait = false;
                    button.style.background = 'greenyellow';
                }, ms);
            }
        };
    }

    document.querySelector('.button').addEventListener('click', throttle((e) => {
        please();
    }));
    window.addEventListener('click', (e) => {
        var gamebox = document.querySelector('.gameBox');
        if (e.target == document.querySelector('.listGames')) {
            document.querySelector('.gameBox').classList = 'gameBox';
        }
    })
    document.querySelector('.mobmenu').addEventListener('click', () => {
        document.querySelector('.navigator').classList.toggle('expand');

        if (document.querySelector('.navigator').classList.contains('expand')) {
            document.querySelector('.navigator').style.height = 'auto';
            document.querySelector('.navigator').style.display = 'flex';

        } else {
            document.querySelector('.navigator').style.display = 'none';

        }
    })

    function please() {
        var answer = document.querySelector('.ans');
        var promiselog = document.querySelector('.log').value;
        fetch(`/users/key/${promiselog}`).then(res => res.status == 204 ? 204 : res.json()).then(res => {
            if (res == 204) {
                answer.innerHTML = 'Gra nie wymaga klucza lub musisz spróbować zalogować sie do konta Steam i spróbować ponownie za kilka minut!'
            } else {
                answer.innerHTML = res.msg;
            }
        });
    }
    var login = document.querySelector('.log');
    var password = document.querySelector('.pass');
    document.querySelectorAll('.input').forEach(inpt => inpt.addEventListener('click', copy));
    document.querySelectorAll('.input').forEach(inpt => inpt.addEventListener('keydown', down));

    function copy(e) {
        this.select();
        document.execCommand("copy");
    }

    function down(e) {
        e.preventDefault();
    }
    var modal = document.querySelector('.modal');
    modal.addEventListener('click', hideModal);

    function hideModal(e) {
        if (e.target == this) {
            this.style.display = 'none';
        }
    }
    document.querySelectorAll('.item').forEach(x => x.addEventListener('click', showPass));

    function showPass(e) {
        modal.style.display = 'block';
        var cord = [this.querySelector('.info-login').textContent, this.querySelector('.info-password').textContent];
        login.value = cord[0];
        password.value = cord[1];
    }
    document.querySelectorAll('.choose').forEach(button => button.addEventListener('click', show));

    function show() {
        var which = this.dataset.type;
        document.querySelectorAll('.item').forEach(item => {
            var acctype = item.querySelector('.info-type').textContent;
            if (acctype == which) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        })
    }
    document.querySelector('.addGame').addEventListener('click', slide);

    function slide() {
        document.querySelector('.gameBox').classList.toggle('slide');
    }
    document.querySelector('.button-g').addEventListener('click', add);

    function add() {
        var login = document.querySelector('.adlog').value;
        var password = document.querySelector('.adpas').value;
        if (login !== '' && password !== '') {
            fetch(`/users/addTo`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ login: login, password: password })
            }).then(res => {
                if (res.status == 200) {
                    location.reload();
                } else {
                    alert('Niestety takiej gry nie ma w bazie.')
                }
            })
        } else {
            return
        }
    }

}