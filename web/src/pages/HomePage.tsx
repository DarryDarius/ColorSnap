import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <>
      <section className="hero hero--split">
        <div className="hero__inner site-container">
          <div className="hero__copy">
            <h1>Discover Your Signature Colors, Illuminate Your Style</h1>
            <p>
              Personal color analysis powered by AI and expert advice to help
              you shop makeup & outfits with confidence.
            </p>

            <div className="hero__actions">
              <Link to="/analysis" className="btn btn--primary">
                Start Analysis →
              </Link>
              <Link to="/result" className="btn btn--secondary">
                See an Example
              </Link>
            </div>

            <div className="badges hero__badges" aria-label="Trust highlights">
              <span className="badge">🔒 Privacy-first</span>
              <span className="badge">⚡ Fast results</span>
              <span className="badge">💬 Expert option</span>
            </div>
          </div>

          <div className="hero__preview" aria-hidden="true">
            <div className="gradient-shell">
              <div className="gradient-shell__inner hero-card">
                <div className="hero-card__top">
                  <img
                    className="hero-card__photo"
                    src="input/image1.webp"
                    alt=""
                  />
                  <div>
                    <div className="hero-card__title">Warm Autumn</div>
                    <div className="hero-card__subtitle">
                      Warm · Rich · Earthy
                    </div>
                  </div>
                </div>

                <div className="palette-mini" aria-hidden="true">
                  <span style={{ background: "#B4532A" }} />
                  <span style={{ background: "#D97706" }} />
                  <span style={{ background: "#C2410C" }} />
                  <span style={{ background: "#A16207" }} />
                  <span style={{ background: "#7C2D12" }} />
                  <span style={{ background: "#4D7C0F" }} />
                  <span style={{ background: "#B91C1C" }} />
                  <span style={{ background: "#F59E0B" }} />
                </div>

                <div className="hero-card__hint">
                  Upload a selfie → Get a palette → Shop smarter
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="introduction">
        <div className="intro-container">
          <div className="intro-text">
            <h2>About ColorSnap</h2>
            <p>
              ColorSnap uses advanced AI algorithms to generate personalized
              color palettes for you, supported by professional color
              consultants. Whether you're updating your wardrobe or choosing
              makeup, we help you find the perfect colors that suit you best.
            </p>
            <Link to="/about">Learn More</Link>
          </div>
          <div className="intro-image">
            <img src="images/hero-bg-custom.jpg" alt="Custom Hero Image" />
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <h3>Upload Photo</h3>
          <p>Upload a clear frontal photo to kickstart the AI color analysis.</p>
        </div>
        <div className="feature">
          <h3>Get Your Palette</h3>
          <p>Generate your personalized color palette in seconds.</p>
        </div>
        <div className="feature">
          <h3>Expert Guidance</h3>
          <p>
            Schedule one-on-one video consultations to receive professional
            advice.
          </p>
        </div>
      </section>

      <section className="cta-area">
        <h2>Ready to transform your color style?</h2>
        <Link to="/analysis" className="btn">
          Upload Photo to Begin →
        </Link>
      </section>
    </>
  );
}


