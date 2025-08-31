import { env } from "@/config/env";
import { NotFoundError } from "@/errors/not-found";
import { mpPayment, mpPreference } from "@/lib/mercado-pago";
import { CreatePreferenceType } from "@/schemas/mercado-pago/preference/create-preference";
import { GetPaymentType } from "@/schemas/mercado-pago/payment/get-payment";
import { GetPreferenceType } from "@/schemas/mercado-pago/preference/get-preference";
import { PreferenceResponse } from "mercadopago/dist/clients/preference/commonTypes";

export class MercadoPagoService {
  static async createPayment({
    paymentData,
  }: {
    paymentData: CreatePreferenceType;
  }): Promise<{ preference_id: string; payment_url: string }> {
    const preference = await mpPreference.create({
      body: {
        items: [
          {
            id: paymentData.id,
            title: paymentData.description,
            unit_price: paymentData.unit_price,
            quantity: paymentData.quantity,
          },
        ],
        // payment_methods: {
        //   excluded_payment_types: [
        //     { id: "credit_card" }, // Exclui cartão de crédito
        //     { id: "debit_card" }, // Exclui cartão de débito
        //     { id: "ticket" }, // Exclui boleto
        //   ],
        //   installments: 1,
        // },
        back_urls: {
          success: `${env.MERCADO_PAGO_PAYMENTS_URL}/success`,
          failure: `${env.MERCADO_PAGO_PAYMENTS_URL}/failure`,
          pending: `${env.MERCADO_PAGO_PAYMENTS_URL}/pending`,
        },
      },
    });

    const payment_url = preference.init_point || preference.sandbox_init_point;

    if (!preference.id || !payment_url) throw new NotFoundError();

    return { preference_id: preference.id, payment_url };
  }

  static async getPreference({
    preferenceId,
  }: Pick<GetPreferenceType, "preferenceId">): Promise<{
    preference: PreferenceResponse;
  }> {
    const preference = await mpPreference.get({ preferenceId });

    if (!preference) throw new NotFoundError();

    return {
      preference,
    };
  }

  static async getPaymentStatus({
    payment_id,
  }: Pick<GetPaymentType, "payment_id">): Promise<{
    status: "approved" | "pending" | "rejected";
  }> {
    const payment = await mpPayment.get({ id: payment_id });

    if (!payment || !payment.status) throw new NotFoundError();

    return {
      status: payment.status as "approved" | "pending" | "rejected",
    };
  }
}
