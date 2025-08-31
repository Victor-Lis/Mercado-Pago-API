import { env } from "@/config/env";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

const mpClient = new MercadoPagoConfig({
  accessToken: env.MERCADO_PAGO_ACCESS_TOKEN,
});

const mpPreference = new Preference(mpClient);

const mpPayment = new Payment(mpClient);

export { mpClient, mpPreference, mpPayment };