import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

function getQueryParam(search: string, param: string): string | null {
  const urlParams = new URLSearchParams(search);
  return urlParams.get(param);
}

export function BookingPage() {
  const location = useLocation();

  const expertParam = useMemo(
    () => getQueryParam(location.search, "expert"),
    [location.search],
  );

  const bookingImage = expertParam
    ? `images/${expertParam}.jpg`
    : "images/booking1.jpg";

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [time, setTime] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setName("");
    setContact("");
    setTime("");
    setRemarks("");
  }

  return (
    <section className="booking-hero">
      <div className="hero-content">
        <h2>Schedule a Consultation</h2>
        <p>Personalized advice based on your color palette results!</p>

        <div className="booking-form-card">
          <form className="booking-form" onSubmit={onSubmit}>
            <div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="contact">Contact Info (Email):</label>
              <input
                type="email"
                id="contact"
                name="contact"
                required
                placeholder="Enter your email or WeChat ID"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="time">Preferred Consultation Time:</label>
              <input
                type="datetime-local"
                id="time"
                name="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="remarks">Remarks:</label>
              <textarea
                id="remarks"
                name="remarks"
                placeholder="Any additional information..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
            <button type="submit">Submit Request</button>
          </form>
          <div
            className="success-message"
            id="successMessage"
            style={{ display: submitted ? "block" : "none" }}
          >
            <i>✅</i> Thank you for your request! Our consultant will contact
            you soon to confirm the appointment.
          </div>
        </div>
      </div>

      <div className="hero-image">
        <img id="bookingImage" src={bookingImage} alt="Booking Decoration" />
      </div>
    </section>
  );
}


