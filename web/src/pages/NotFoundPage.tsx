import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section style={{ padding: "40px 20px", textAlign: "center" }}>
      <h2 style={{ marginBottom: 12 }}>Page not found</h2>
      <p style={{ marginBottom: 20 }}>The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="btn">
        Go Home
      </Link>
    </section>
  );
}
