import { env } from "@/config/env";
import { NotFoundError } from "@/errors/not-found";
import { mpPayment, mpPreference } from "@/lib/mercado-pago";
import { CreatePreferenceType } from "@/schemas/mercado-pago/preference/create";
import { GetPaymentType } from "@/schemas/mercado-pago/payment/get";
import { GetPreferenceType } from "@/schemas/mercado-pago/preference/get";

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
        payment_methods: {
          default_payment_method_id: "pix",
        },
        back_urls: {
          success: `${env.MERCADO_PAGO_PAYMENTS_URL}payment/success`,
          failure: `${env.MERCADO_PAGO_PAYMENTS_URL}payment/failure`,
          pending: `${env.MERCADO_PAGO_PAYMENTS_URL}payment/pending`,
        },
      },
    });

    const payment_url = preference.init_point || preference.sandbox_init_point;

    if (!preference.id || !payment_url) throw new NotFoundError();

    return { preference_id: preference.id, payment_url };
  }

  static async getPreference({
    payment_id,
  }: Pick<GetPreferenceType, "payment_id">): Promise<{
    payment: any;
  }> {
    const payment = await mpPayment.get({ id: payment_id });

    if (!payment) throw new NotFoundError();

    return {
      payment,
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
