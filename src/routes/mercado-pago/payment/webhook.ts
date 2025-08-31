import { env } from "@/config/env";
import { PaymentWebhookSchema } from "@/schemas/mercado-pago/payment/webhook";
import { MercadoPagoService } from "@/services/mercado-pago-service";
import { FastifyTypedInstance } from "@/types/fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import crypto from "crypto"; // Importa a biblioteca de criptografia do Node.js

export function paymentWebhook(app: FastifyTypedInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/webhook",
    {
      schema: {
        summary: "Recebe notificações de pagamento do Mercado Pago",
        description:
          "Este endpoint é chamado pelo Mercado Pago sempre que o status de um pagamento é alterado.",
        tags: ["Payment", "Webhook"],
        body: PaymentWebhookSchema,
        response: {
          200: z.object({
            message: z.string(),
          }),
          401: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      // 1. Validação da Assinatura
      const signatureHeader = request.headers["x-signature"] as string;
      if (!signatureHeader) {
        return reply.status(401).send({ error: "Assinatura ausente." });
      }

      const parts = signatureHeader.split(",");
      const ts = parts.find((p) => p.startsWith("ts="))?.split("=")[1];
      const hash = parts.find((p) => p.startsWith("v1="))?.split("=")[1];

      if (!ts || !hash) {
        return reply
          .status(401)
          .send({ error: "Formato de assinatura inválido." });
      }

      const secret = env.MERCADO_PAGO_WEBHOOK_SECRET;
      const manifest = `id:${request.body.data.id};request-id:${request.headers["x-request-id"]};ts:${ts};`;

      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(manifest);
      const expectedHash = hmac.digest("hex");

      if (expectedHash !== hash) {
        console.warn("⚠️ Tentativa de webhook com assinatura inválida!");
        return reply.status(401).send({ error: "Assinatura inválida." });
      }

      console.log("✅ Assinatura do Webhook validada com sucesso!");

      // 2. Processamento da Notificação (seu código original)
      const data = request.body;

      // A notificação apenas avisa. Buscamos o status real para ter a informação mais atual.
      const { status } = await MercadoPagoService.getPaymentStatus({
        payment_id: data.data.id,
      });

      if (status === "approved") {
        console.log(
          `🚀 Pagamento ${data.data.id} aprovado! Executando lógica de negócio...`
        );
        // TODO: Adicionar sua lógica aqui (ex: liberar acesso, enviar e-mail, etc.)
      } else {
        console.log(
          `ℹ️ Pagamento ${data.data.id} com status: ${status}. Nenhuma ação executada.`
        );
      }

      // Sempre retorne 200 para o Mercado Pago confirmar o recebimento
      return reply.status(200).send({
        message: "Webhook recebido e processado com sucesso.",
      });
    }
  );
}
