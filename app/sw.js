/* Service worker do Painel de Comando.
 *
 * Objetivo único: o app abrir sem internet depois da primeira visita.
 * Não faz sincronização, não guarda dado do usuário e não fala com
 * servidor nenhum — o que a pessoa escreve fica em localStorage e não
 * passa por aqui.
 *
 * Estratégia: cache-first para os arquivos do app, que são estáticos.
 * Ao publicar uma versão nova, troque VERSAO para invalidar o cache.
 */
var VERSAO = 'comando-v2';
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
  // Remove caches de versões anteriores para não acumular no aparelho.
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
        // Sem rede e sem cache: devolve a página inicial, que já basta
        // para o app funcionar, porque tudo roda no aparelho.
        return caches.match('index.html');
      });
    })
  );
});
