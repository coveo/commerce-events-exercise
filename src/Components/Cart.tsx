import { useState, useEffect } from "react";
import "./Cart.css";
import { Link } from "react-router-dom";
import { CartItem, useCart } from "./useCart";

export function Cart() {
  const { subscribe } = useCart();
  const [items, setItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const toggleCart = () => setShowCart(!showCart);

  useEffect(() => subscribe(setItems), []);

  return (
    <div className="cart">
      <button id="cart-btn" onClick={toggleCart}>cart</button>
      {showCart ? <CartList items={items} /> : null}
    </div>
  );
}

interface CartListProps {
  items: CartItem[];
}

function CartList(props: CartListProps) {
  const { items } = props;

  return (
    <div className="cart-list">
      <h4 className="cart-title">My cart</h4>
      {items.map((item) => (
        <div key={item.product.uniqueId}>
          {item.product.title} {item.quantity}
        </div>
      ))}
      <Link id="checkout-btn" to="/checkout">Checkout</Link>
    </div>
  );
}
