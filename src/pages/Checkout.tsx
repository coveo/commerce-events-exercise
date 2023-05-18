import { useState, useEffect } from "react";
import { CartItem, useCart } from "../Components/useCart";

export function Checkout() {
  const [items, setItems] = useState<CartItem[]>([]);
  const { subscribe } = useCart();

  useEffect(() => subscribe(setItems));

  return (
    <div>
      <h1>Checkout</h1>
      {items.map((item) => (
        <div key={item.product.uniqueId}>
          {item.product.title} {item.quantity}
        </div>
      ))}
      <button>Pay</button>
    </div>
  );
}
