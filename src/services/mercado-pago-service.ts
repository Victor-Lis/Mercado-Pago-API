import { env } from "@/config/env";
import { NotFoundError } from "@/errors/not-found";
import { mpPayment, mpPreference } from "@/lib/mercado-pago";
import { CreatePreferenceType } from "@/schemas/mercado-pago/preference/create";
import { GetPaymentType } from "@/schemas/mercado-pago/payment/get";
import { GetPreferenceType } from "@/schemas/mercado-pago/preference/get";
import crypto from "crypto";
import { InvalidSignature } from "@/errors/invalid-signature";

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
          success: `/payment/success`,
          failure: `/payment/failure`,
          pending: `/payment/pending`,
        },
      },
    });

    const payment_url = preference.init_point || preference.sandbox_init_point;

    if (!preference.id || !payment_url) throw new NotFoundError();

    return { preference_id: preference.id, payment_url };
  }

  static async getPreference({
    preference_id,
  }: Pick<GetPreferenceType, "preference_id">): Promise<{
    payment: any;
  }> {
    try {
      const payment = await mpPreference.get({ preferenceId: preference_id });
      return {
        payment,
      };
    } catch {
      throw new NotFoundError();
    }
  }

  static async getPaymentStatus({
    payment_id,
  }: Pick<GetPaymentType, "payment_id">): Promise<{
    status: "approved" | "pending" | "rejected";
  }> {
    try {
      const payment = await mpPayment.get({ id: payment_id });
      console.log(
        `[Webhook] [Payment ID: ${payment.id}] [Status: ${payment.status}]`
      );
      return {
        status: payment.status as "approved" | "pending" | "rejected",
      };
    } catch {
      throw new NotFoundError();
    }
  }

  static validateSignature({
    signatureHeader,
    manifest,
  }: {
    signatureHeader: string;
    manifest: string;
  }): boolean {
    const parts = signatureHeader.split(",");
    const ts = parts.find((p) => p.startsWith("ts="))?.split("=")[1];
    const hash = parts.find((p) => p.startsWith("v1="))?.split("=")[1];

    if (!ts || !hash) throw new InvalidSignature();

    const secret = env.MERCADO_PAGO_WEBHOOK_SECRET;
    manifest += `ts:${ts};`;

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(manifest);
    const expectedHash = hmac.digest("hex");

    if (expectedHash !== hash) throw new InvalidSignature();

    return true;
  }
}
