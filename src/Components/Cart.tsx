import { useState } from "react";
import './Cart.css'
import { Link } from "react-router-dom";

export function Cart() {
  const [showCart, setShowCart] = useState(false);
  const toggleCart = () => setShowCart(!showCart);

  return (
    <div className="cart">
      <button onClick={toggleCart}>cart</button>
      {showCart ? <CartList/> : null}
    </div>
  );
}

function CartList() {
  return <div className="cart-list">
    <div>My cart</div>
    <Link to='/checkout'>Checkout</Link>
  </div>
}
