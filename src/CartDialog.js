import React from 'react';
import './CartDialog.css';

const CartDialog = ({ cartItems, onClose }) => {
  const totalPrice = cartItems.reduce((total, item) => total + parseFloat(item.price), 0);

  return (
    <div className="cart-dialog">
      <h2>Items Added to Cart</h2>
      <ul>
        {cartItems.map(item => (
          <li key={item.id}>
            {item.title} - Rs.{item.price}
          </li>
        ))}
      </ul>
      <p><b>Total Price:</b> Rs.{totalPrice.toFixed(2)}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CartDialog;
