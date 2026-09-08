# Free Fire Likes V2

Site em Node.js + Express para usar a API V2 de likes pelo UID.

## Rodar localmente

```bash
npm install
npm start
```

Abra `http://localhost:3000`.

## API usada

`GET https://botlikesff.rexapi.com.br/api/v2/likes?uid=SEU_UID`

O backend faz a chamada para evitar expor a integração diretamente no navegador.

> A documentação do projeto externo informa que o endpoint é gratuito, sem token e adiciona automaticamente 100 likes/dia. Isso é uma afirmação do projeto externo; o funcionamento pode mudar.

## Deploy

Pode ser hospedado em serviços que executem Node.js, como Render ou Railway. GitHub Pages sozinho não executa o `server.js`.
