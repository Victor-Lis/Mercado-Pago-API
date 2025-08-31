import { GetPreferenceSchema } from "@/schemas/mercado-pago/preference/get";
import { MercadoPagoService } from "@/services/mercado-pago-service";
import { FastifyTypedInstance } from "@/types/fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export function getPreference(app: FastifyTypedInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        summary: "Get preference",
        tags: ["Preference"],
        querystring: GetPreferenceSchema,
        response: {
          200: z.object({
            message: z.string(),
            status: z.any(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { payment_id } = request.query;

      const { status } = await MercadoPagoService.getPaymentStatus({
        payment_id: payment_id as string,
      });

      return reply.status(200).send({
        message: "Preference retrieved successfully",
        status,
      });
    }
  );
}
