import { FastifyTypedInstance } from "@/types/fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export function paymentStatus(app: FastifyTypedInstance) {
  app.withTypeProvider<ZodTypeProvider>().get<{
    Params: { status: string };
  }>(
    "/:status",
    {
      schema: {
        summary: "Recebe notificações de pagamento do Mercado Pago",
        description:
          "Este endpoint é chamado pelo Mercado Pago sempre que o status de um pagamento é alterado.",
        tags: ["Payment"],
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
      const { status } = request.params;
      return reply.status(200).send({
        message: status,
      });
    }
  );
}
