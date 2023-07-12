import { useState, useEffect } from "react";
import { CartItem, useCart } from "../Components/useCart";
import { Link } from "react-router-dom";
import "./Checkout.css";
import { useCoveoAnalytics } from "../scenario/useCoveoAnalytics";

export function Checkout() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [paid, setPaid] = useState(false);
  const { subscribe } = useCart();
  const { coveoua } = useCoveoAnalytics();

  useEffect(() => {
    setTimeout(logPageView);
    subscribe((state) => setItems(state.items));
  }, []);

  function logPageView() {}

  function pay() {
    setPaid(true);
    logPurchase();
  }

  function logPurchase() {}

  return (
    <div>
      <h1>Checkout</h1>
      {items.map((item) => (
        <div key={item.product.uniqueId}>
          {item.product.title} {item.quantity}
        </div>
      ))}
      <button className="pay-btn" onClick={pay}>
        Pay
      </button>
      <Link className="home-btn" to="/search">
        <button>Home</button>
      </Link>
      {paid && (
        <div className="thank-you-message">Thank you for your purchase</div>
      )}
    </div>
  );
}
