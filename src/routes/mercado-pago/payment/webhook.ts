import { env } from "@/config/env";
import { NotAuthorizedError } from "@/errors/not-authorized";
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
        // querystring: z.object({
        //   "data.id": z.string().optional(),
        //   type: z.string().optional(),
        // }),
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
      const { id, type } = request.body;

      console.log(`[Webhook] Payment id: ${id}`);

      const { status } = await MercadoPagoService.getPaymentStatus({
        payment_id: id,
      });

      console.log(`[Webhook] Payment status: ${status}`);

      return reply.status(200).send({
        message: "Webhook recebido e processado com sucesso.",
        status,
      });
    }
  );
}
