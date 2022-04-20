window.onload = () => {
    let info = document.querySelector('.info');
    let number = document.querySelector('.data');
    (function() {
        var total = 0;
        let gamelist = {};
        let checkboxes = document.querySelectorAll('input').forEach(inpt => inpt.addEventListener('change', (e) => {
            total = 0;
            document.querySelectorAll('input').forEach(x => {
                if (x.checked) {
                    total++;
                }
            })
            if (total >= 11) {
                e.preventDefault();
                e.target.checked = false;
                return

            }
            var title = e.target.dataset.game;
            if (e.target.checked) {
                gamelist[title] = true;
            } else {
                gamelist[title] = !gamelist[title];
            }
            number.textContent = 10 - total;



        }))
        document.querySelector('.confirm').addEventListener('click', () => {
            console.log(total);
            if (total !== 10) {
                return
            } else {
                let pretty = Object.keys(gamelist)
                    .filter(game => gamelist[game])
                if (pretty.length == 10) {
                    fetch('/users/confirm', {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: 'POST',
                        body: JSON.stringify(pretty)
                    }).then(res => {
                        if (res.status == 200) {
                            location.href = 'succes'
                        }
                    })
                }
            }



        })
    })()
}