import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItem } from "../lib/types";
import { clearCart, getCart, setCart } from "../lib/storage";

export function ShoppingCartPage() {
  const navigate = useNavigate();

  const [cartItems, setCartItemsState] = useState<CartItem[]>([]);

  useEffect(() => {
    setCartItemsState(getCart());
  }, []);

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price, 0),
    [cartItems],
  );

  function onClearCart() {
    if (!confirm("Are you sure you want to clear the cart?")) return;
    clearCart();
    setCartItemsState([]);
  }

  function onCheckout() {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/payment");
  }

  function onRemoveItem(index: number) {
    const next = cartItems.filter((_, i) => i !== index);
    setCart(next);
    setCartItemsState(next);
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Your Shopping Cart</h1>

        <div className="cart-items" id="cartContainer">
          {cartItems.length === 0 ? (
            <p className="empty-message">Your cart is empty.</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={`${item.name}-${index}`} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
                <div className="item-price">${item.price.toFixed(2)}</div>
                <button
                  className="remove-btn"
                  type="button"
                  onClick={() => onRemoveItem(index)}
                  aria-label={`Remove ${item.name}`}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        <div className="total-section" id="totalAmount">
          Total: ${total.toFixed(2)}
        </div>

        <div className="actions">
          <button id="checkoutBtn" type="button" onClick={onCheckout}>
            Checkout
          </button>
          <button id="clearCartBtn" type="button" onClick={onClearCart}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}


