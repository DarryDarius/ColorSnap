import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <>
      <section className="our-story">
        <h2>What is ColorSnap?</h2>
        <p>
          ColorSnap is a virtual platform that helps you discover the colors
          that truly suit you—whether you’re picking out lipstick, choosing a
          jacket, or just trying to understand your undertone. We combine
          AI-powered color analysis with optional expert consultations, so
          anyone, anywhere, can access personalized color insights without
          needing to travel or guess in front of a mirror. You upload a photo.
          We analyze your tones. You get a custom palette, styling tips, and
          even product suggestions that actually match your vibe. Our mission is
          simple: Make personal color analysis more accessible, more empowering,
          and more fun.
        </p>
        <div className="story-image">
          <img
            src="images/consultantpagedecoration.jpg"
            alt="ColorSnap Illustration"
          />
        </div>

        <h2>Meet the Founders</h2>
        <p>
          Helen and Tina met over a shared love of skincare, style, and
          color-coded Pinterest boards. One of them kept buying the wrong
          lipstick shade. The other once wore a neon green blazer that made her
          coworkers ask if she was feeling sick. They both agreed: color should
          be empowering—not confusing. So they teamed up to build something they
          couldn’t find anywhere else—a platform that feels like a mix of a
          digital stylist, a best friend who tells the truth, and a shortcut to
          better shopping decisions. Their goal? To help people feel a little
          more confident every time they look in the mirror.
        </p>
      </section>

      <section className="our-belief">
        <h2>Our Belief</h2>
        <div className="belief-cards">
          <div className="belief-card">
            <h3>🎨 Self-Awareness</h3>
            <p>
              Understanding your unique color profile is the first step towards
              a personalized style.
            </p>
          </div>
          <div className="belief-card">
            <h3>💬 Empathy</h3>
            <p>
              We listen to your needs and tailor our advice to help you feel
              your best.
            </p>
          </div>
          <div className="belief-card">
            <h3>🔍 Simplicity</h3>
            <p>Our goal is to make color analysis accessible for everyone.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Start your color journey</h2>
        <Link to="/analysis" className="btn">
          Get Started
        </Link>
      </section>
    </>
  );
}


