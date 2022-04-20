const PATH = 'serviceWorker.js';

let isServiceWorkersSupport = ('serviceWorker' in navigator);

if (isServiceWorkersSupport) {
    navigator.serviceWorker.register(PATH, {
        scope: '/'
    }).then(function() {}).catch(function(err) {});
}