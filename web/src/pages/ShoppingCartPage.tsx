import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../components/ToastProvider";
import type { CartItem } from "../lib/types";
import { clearCart, getCart, setCart } from "../lib/storage";

export function ShoppingCartPage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const [cartItems, setCartItemsState] = useState<CartItem[]>([]);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  useEffect(() => {
    setCartItemsState(getCart());
  }, []);

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price, 0),
    [cartItems],
  );

  function onClearCart() {
    setConfirmClearOpen(true);
  }

  function onCheckout() {
    if (cartItems.length === 0) {
      pushToast({
        title: "Cart is empty",
        message: "Add an item from your recommendations first.",
        variant: "info",
      });
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
            <div className="empty-message">
              <p style={{ marginBottom: 14 }}>Your cart is empty.</p>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => navigate("/result")}
              >
                Browse recommendations →
              </button>
            </div>
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
          <button
            id="checkoutBtn"
            type="button"
            className="btn btn--primary"
            onClick={onCheckout}
          >
            Checkout
          </button>
          <button
            id="clearCartBtn"
            type="button"
            className="btn btn--secondary"
            onClick={onClearCart}
          >
            Clear Cart
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmClearOpen}
        title="Clear cart?"
        description="This will remove all items from your cart."
        cancelText="Cancel"
        confirmText="Clear"
        destructive
        onCancel={() => setConfirmClearOpen(false)}
        onConfirm={() => {
          clearCart();
          setCartItemsState([]);
          setConfirmClearOpen(false);
          pushToast({
            title: "Cleared",
            message: "Your cart has been cleared.",
            variant: "success",
          });
        }}
      />
    </div>
  );
}


