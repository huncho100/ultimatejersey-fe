import { authenticatedRequest } from "./api";

interface PaymentInitialization {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface PaymentVerification {
  reference: string;
  status: string;
  amount: number;
  currency: string;
  channel: string | null;
  paid_at: string | null;
}

export const paymentService = {
  initialize(orderId: number) {
    return authenticatedRequest<PaymentInitialization>(
      `/payments/initialize/${orderId}`,
      { method: "POST" }
    );
  },

  verify(reference: string) {
    return authenticatedRequest<PaymentVerification>(
      `/payments/verify/${encodeURIComponent(reference)}`
    );
  },
};
