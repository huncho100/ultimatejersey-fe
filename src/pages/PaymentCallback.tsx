import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import { paymentService } from "../services/paymentService";

type VerificationState = "loading" | "success" | "failed";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const reference =
    searchParams.get("reference") ??
    searchParams.get("trxref");
  const [state, setState] =
    useState<VerificationState>("loading");
  const [message, setMessage] = useState(
    "Verifying your payment..."
  );

  useEffect(() => {
    if (!reference) {
      setState("failed");
      setMessage("The payment reference is missing.");
      return;
    }

    paymentService
      .verify(reference)
      .then((payment) => {
        const successful = payment.status === "success";
        setState(successful ? "success" : "failed");
        setMessage(
          successful
            ? "Your payment was successful."
            : `Payment status: ${payment.status}.`
        );
      })
      .catch((error: unknown) => {
        setState("failed");
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to verify your payment."
        );
      });
  }, [reference]);

  return (
    <section className="min-h-screen bg-slate-50 py-20">
      <Container>
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            {state === "loading"
              ? "Payment verification"
              : state === "success"
                ? "Payment complete"
                : "Payment not completed"}
          </h1>
          <p className="mt-4 text-slate-600">{message}</p>
          {state !== "loading" && (
            <div className="mt-8">
              <Link to="/products">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
