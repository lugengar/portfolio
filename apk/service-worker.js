self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('mi-cache-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/icon-512.png',
        // otros archivos estáticos que uses
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.href === 'https://lugengar.github.io/aplicacion/data.json') {
    // Para esta URL, solo fetch directo (sin cache)
    event.respondWith(fetch(event.request));
  } else {
    // Para todo lo demás, cache primero
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
