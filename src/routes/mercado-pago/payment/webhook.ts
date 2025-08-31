import { env } from "@/config/env";
import {
  PaymentSignatureSchema,
  PaymentWebhookSchema,
} from "@/schemas/mercado-pago/payment/webhook";
import { MercadoPagoService } from "@/services/mercado-pago-service";
import { FastifyTypedInstance } from "@/types/fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

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
            status: z.enum(["approved", "pending", "rejected"]),
          }),
          401: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { "x-signature": signatureHeader } = PaymentSignatureSchema.parse(
        request.headers
      );

      const isValid = MercadoPagoService.validateSignature({
        signatureHeader,
        manifest: `id:${request.body.data.id};request-id:${request.headers["x-request-id"]};`,
      });

      const data = request.body;

      const { status } = await MercadoPagoService.getPaymentStatus({
        payment_id: data.data.id,
      });

      return reply.status(200).send({
        message: "Webhook recebido e processado com sucesso.",
        status,
      });
    }
  );
}
