# Guia de Integração com o Mercado Pago

Este guia detalha os passos necessários para configurar a integração com a API do Mercado Pago neste projeto.

---

## 1. Variáveis de Ambiente

Para que a integração funcione, você precisa configurar algumas variáveis de ambiente. Crie um arquivo `.env` na raiz do projeto, baseado no exemplo a seguir:

```env
PORT=3000 # porta da sua aplicação

MERCADO_PAGO_ACCESS_TOKEN="token-da-sua-aplicação-mercado-pago-aqui"
MERCADO_PAGO_WEBHOOK_SECRET="seu-webhook-secret-aqui"
MERCADO_PAGO_WEBHOOK_URL="payment/webhook"

NGROK_AUTHTOKEN="seu-token-do-ngrok-aqui"
NGROK_STATIC_DOMAIN="seu-dominio-estatico-ngrok-aqui"
```

### Onde encontrar as credenciais?

#### `MERCADO_PAGO_ACCESS_TOKEN`

1.  Acesse o [Painel de Desenvolvedores do Mercado Pago](https://www.mercadopago.com.br/developers/panel).
2.  Vá para **Suas Aplicações** e selecione (ou crie) uma aplicação. Caso crie, utilize o "CheckoutPro".
3.  Na seção **Credenciais de Produção** (ou de Teste), você encontrará o seu **Access Token**.
    -   **Atenção:** Use as credenciais de **Teste** para o ambiente de desenvolvimento.

#### `MERCADO_PAGO_WEBHOOK_SECRET`

1.  Acesse o [Painel de Desenvolvedores do Mercado Pago](https://www.mercadopago.com.br/developers/panel).
2.  Vá para **Suas Aplicações** e selecione (ou crie) uma aplicação. Caso crie, utilize o "CheckoutPro".
3.  Na seção **Webhooks**, clique em gerenciar notificações e você encontrará o seu **Webhook Secret** (Assinatura Secreta).
4.  Seu webhook deve ao menos estar marcado com a opção de "pagamentos".

#### `NGROK_AUTHTOKEN` e `NGROK_STATIC_DOMAIN`

1.  Crie uma conta no [site do Ngrok](https://ngrok.com/).
2.  Acesse seu os [domains](https://dashboard.ngrok.com/domains) e crie um domínio estático (ou utilize um criado).
3.  Copie o seu `authtoken` e cole no arquivo `.env`.
4.  Copie o seu domínio estático e cole no arquivo `.env`.

---

## 2. Como Funciona o Webhook com Ngrok

A API do Mercado Pago notifica sua aplicação sobre eventos (como atualizações de status de pagamento) através de **webhooks**. Para que isso funcione em um ambiente de desenvolvimento local, sua máquina precisa estar acessível pela internet.

É aí que o **Ngrok** entra:

1.  Ao iniciar a aplicação (`pnpm dev`), o Ngrok é executado automaticamente.
2.  Ele cria um túnel seguro e gera uma URL pública (ex: `https://random-string.ngrok.io`).
3.  Essa URL é usada para configurar o webhook do Mercado Pago, permitindo que os servidores do Mercado Pago enviem notificações diretamente para a sua aplicação local.

A variável `MERCADO_PAGO_WEBHOOK_URL` deve ser preenchida com a URL gerada pelo Ngrok, seguida pelo endpoint do webhook, que neste projeto é `/payment/webhook`.

---

## 3. Estrutura da Integração no Código

Os principais arquivos relacionados à integração são:

-   `src/lib/mercado-pago.ts`: Contém a instância do cliente do Mercado Pago, configurada com o seu `ACCESS_TOKEN`.
-   `src/services/mercado-pago-service.ts`: Centraliza toda a lógica de comunicação com a API do Mercado Pago (criar preferências, consultar pagamentos, etc.).
-   `src/routes/mercado-pago/`: Contém as rotas da API que interagem com o serviço do Mercado Pago.
    -   `preference/create.ts`: Rota para criar uma preferência de pagamento.
    -   `payment/webhook.ts`: Rota que recebe as notificações de webhook.
-   `src/config/env.ts`: Define o schema e valida as variáveis de ambiente necessárias.

Com essas configurações, o projeto estará pronto para processar pagamentos e receber notificações do Mercado Pago.
