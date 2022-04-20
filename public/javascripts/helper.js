window.onload = () => {

    var button = document.querySelector('#remember');
    button.addEventListener('change', () => {
        if (button.checked) {
            localStorage.setItem('checked', true);
        } else {
            localStorage.setItem('checked', false);
        }
    })


    if (localStorage.getItem('checked') == true || localStorage.getItem('checked') == 'true') {
        button.checked = true;
    } else {
        button.checked = false;
    }


    document.querySelector('.button').addEventListener('click', () => {
        document.querySelector('.login-form').classList.remove('animdown')
        document.querySelector('.login-form').classList.add('animup')

    })
    document.querySelector('.hide').addEventListener('click', () => {
        document.querySelector('.login-form').classList.remove('animup')
        document.querySelector('.login-form').classList.add('animdown')
    })
    window.fbAsyncInit = function() {
        FB.init({
            appId: '608433026303295',
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v2.11'
        });
    };
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}