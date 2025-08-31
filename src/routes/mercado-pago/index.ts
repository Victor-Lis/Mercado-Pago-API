import { FastifyTypedInstance } from "@/types/fastify";
import { createPreference } from "./preference/create";
import { getPreference } from "./preference/get";
import { paymentWebhook } from "./payment/webhook";
import { paymentStatus } from "./payment/status";

export async function MercadoPagoRoutes(app: FastifyTypedInstance) {
  app.register(createPreference);
  app.register(getPreference);
  app.register(paymentWebhook);
  app.register(paymentStatus);
}
  
