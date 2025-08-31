# Guia de Uso: Ngrok para Webhooks do Mercado Pago

Este guia foca em como o **Ngrok** é utilizado neste projeto para expor sua aplicação local à internet, permitindo que você receba e teste os webhooks do Mercado Pago em tempo real.

---

## 1. Por que o Ngrok é Essencial?

Quando você está desenvolvendo em sua máquina local (`localhost`), sua aplicação não é acessível pela internet. No entanto, serviços como o Mercado Pago precisam enviar notificações (webhooks) para um endereço público sempre que um evento ocorre (ex: um pagamento é aprovado).

O Ngrok resolve isso criando um **túnel seguro** entre um endereço público na internet e a sua aplicação rodando localmente.

**Em resumo:** Ngrok dá um "endereço público" temporário para a sua máquina.

---

## 2. Configurando o Ngrok

Para que o Ngrok funcione corretamente e de forma integrada ao projeto, você precisa configurar algumas variáveis no seu arquivo `.env`.

```env
# Token de autenticação do Ngrok
NGROK_AUTHTOKEN="seu-token-do-ngrok-aqui"

# Domínio estático (recomendado)
NGROK_STATIC_DOMAIN="seu-dominio-estatico-ngrok-aqui"
```

### Onde encontrar as credenciais?

1.  **Crie uma conta** no [site oficial do Ngrok](https://ngrok.com/).
2.  **Acesse seu Dashboard**:
    *   Para o `NGROK_AUTHTOKEN`, vá para a seção [Your Authtoken](https://dashboard.ngrok.com/get-started/your-authtoken) e copie o token.
    *   Para o `NGROK_STATIC_DOMAIN`, vá para a seção [Domains](https://dashboard.ngrok.com/domains) no menu lateral. Crie um novo domínio estático (é um recurso gratuito) e copie o endereço gerado.

### Vantagem do Domínio Estático

Usar um domínio estático (`NGROK_STATIC_DOMAIN`) é altamente recomendado. Sem ele, o Ngrok gera uma nova URL a cada vez que você reinicia o servidor. Com um domínio estático, sua URL pública será sempre a mesma, e você **não precisará atualizar a URL do webhook no painel do Mercado Pago** a cada reinicialização.

---

## 3. Como a Integração Funciona no Código

A "mágica" acontece de forma automatizada quando você inicia o projeto.

1.  **Inicialização**: Ao rodar `pnpm dev`, o script em `src/lib/ngrok.ts` é executado.
2.  **Criação do Túnel**: Este script usa as suas credenciais do `.env` para se conectar ao Ngrok e criar um túnel para a porta em que sua aplicação está rodando (ex: `PORT=3000`).
3.  **URL Pública**: O Ngrok retorna a URL pública (ex: `https://seu-dominio.ngrok-free.app`).
4.  **Log**: Essa URL é exibida no console no início da execução, informando que o túnel está ativo.

É essa URL que você (ou um script de configuração) deve usar para registrar o endpoint do webhook no painel do Mercado Pago. Neste projeto, o endpoint é `/payment/webhook`, então a URL completa seria `https://seu-dominio.ngrok-free.app/payment/webhook`.

---

<!-- 
## 4. Verificando o Tráfego do Webhook

O Ngrok oferece uma interface web local para inspecionar todo o tráfego que passa pelo túnel.

*   **Acesse:** [http://127.0.0.1:4040](http://127.0.0.1:4040) no seu navegador.

Nesta interface, você pode:
*   Ver todas as requisições recebidas do Mercado Pago em tempo real.
*   Inspecionar os `headers` e o `body` de cada requisição.
*   Verificar o status da resposta enviada pela sua aplicação (ex: 200 OK, 400 Bad Request).

Essa ferramenta é extremamente útil para depurar problemas com webhooks.
 -->
