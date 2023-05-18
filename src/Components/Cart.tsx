import { useState } from "react";
import './Cart.css'
import { Link } from "react-router-dom";
import { CartItem, useCart } from "./useCart";

export function Cart() {
  const {items} = useCart()
  const [showCart, setShowCart] = useState(false);
  const toggleCart = () => setShowCart(!showCart);

  return (
    <div className="cart">
      <button onClick={toggleCart}>cart</button>
      {showCart ? <CartList items={items}/> : null}
    </div>
  );
}

interface CartListProps {
  items: CartItem[];
}

function CartList(props: CartListProps) {
  const {items} = props

  return <div className="cart-list">
    <div>My cart</div>
    {items.map(item => <div>{item.product.title} {item.quantity}</div>)}
    <Link to='/checkout'>Checkout</Link>
  </div>
}
