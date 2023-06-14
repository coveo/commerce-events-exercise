import { useState, useEffect } from "react";
import "./Cart.css";
import { Link } from "react-router-dom";
import { CartItem, CartState, useCart } from "./useCart";

export function Cart() {
  const { subscribe, toggleCart } = useCart();
  const [cartState, setCartState] = useState<CartState>({
    items: [],
    isOpen: false,
  });

  useEffect(() => subscribe(setCartState), []);

  return (
    <div className="cart">
      <button id="cart-btn" onClick={toggleCart}>
        cart
      </button>
      {cartState.isOpen ? <CartList items={cartState.items} /> : null}
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
      <Link id="checkout-btn" to="/checkout">
        Checkout
      </Link>
    </div>
  );
}
