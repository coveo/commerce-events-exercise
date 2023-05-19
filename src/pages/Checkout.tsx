import { useState, useEffect } from "react";
import { CartItem, useCart } from "../Components/useCart";
import { Link } from "react-router-dom";

export function Checkout() {
  const [items, setItems] = useState<CartItem[]>([]);
  const { subscribe } = useCart();

  useEffect(() => subscribe(setItems), []);

  return (
    <div>
      <h1>Checkout</h1>
      {items.map((item) => (
        <div key={item.product.uniqueId}>
          {item.product.title} {item.quantity}
        </div>
      ))}
      <button className="pay-btn">Pay</button>
      <Link className="home-btn" to='/home'><button>Home</button></Link>
    </div>
  );
}
