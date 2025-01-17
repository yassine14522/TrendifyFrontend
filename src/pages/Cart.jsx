import React, { useContext } from "react";
import { CartContext } from "../features/cart/CartContext";
import { getCartTotal, getCartItemCount } from "../features/cart/cartUtils";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
import Cookies from 'js-cookie'; 
import "../styles/pages/cart.css";

const Cart = () => {
  const { state, dispatch } = useContext(CartContext);
  const total = getCartTotal(state.cart);
  const itemCount = getCartItemCount(state.cart);
  const navigate = useNavigate();

  const isAuthenticated = () => {
    const token = Cookies.get('token'); 
    if (!token) return false;
  
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        Cookies.remove('token'); 
        return false;
      }
      return true;
    } catch (error) {
      console.error("Invalid token:", error);
      Cookies.remove('token'); 
      return false;
    }
  };

  // Update handleRemove and handleUpdateQuantity to use _id instead of id_
  const handleRemove = (_id) => {
    dispatch({ type: "REMOVE_ITEM", payload: { _id } });
  };

  const handleUpdateQuantity = (_id, quantity) => {
    if (quantity > 0) {
      dispatch({ type: "UPDATE_ITEM_QUANTITY", payload: { _id, quantity } });
    }
  };

  const handleCheckout = () => {
    console.log("Checking authentication...");
    if (!isAuthenticated()) {
      alert("Your session has expired or you are not logged in. Please log in.");
      navigate("/login");
    } else {
      console.log("User is authenticated, navigating to checkout...");
      navigate("/checkout");
    }
  };

  return (
    <div className="cart-page-container">
      {/* Left section: Cart Items */}
      <div className="cart-items-container">
        <h2 className="cart-title">Your Cart</h2>
        {state.cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is currently empty.</p>
            <div className="cart-img-wrapper">
              <img src="assets/cart.png" alt="Empty Cart" />
            </div>
            <button className="button-route" onClick={() => window.location.href = "/Products"}>Let's Shop</button>
          </div>
        ) : (
          <div className="cart-items">
            {state.cart.map((item) => (
              <div className="cart-item" key={item._id}> {/* Use _id for key */}
                <img src={item.img} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">MAD {item.price.toFixed(2)}</p>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}>+</button>
                </div>
                <button
                  className="cart-item-remove-btn"
                  onClick={() => handleRemove(item._id)} // Use _id here as well
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right section: Checkout Summary */}
      {state.cart.length > 0 && (
        <div className="checkout-container">
          <h3>Checkout Summary</h3>
          <div className="cart-summary">
            <p className="cart-summary-text">Total items: {itemCount}</p>
            <p className="cart-summary-text">Total price: MAD {total.toFixed(2)}</p>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>

          {/* Pay With Section */}
          <div className="pay-with">
            <h4>Pay With:</h4>
            <div className="payment-icons">
              <img src="/assets/masterCard.png" alt="MasterCard" />
              <img src="/assets/visa.png" alt="Visa" />
              <img src="/assets/paypal.png" alt="PayPal" />
            </div>
            <h3>Buyer Protection</h3>
            <p>Get a full refund if the item is not as described or not delivered</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
