import { FastifyTypedInstance } from "@/types/fastify";
import { createPreference } from "./preference/create-preference";
import { getPreference } from "./preference/get-preference";
// import { paymentWebhook } from "./payment-webhook";

export async function MercadoPagoRoutes(app: FastifyTypedInstance) {
  app.register(createPreference);
  app.register(getPreference);
  // app.register(paymentWebhook);
}
  
