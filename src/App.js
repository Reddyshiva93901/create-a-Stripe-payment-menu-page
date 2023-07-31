import React, { useState } from "react";
import "./App.css";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("YOUR_STRIPE_PUBLISHABLE_KEY");

const products = [
  {
    id: "product_1",
    name: "Product 1",
    price: 9.99,
  },
  {
    id: "product_2",
    name: "Product 2",
    price: 19.99,
  },
  {
    id: "product_3",
    name: "Product 3",
    price: 29.99,
  },
];

const App = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductSelection = (product) => {
    setSelectedProduct(product);
  };

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    // Replace with your server endpoint for creating a checkout session
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId: selectedProduct.id }),
    });
    const session = await response.json();
    await stripe.redirectToCheckout({
      sessionId: session.id,
    });
  };

  return (
    <div className="App">
      <h1>Stripe Payment Menu</h1>
      <div className="ProductList">
        {products.map((product) => (
          <div
            key={product.id}
            className={`Product ${selectedProduct === product ? "Selected" : ""}`}
            onClick={() => handleProductSelection(product)}
          >
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <button onClick={handleCheckout}>Checkout ${selectedProduct.price.toFixed(2)}</button>
      )}
    </div>
  );
};

export default App;
