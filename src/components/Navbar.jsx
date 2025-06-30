import React, { useContext, useState } from "react";
import AppContext from "../Context/Context";
import { FaSearch, FaShoppingCart, FaMapMarkerAlt } from "react-icons/fa";
import axios from "../axios"; // or just 'axios' if you use the default import
import { useNavigate } from "react-router-dom";

const Navbar = ({ search, setSearch, searchResults, setSearchResults, cart }) => {
  const { fetchProductsByChildMenu, setSelectedProducts, menu } = useContext(AppContext);
  const [openIndex, setOpenIndex] = useState(null);
  const [openSubIndex, setOpenSubIndex] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() !== "") {
      const response = await axios.get(
        `http://localhost:8080/product/searchByPrefix?nameSuffix=${encodeURIComponent(value)}`
      );
      setSearchResults(response.data);
      navigate("/"); // <-- Add this line to always show Home page on search
    } else {
      setSearchResults([]);
    }
  };

  const handleChildMenuClick = async (childMenuName) => {
    setSearch("");            // Clear the search bar
    setSearchResults([]);     // Clear the search results
    const products = await fetchProductsByChildMenu(childMenuName);
    setSelectedProducts(products); // This should update the products shown in Home.jsx
    navigate("/"); // <-- This will switch the route to home/products page
  };

  return (
    <header>
      <nav
        style={{
          background: "#fff",
          padding: "16px 24px 0 24px",
          borderBottom: "1px solid #eee",
        }}
      >
        {/* Logo and right icons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <div>
            <span
              style={{
                color: "red", // JM in red
                fontWeight: "bold",
                fontSize: "2.5rem",
                letterSpacing: "2px",
              }}
            >
              JM
            </span>
            <span
              style={{
                color: "#007b5e", // Frills in green (change to any color you like)
                fontWeight: "bold",
                fontSize: "2.5rem",
                letterSpacing: "2px",
              }}
            >
              Frills
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              style={{
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "6px",
                padding: "6px 8px",
                cursor: "pointer",
              }}
            >
              <FaMapMarkerAlt size={18} color="#222" />
            </button>
            <button
              style={{
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "6px",
                padding: "6px 8px",
                cursor: "pointer",
                position: "relative"
              }}
              onClick={() => navigate("/cart")}
            >
              <FaShoppingCart size={18} color="#222" />
              <span style={{
                background: "#009688",
                color: "#fff",
                borderRadius: "50%",
                padding: "2px 8px",
                fontSize: "0.9rem",
                marginLeft: "4px"
              }}>
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </button>
            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>$0.00</span>
          </div>
        </div>
        {/* Search Bar */}
        <div style={{ width: "100vw", position: "relative", left: "50%", right: "50%", transform: "translateX(-50%)", marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#fff",
              borderRadius: "8px",
              padding: "8px 16px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              width: "100%",         // Make it full width
              maxWidth: "none",      // Remove max width
              margin: 0
            }}
          >
            <FaSearch style={{ marginRight: "8px", color: "#888" }} />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={handleSearch}
              style={{
                border: "none",
                outline: "none",
                fontSize: "1.1rem",
                width: "100%",
                background: "transparent",
              }}
            />
          </div>
        </div>
        {/* Navbar Menu */}
        <div style={{
          display: "flex",
          gap: "32px",
          background: "#fff",
          padding: "12px 0 12px 0",
          borderBottom: "1px solid #eee",
          fontSize: "1rem",
          fontWeight: 500,
          marginBottom: "8px"
        }}>
          {menu.map((item, idx) => (
            <div key={item.label + '-' + idx}>
              <div
                style={{ position: "relative" }}
                onMouseEnter={() => setOpenIndex(idx)}
              >
                <span style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                  {item.label}
                  {item.children && item.children.length > 0 && <span>▼</span>}
                </span>
                {/* First-level Dropdown */}
                {openIndex === idx && item.children && item.children.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      background: "#fff",
                      border: "1px solid #eee",
                      borderRadius: "6px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      minWidth: "180px",
                      zIndex: 1000,
                    }}
                    onMouseLeave={() => { setOpenIndex(null); setOpenSubIndex(null); }} // <-- KEEP THIS HERE
                  >
                    {item.children.map((child, cidx) => (
                      <div key={child.label + '-' + idx + '-' + cidx}>
                        <div
                          style={{
                            padding: "10px 18px",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            borderBottom: "1px solid #f0f0f0",
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                          onMouseEnter={() => setOpenSubIndex(cidx)}
                        >
                          {child.label}
                          {child.children && child.children.length > 0 && <span style={{ marginLeft: 8 }}>▶</span>}
                          {/* Second-level Dropdown */}
                          {openSubIndex === cidx && child.children && child.children.length > 0 && (
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: "100%",
                                marginLeft: "-10px", // or more, to overlap
                                background: "#fff",
                                border: "1px solid #eee",
                                borderRadius: "6px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                minWidth: "180px",
                                zIndex: 1001,
                              }}
                            >
                              {child.children.map((subChild, scidx) => (
                                <div
                                  key={subChild.key || scidx}
                                  style={{
                                    padding: "10px 18px",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    borderBottom: "1px solid #f0f0f0"
                                  }}
                                  onClick={() => handleChildMenuClick(subChild.label)}
                                >
                                  {subChild.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;