/* Service worker da Central de Comando.
 *
 * Mesma função do sw do Painel: o app abrir sem internet depois da
 * primeira visita. Nenhum dado do usuário passa por aqui — prioridades,
 * projetos e comandos vivem em localStorage e não saem do aparelho.
 *
 * Ao publicar uma versão nova, troque VERSAO para invalidar o cache.
 */
var VERSAO = 'central-v3';
var ARQUIVOS = ['.', 'index.html', 'manifest.webmanifest', 'icone.svg'];

self.addEventListener('install', function (evento) {
  evento.waitUntil(
    caches.open(VERSAO).then(function (cache) {
      return cache.addAll(ARQUIVOS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (evento) {
  evento.waitUntil(
    caches.keys().then(function (chaves) {
      return Promise.all(chaves.map(function (c) {
        return c === VERSAO ? null : caches.delete(c);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (evento) {
  if (evento.request.method !== 'GET') return;
  evento.respondWith(
    caches.match(evento.request).then(function (resposta) {
      return resposta || fetch(evento.request).catch(function () {
        return caches.match('index.html');
      });
    })
  );
});
