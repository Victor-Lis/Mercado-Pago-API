<div align="center">
  <img src="https://mobile.mercadolibre.com/remote_resources/image/web-private-nav-mp-logo" alt="Mercado Pago Logo" width="120" />
  
  <h1>🚀 Template Node.js + Mercado Pago API</h1>
  <p>Um projeto robusto, moderno e fácil de entender para integrar <b>Node.js</b> com a <b>API do Mercado Pago</b>!</p>
</div>

---

## ✨ Visão Geral

Este repositório serve como um template completo para integração com a API do Mercado Pago usando Node.js, TypeScript e Fastify. O objetivo é simplificar a vida de quem precisa lidar com pagamentos, webhooks e preferências, entregando uma base sólida, extensível e bem documentada.

> 💡 **Por que Node.js?**<br>
> Apesar de usar Next.js em muitos projetos, a complexidade da API do Mercado Pago e a necessidade de controle total do backend me fizeram optar por Node.js puro. <br> A maioria dos tutoriais disponíveis são para Next.js e deixam a desejar em arquitetura e clareza.

---

## 🛠️ Tecnologias & Ferramentas

<style>
  .stack-list {
    list-style: none;
    padding: 0;
    margin-top: 10px;
  }
  .stack-list li {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
  .stack-list img {
    margin-right: 8px;
  }
</style>

<details>
  <summary><b>Stack principal</b></summary>
  <ul class="stack-list">
    <li>
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="20"/>
      <b>Node.js</b> — Backend rápido e eficiente
    </li>
    <li>
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="20"/>
      <b>TypeScript</b> — Tipagem estática
    </li>
    <li>
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastify/fastify-original.svg" width="20"/>
      <b>Fastify</b> — Framework web performático
    </li>
    <li>
      <img src="https://zod.dev/_next/image?url=%2Flogo%2Flogo-glow.png&w=640&q=100" width="20"/>
      <b>Zod</b> — Validação de dados
    </li>
    <li>
      <img src="https://static1.smartbear.co/swagger/media/assets/swagger_fav.png" width="20"/>
      <b>Swagger</b> — Documentação automática
    </li>
    <li>
      <img src="https://www.mercadopago.com.br/favicon.ico" width="20"/>
      <b>Mercado Pago API</b> — Integração completa
    </li>
    <li>
      <img src="https://www.docker.com/favicon.ico" width="20"/>
      <b>Docker</b> — Ambientes isolados
    </li>
    <li>
      <img src="https://cdn.prod.website-files.com/63ed4bc7a4b189da942a6b8c/63ef861b114f2bbd3e038582_Untitled%20design%20(3).svg" width="20"/>
      <b>Ngrok</b> — Testes de webhooks
    </li>
  </ul>
</details>

---

## 🗂️ Estrutura do Projeto

```text
src/
  routes/         # Rotas da API (pagamento, preferência, etc.)
  services/       # Integração e regras de negócio
  schemas/        # Validação com Zod
  middlewares/    # Middlewares customizados
  lib/            # Bibliotecas auxiliares (Mercado Pago, Ngrok)
  config/         # Configurações
  errors/         # Tratamento de erros
  types/          # Tipagens
  utils/          # Funções utilitárias
docker-compose.yaml & dockerfile  # Containers
README.md         # Instruções gerais
```

---

## 🎯 Objetivo

Fornecer uma base clara, moderna e extensível para projetos que utilizam a API do Mercado Pago, facilitando a integração e o entendimento da arquitetura para devs de todos os níveis.

---

## 📚 Tutoriais

Tutoriais detalhados estarão disponíveis em arquivos README específicos para cada funcionalidade.

- [Configuração do Ngrok](./docs/ngrok.md)
- [Integração com a API do Mercado Pago](./docs/mercado-pago.md)
- [Realizando um pagamento](./docs/realizando-pagamento.md)

---

## 🤝 Contribuição

Contribuições são super bem-vindas! Abra uma <b>issue</b> ou <b>pull request</b> para sugerir melhorias.

---

## 👤 Autor

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/victor-lis">
        <img src="https://avatars.githubusercontent.com/u/109773129?v=4" width="50px;" alt="Foto de Victor Lis Bronzo" style="border-radius:50%;"/>
      </a>
    </td>
    <td>
      Feito com ❤️ por <b>Victor Lis Bronzo</b>
      <br/>
      <a href="https://www.linkedin.com/in/victor-lis-bronzo" target="_blank">Meu LinkedIn</a>
    </td>
  </tr>
</table>
