import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastProvider";
import { renderShareCard } from "../lib/shareCard";
import { addToCart, getUploadedPhoto } from "../lib/storage";
import { RECOMMENDED_PRODUCTS } from "../lib/recommendations";
import type { ProductCategory, RecommendedProduct } from "../lib/types";

type FilterValue = "all" | ProductCategory;

type PaletteColor = { name: string; hex: string };

export function ResultPage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const uploadedPhoto = useMemo(() => getUploadedPhoto(), []);

  const [filter, setFilter] = useState<FilterValue>("all");

  const palette = useMemo<PaletteColor[]>(
    () => [
      { name: "Burnt Orange", hex: "#B4532A" },
      { name: "Terracotta", hex: "#D97706" },
      { name: "Rust", hex: "#C2410C" },
      { name: "Mustard", hex: "#A16207" },
      { name: "Olive", hex: "#4D7C0F" },
      { name: "Moss", hex: "#3F6212" },
      { name: "Brick Red", hex: "#B91C1C" },
      { name: "Warm Rose", hex: "#E11D48" },
      { name: "Camel", hex: "#C8A26A" },
      { name: "Chocolate", hex: "#5A2E1A" },
      { name: "Deep Teal", hex: "#0F766E" },
      { name: "Cream", hex: "#F5E6C8" },
    ],
    [],
  );

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      pushToast({ title: "Copied", message: text, variant: "success" });
    } catch {
      pushToast({
        title: "Copy failed",
        message: "Your browser blocked clipboard access.",
        variant: "error",
      });
    }
  }

  const filteredProducts = useMemo(() => {
    if (filter === "all") return RECOMMENDED_PRODUCTS;
    return RECOMMENDED_PRODUCTS.filter((p) => p.category === filter);
  }, [filter]);

  async function onShare() {
    const title = "My Color Palette Result";
    const text = "This is my color palette result, come check it out!";

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: window.location.href });
        pushToast({ title: "Shared", message: "Thanks for sharing!", variant: "success" });
      } catch {
        // user canceled
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      pushToast({
        title: "Link copied",
        message: "Your browser doesn’t support sharing. We copied the link.",
        variant: "info",
      });
    } catch {
      pushToast({
        title: "Copy failed",
        message: "Unable to copy the link. Please copy it manually.",
        variant: "error",
      });
    }
  }

  async function onDownloadShareCard() {
    try {
      pushToast({ title: "Generating", message: "Preparing your share card…", variant: "info" });
      const blob = await renderShareCard({
        title: "Warm Autumn",
        subtitle: "Warm undertone · medium contrast · earthy palette",
        photoDataUrl: uploadedPhoto,
        palette: palette.map((c) => ({ hex: c.hex })),
      });

      const file = new File([blob], "colorsnap-result.png", {
        type: "image/png",
      });

      // Try native share (if supported)
      if (navigator.canShare?.({ files: [file] }) && navigator.share) {
        try {
          await navigator.share({
            title: "My ColorSnap Result",
            text: "Here’s my personalized palette.",
            files: [file],
          });
          pushToast({ title: "Shared", message: "Share card sent.", variant: "success" });
          return;
        } catch {
          // fall back to download
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "colorsnap-result.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      pushToast({ title: "Downloaded", message: "Share card saved as PNG.", variant: "success" });
    } catch {
      pushToast({
        title: "Failed",
        message: "Could not generate share card. Please try again.",
        variant: "error",
      });
    }
  }

  function onAddToCart(product: RecommendedProduct) {
    addToCart({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
    });
    pushToast({ title: "Added to cart", message: product.name, variant: "success" });
  }

  return (
    <div className="page">
      <div className="site-container">
        <div className="gradient-shell">
          <div className="gradient-shell__inner result-card">
            <div className="result-card__grid">
              <div className="result-card__left">
                <div className="kicker">Your season</div>
                <h2 className="result-title">Warm Autumn</h2>
                <p className="result-subtitle">
                  Warm undertone + earthy saturation. Best colors are warm,
                  grounded, and slightly muted.
                </p>

                <div className="result-facts">
                  <div className="fact">🔥 Warm undertone</div>
                  <div className="fact">🌿 Earthy saturation</div>
                  <div className="fact">⚖️ Medium contrast</div>
                </div>

                <div className="result-actions">
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => navigate("/analysis")}
                  >
                    Upload another
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={onShare}
                  >
                    Share link
                  </button>
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={onDownloadShareCard}
                  >
                    Download share card
                  </button>
                </div>
              </div>

              <div className="result-card__right">
                {uploadedPhoto ? (
                  <img
                    className="result-photo"
                    src={uploadedPhoto}
                    alt="Uploaded Photo"
                  />
                ) : (
                  <div className="result-photo result-photo--empty">
                    No uploaded photo detected
                  </div>
                )}

                <div className="palette-header">
                  <div className="palette-title">Your palette</div>
                  <button
                    type="button"
                    className="btn btn--ghost btn--small"
                    onClick={() => copyText(palette.map((c) => c.hex).join(", "))}
                  >
                    Copy all
                  </button>
                </div>

                <div className="palette-grid" role="list">
                  {palette.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      className="swatch"
                      style={{ background: c.hex }}
                      onClick={() => copyText(c.hex)}
                      title={`${c.name} (${c.hex})`}
                      role="listitem"
                    >
                      <span className="swatch__label">{c.hex}</span>
                    </button>
                  ))}
                </div>
                <div className="palette-hint">
                  Tap a color to copy its hex code.
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="result-guidance card card--solid">
          <h3 className="section-title">How to use your palette</h3>
          <div className="guidance-grid">
            <div className="guidance-card">
              <div className="guidance-card__title">Makeup</div>
              <div className="guidance-card__text">
                Pick warm lipsticks (terracotta, brick) and peachy blushes. Avoid
                icy pinks.
              </div>
            </div>
            <div className="guidance-card">
              <div className="guidance-card__title">Clothing</div>
              <div className="guidance-card__text">
                Choose camel, olive, warm brown. Prefer softer contrast over
                stark black/white.
              </div>
            </div>
            <div className="guidance-card">
              <div className="guidance-card__title">Accessories</div>
              <div className="guidance-card__text">
                Gold + warm metals complement you better than cool silver.
              </div>
            </div>
          </div>

          <div className="result-next">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => navigate("/consultation")}
            >
              Book an expert to confirm →
            </button>
          </div>
        </section>

        <section className="cosmetics-recommendation">
          <h2>Virtual Cosmetic Recommendations</h2>

          <div className="chips" aria-label="Product category filter">
            <button
              className={`chip ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
              type="button"
            >
              All
            </button>
            <button
              className={`chip ${filter === "lipstick" ? "active" : ""}`}
              onClick={() => setFilter("lipstick")}
              type="button"
            >
              Lipstick
            </button>
            <button
              className={`chip ${filter === "blush" ? "active" : ""}`}
              onClick={() => setFilter("blush")}
              type="button"
            >
              Blush
            </button>
            <button
              className={`chip ${filter === "eyeshadow" ? "active" : ""}`}
              onClick={() => setFilter("eyeshadow")}
              type="button"
            >
              Eyeshadow
            </button>
          </div>

          <div className="cosmetics-grid">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                data-category={product.category}
              >
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>
                  <strong>
                    {product.category === "eyeshadow" ? "Shades:" : "Shade:"}
                  </strong>{" "}
                  {product.shadeOrShades}
                </p>
                <p>
                  <strong>Suitable for:</strong> {product.suitableFor}
                </p>
                <p>
                  <strong>Price:</strong> ${product.price.toFixed(2)}
                </p>
                <p>{product.description}</p>
                <button
                  className="btn btn--primary btn--small add-to-cart-btn"
                  type="button"
                  onClick={() => onAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="sticky-cta" role="region" aria-label="Quick actions">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => navigate("/shoppingcart")}
        >
          Go to cart
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => navigate("/consultation")}
        >
          Book expert
        </button>
      </div>
    </div>
  );
}


