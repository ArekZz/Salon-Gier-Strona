const CACHE_NAME = 'cashe';


let filesToCache = [
    '/',
    '/javascripts/helper.js',
    '/javascripts/getGame.js',
    '/stylesheets/index.css',
    '/stylesheets/style.css',
    '/manifest/index.html',
    '/users/',
    '/users/succes',


];

self.addEventListener('install', function(evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(filesToCache);
        }).catch(function(err) {

        })
    );
});

self.addEventListener('fetch', function(evt) {

    evt.respondWith(

        fetch(evt.request).catch(function() {

            return caches.match(evt.request);
        })
    );
});