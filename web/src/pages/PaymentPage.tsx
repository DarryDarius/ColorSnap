import type { FormEvent } from "react";
import { useState } from "react";
import { useToast } from "../components/ToastProvider";

export function PaymentPage() {
  const { pushToast } = useToast();

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    cardName?: string;
    cardNumber?: string;
    expiry?: string;
    cvv?: string;
  }>({});

  function formatCardNumber(input: string) {
    const digits = input.replace(/\D/g, "").slice(0, 19);
    // group by 4, but keep flexible length (demo)
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function validate() {
    const next: typeof errors = {};

    if (!cardName.trim()) next.cardName = "Please enter the cardholder name.";

    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length < 12) next.cardNumber = "Card number looks too short.";

    if (!expiry) next.expiry = "Please select an expiration date.";

    if (cvv.length < 3) next.cvv = "CVV must be 3–4 digits.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    if (!validate()) {
      pushToast({
        title: "Check your details",
        message: "Please fix the highlighted fields.",
        variant: "error",
      });
      return;
    }

    setSubmitting(true);
    pushToast({
      title: "Demo payment",
      message: "Processing… (this is a demo flow)",
      variant: "info",
    });

    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    pushToast({
      title: "Success",
      message: "Payment submitted (demo).",
      variant: "success",
    });
  }

  return (
    <div className="payment-page">
      <div className="container">
        <h1>Payment Information</h1>
        <form id="paymentForm" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="cardName">Cardholder Name</label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              placeholder="Enter your name"
              required
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              aria-invalid={errors.cardName ? "true" : "false"}
            />
            {errors.cardName ? <div className="form-error">{errors.cardName}</div> : null}
          </div>
          <div className="form-group">
            <label htmlFor="cardNumber">Credit Card Number</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="XXXX XXXX XXXX XXXX"
              maxLength={19}
              required
              inputMode="numeric"
              autoComplete="cc-number"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              aria-invalid={errors.cardNumber ? "true" : "false"}
            />
            {errors.cardNumber ? <div className="form-error">{errors.cardNumber}</div> : null}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiry">Expiration Date</label>
              <input
                type="month"
                id="expiry"
                name="expiry"
                required
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                aria-invalid={errors.expiry ? "true" : "false"}
              />
              {errors.expiry ? <div className="form-error">{errors.expiry}</div> : null}
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="password"
                id="cvv"
                name="cvv"
                placeholder="123"
                required
                inputMode="numeric"
                autoComplete="cc-csc"
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                aria-invalid={errors.cvv ? "true" : "false"}
              />
              {errors.cvv ? <div className="form-error">{errors.cvv}</div> : null}
            </div>
          </div>
          <button type="submit" disabled={submitting}>
            {submitting ? "Processing…" : "Pay Now"}
          </button>

          <div className="payment-note">
            This is a demo checkout UI. Do not enter real card details.
          </div>
        </form>
      </div>
    </div>
  );
}
