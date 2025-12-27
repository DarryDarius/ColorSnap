import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "../components/ToastProvider";

function getQueryParam(search: string, param: string): string | null {
  const urlParams = new URLSearchParams(search);
  return urlParams.get(param);
}

export function BookingPage() {
  const location = useLocation();
  const { pushToast } = useToast();

  const expertParam = useMemo(
    () => getQueryParam(location.search, "expert"),
    [location.search],
  );

  const experts = useMemo(
    () => [
      { id: "ex1", name: "Yuna Lee", title: "Busan, South Korea" },
      { id: "ex2", name: "Jisoo Park", title: "Seoul, South Korea" },
      { id: "ex3", name: "Soojin Kwon", title: "Incheon, South Korea" },
      { id: "ex4", name: "Ha-eun Lim", title: "Daejeon, South Korea" },
      { id: "ex5", name: "Nia Brooks", title: "Seoul, South Korea" },
      { id: "ex6", name: "Elizabeth Lee", title: "Seoul, South Korea" },
      { id: "ex7", name: "Eunji Han", title: "Seoul, South Korea" },
      { id: "ex8", name: "Ara Jeong", title: "Gwangju, South Korea" },
      { id: "ex9", name: "Audrey Chen", title: "Shenzhen, China" },
      { id: "ex10", name: "Talia Kim", title: "Seoul, South Korea" },
      { id: "ex11", name: "Olivia Bennett", title: "San Francisco, USA" },
    ],
    [],
  );

  const selectedExpert = useMemo(() => {
    if (!expertParam) return null;
    return experts.find((e) => e.id === expertParam) ?? null;
  }, [expertParam, experts]);

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
    pushToast({
      title: "Request submitted",
      message: "We’ll contact you soon to confirm the appointment.",
      variant: "success",
    });
    setName("");
    setContact("");
    setTime("");
    setRemarks("");
  }

  return (
    <section className="booking-hero">
      <div className="hero-content">
        <h2>Schedule a Consultation</h2>
        <p>Personalized advice based on your color palette results.</p>

        {selectedExpert ? (
          <div className="booking-expert card card--solid">
            <img
              className="booking-expert__photo"
              src={`images/${selectedExpert.id}.jpg`}
              alt={selectedExpert.name}
            />
            <div>
              <div className="booking-expert__name">{selectedExpert.name}</div>
              <div className="booking-expert__meta">{selectedExpert.title}</div>
            </div>
          </div>
        ) : null}

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
            <button type="submit" className="btn btn--primary">
              Submit Request
            </button>
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


