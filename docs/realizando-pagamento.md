# Guia: Realizando um Pagamento com o Checkout Pro

Este guia explica o passo a passo para criar e processar um pagamento utilizando o Checkout Pro do Mercado Pago neste projeto.

---

## Fluxo Completo de um Pagamento
> É possível realizar todos os testes de requisição na rota / da API, onde está o Swagger


O processo de pagamento é dividido em três etapas principais:

1.  **Criar a Preferência de Pagamento**: Sua aplicação envia os detalhes da transação (produto, valor, etc.) para a API do Mercado Pago.
2.  **Redirecionar o Usuário**: O Mercado Pago retorna uma URL de pagamento. O usuário é enviado para essa URL para realizar o pagamento.
3.  **Receber a Confirmação**: Após o pagamento, o Mercado Pago notifica sua aplicação sobre o resultado através de um webhook.

---

## Passo 1: Criar a Preferência de Pagamento

Para iniciar uma transação, você precisa primeiro criar uma "preferência de pagamento".

### Rota da API

-   **Endpoint**: `POST /mercado-pago/preference/create`
-   **Descrição**: Esta rota recebe os dados do produto e do comprador e os envia para a API do Mercado Pago para gerar um link de pagamento.

### Exemplo de Requisição

Você pode usar o `curl` ou qualquer cliente de API para fazer a requisição. O corpo da requisição deve conter os detalhes do item e do comprador.

```bash
curl -X POST http://localhost:sua-porta/mercado-pago/preference/create \
-H "Content-Type: application/json" \
-d '{
  "items": [
    {
      "title": "Produto de Exemplo",
      "quantity": 1,
      "unit_price": 10.50
    }
  ],
  "payer": {
    "name": "João",
    "surname": "Silva",
    "email": "joao.silva@example.com"
  }
}'
```

### Resposta da API

Se a requisição for bem-sucedida, a API retornará um objeto contendo várias informações, incluindo a URL para o checkout. A propriedade mais importante é a `payment_url`:

```json
{
  "payment_url": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...",
  "preferenceId": "..."
}
```

---

## Passo 2: Realizar o Pagamento

1.  **Acesse a URL**: Copie a `payment_url` retornada no passo anterior e cole no seu navegador.
2.  **Checkout Pro**: Você será redirecionado para a página de checkout segura do Mercado Pago.
3.  **Realize o pagamento**: Preencha as informações e realize a compra.

---

## Passo 3: Verificar o Resultado do Pagamento
Existem duas maneiras de saber o que aconteceu com o pagamento:

### 1. Webhook (Notificação Automática)
-   **Como funciona**: Assim que o pagamento é aprovado (ou recusado), o Mercado Pago envia uma notificação para a sua aplicação.
-   **Endpoint no projeto**: `POST /mercado-pago/payment/webhook`
-   **O que acontece**: Esta rota recebe a notificação e, em seguida, busca os detalhes completos do pagamento usando o ID recebido.
-   **Onde ver o resultado**: No console da sua aplicação, você verá logs detalhados com os dados do pagamento recebido via webhook. Esta é a forma recomendada para processos automatizados (como liberar um pedido).

### 2. Consulta Manual do Status
-   **Como funciona**: Você pode consultar o status de um pagamento a qualquer momento usando o ID do pagamento.
-   **Endpoint no projeto**: `GET /mercado-pago/payment/status/{paymentId}`
-   **Como usar**:
    1.  Após o pagamento no Checkout Pro, você será redirecionado para uma página de sucesso que geralmente contém o `payment_id` na URL.
    2.  Pegue esse ID e use-o na rota acima.
-   **Exemplo**: `http://localhost:3333/mercado-pago/payment/status/123456789`
-   **Onde ver o resultado**: A resposta da API conterá todos os detalhes do pagamento, incluindo o status (`approved`, `rejected`, etc.).
