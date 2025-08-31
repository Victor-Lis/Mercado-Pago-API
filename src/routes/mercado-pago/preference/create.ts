import { CreatePreferenceSchema } from "@/schemas/mercado-pago/preference/create";
import { MercadoPagoService } from "@/services/mercado-pago-service";
import { FastifyTypedInstance } from "@/types/fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export function createPreference(app: FastifyTypedInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        summary: "Create a new preference",
        tags: ["Payment", "Preference"],
        body: CreatePreferenceSchema,
        response: {
          201: z.object({
            message: z.string(),
            preference_id: z.string(),
            payment_url: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id, description, quantity, unit_price } = request.body;

      const { preference_id, payment_url } =
        await MercadoPagoService.createPayment({
          paymentData: {
            id,
            description,
            quantity,
            unit_price,
          },
        });

      return reply
        .status(201)
        .send({
          message: "Preference created successfully",
          preference_id,
          payment_url,
        })
        .redirect(payment_url);
    }
  );
}
