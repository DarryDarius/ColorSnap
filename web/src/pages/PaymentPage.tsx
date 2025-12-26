import type { FormEvent } from "react";

export function PaymentPage() {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("Payment processing...");
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
            />
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
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiry">Expiration Date</label>
              <input type="month" id="expiry" name="expiry" required />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="number"
                id="cvv"
                name="cvv"
                placeholder="123"
                required
              />
            </div>
          </div>
          <button type="submit">Pay Now</button>
        </form>
      </div>
    </div>
  );
}


