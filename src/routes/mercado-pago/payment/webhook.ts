import { NotAuthorizedError } from "@/errors/not-authorized";
import { PaymentSignatureSchema, PaymentWebhookSchema } from "@/schemas/mercado-pago/payment/webhook";
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
      const {
        data: { id: payment_id },
      } = request.body;

      const { "x-signature": signatureHeader } = PaymentSignatureSchema.parse(
        request.headers
      );

      const isValid = MercadoPagoService.validateSignature({
        signatureHeader: signatureHeader || "",
        manifest: `id:${request.body.data.id};request-id:${request.headers["x-request-id"]};`,
      });

      if (!isValid) throw new NotAuthorizedError("Invalid signature");

      const { status } = await MercadoPagoService.getPaymentStatus({
        payment_id,
      });

      return reply.status(200).send({
        message: "Webhook recebido e processado com sucesso.",
        status,
      });
    }
  );
}
