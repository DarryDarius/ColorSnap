import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <>
      <section className="hero">
        <h1>Discover Your Signature Colors, Illuminate Your Style</h1>
        <p>
          Personal color analysis powered by AI and expert advice to boost your
          confidence.
        </p>
        <Link to="/analysis" className="btn">
          Start Analysis →
        </Link>
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


