# Landing page — O Segredo do Comando

Página nova, construída em 2026-08-01 para substituir as duas que estão no ar.

## Por que existe

Havia **duas páginas publicadas com preços diferentes apontando para o mesmo checkout**:

| | chatgpt.site | vercel.app | esta |
|---|---|---|---|
| Preço anunciado | R$ 9,90 | R$ 37 | R$ 37 |
| Peso | 5.353 KB | 14 KB | **19 KB** |
| Resposta | 2.955 ms | 229 ms | — |
| Controle | seu | **do sócio** | **seu** |
| Eventos de pixel | só PageView | só PageView | **PageView + InitiateCheckout** |

Quem entrava pela `chatgpt.site` via R$ 9,90 e era cobrado R$ 37 no checkout.

## O que mudou de verdade

**Peso.** 19 KB de HTML. Carga inicial de ~146 KB contra 5.353 KB — **97,3% mais leve**. Nas campanhas de julho, 72% das pessoas que clicaram nunca chegaram a ver a página (216 cliques → 61 visualizações). O peso era o suspeito principal.

**Evento de conversão.** As páginas antigas disparavam só `PageView`. Sem `InitiateCheckout`, a Meta otimiza para quem *carrega* a página, não para quem *compra*. Agora o clique em qualquer botão dispara o evento antes de navegar.

**Preço em um lugar só.** A constante `CHECKOUT` e o preço aparecem no topo do script. Trocar ali muda todos os botões.

**Sem contador falso.** A página anterior tinha uma contagem regressiva — a da `vercel.app` estava marcando `00 dias 00 horas 00 min 00 seg` e continuava vendendo. Escassez que não é real destrói a confiança que este produto vende.

**UTMs preservados.** Os parâmetros da URL de entrada são repassados ao checkout, então a origem do tráfego sobrevive até a Kiwify.

## Acessibilidade

Todos os pares texto/fundo verificados pela fórmula WCAG 2.1 — nenhum abaixo de 4.5:1 (3:1 para texto grande). O marcador "✕" começou em `#9A5B44` (2.82x, reprovava) e foi corrigido para `#CE9179` (5.67x).

Paleta exclusivamente de [MARCA.md](../00_GOVERNANCA/MARCA.md).

## Estrutura

```
landing/
  index.html      19 KB — tudo inline, sem dependência externa além do pixel
  img/            6 imagens, 588 KB total, todas com lazy-load exceto a capa
```

## Publicar

Não precisa de build. É HTML estático:

1. **Vercel** (na sua conta) — arraste a pasta `landing/` em vercel.com/new
2. **Netlify** — arraste em app.netlify.com/drop
3. **Cloudflare Pages** — conecte um repositório ou faça upload direto

**Antes de publicar, ajuste:**

- `CHECKOUT` no script, se o link da Kiwify mudar
- o e-mail no rodapé (`contato@osegredodocomando.com.br`)
- a tag `<link rel="canonical">` para o domínio real
- o ID do pixel, se você criar um novo sob sua conta

## Domínio — recomendação

Registre um domínio próprio (`osegredodocomando.com.br`) e aponte para a hospedagem sua.

Motivo: hoje a página que converte melhor está numa conta que você não acessa, e a que você controla é a lenta com o preço errado. Domínio próprio resolve os dois de uma vez — e o pixel passa a viver em infraestrutura sua, que foi exatamente o problema apontado no relatório de campanhas.

**Ao migrar, redirecione `chatgpt.site` e `vercel.app` (301) para o domínio novo.** Deixar as antigas no ar divide dados de pixel e mantém o preço errado circulando.
