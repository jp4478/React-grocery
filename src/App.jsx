import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import CartPage from "./components/CartPage"; // Create this component
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./Context/Context";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "./components/Footer";


function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    console.log("Selected category:", category);
  };
  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.code === product.code);
      if (existing) {
        // Update quantity if product already in cart
        return prevCart.map((item) =>
          item.code === product.code
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new product to cart
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar search={search} setSearch={setSearch} setSearchResults={setSearchResults} cart={cart} />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                addToCart={addToCart}
                selectedCategory={selectedCategory}
                search={search}
                searchResults={searchResults}
              />
            }
          />
          <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes> 
        <Footer />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
