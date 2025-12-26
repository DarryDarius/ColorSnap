import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addToCart, getUploadedPhoto } from "../lib/storage";
import { RECOMMENDED_PRODUCTS } from "../lib/recommendations";
import type { ProductCategory, RecommendedProduct } from "../lib/types";

type FilterValue = "all" | ProductCategory;

export function ResultPage() {
  const navigate = useNavigate();
  const uploadedPhoto = useMemo(() => getUploadedPhoto(), []);

  const [filter, setFilter] = useState<FilterValue>("all");

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
      } catch {
        // user canceled
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      alert(
        "Your browser does not support direct sharing. The share link has been copied to the clipboard.",
      );
    } catch {
      alert("Unable to copy share link, please copy manually.");
    }
  }

  function onAddToCart(product: RecommendedProduct) {
    addToCart({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
    });
    alert("Item added to cart!");
  }

  return (
    <>
      <section className="result-section">
        <h2>Analysis Result: Warm Autumn</h2>
        <p>This is the photo you uploaded:</p>
        <img
          id="resultPhoto"
          src={uploadedPhoto ?? ""}
          alt={uploadedPhoto ? "Uploaded Photo" : "No uploaded photo detected"}
          width={300}
        />
        <p>
          Your skin tone and facial features belong to the Warm Autumn type.
          Recommended colors include orange-brown, olive green, brick red, etc.
        </p>
        <div className="actions">
          <button onClick={() => navigate("/analysis")}>Upload Another Photo</button>
          <button onClick={() => navigate("/consultation")}>
            Book Expert Consultation
          </button>
          <button id="shareBtn" onClick={onShare}>
            Share My Color Palette
          </button>
        </div>
      </section>

      <section className="cosmetics-recommendation">
        <h2>Virtual Cosmetic Recommendations</h2>

        <div className="filter-bar">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
            type="button"
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === "lipstick" ? "active" : ""}`}
            onClick={() => setFilter("lipstick")}
            type="button"
          >
            Lipstick
          </button>
          <button
            className={`filter-btn ${filter === "blush" ? "active" : ""}`}
            onClick={() => setFilter("blush")}
            type="button"
          >
            Blush
          </button>
          <button
            className={`filter-btn ${filter === "eyeshadow" ? "active" : ""}`}
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
                className="add-to-cart-btn"
                type="button"
                onClick={() => onAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link to="/shoppingcart" className="btn">
            Go to Shopping Cart →
          </Link>
        </div>
      </section>
    </>
  );
}


