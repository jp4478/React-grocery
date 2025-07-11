import React, { useContext, useState } from "react";
import AppContext from "../Context/Context";
import { FaSearch, FaShoppingCart, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DropdownMenu = ({ items, level = 0 }) => (
  <ul className={`dropdown-menu level-${level}`}>
    {items.map((item) => (
      <li key={item.key} className="dropdown-item">
        <span>{item.label}</span>
        {item.children && item.children.length > 0 && (
          <DropdownMenu items={item.children} level={level + 1} />
        )}
      </li>
    ))}
  </ul>
);

const SubMenuPanel = ({ items, onChildHover, activeChildIdx, level = 1 }) => {
  if (!items) return null;
  return (
    <div className={`submenu-panel level-${level}`}>
      <ul>
        {items.map((item, idx) => (
          <li
            key={item.key}
            className={`submenu-item${activeChildIdx === idx ? " active" : ""}`}
            onMouseEnter={() => onChildHover(idx)}
            onMouseLeave={() => onChildHover(null)}
          >
            <span>{item.label}</span>
            {item.children && <span style={{ float: "right" }}>▶</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

const SubMenuContent = ({ items, activeIdx, level = 1 }) => {
  if (!items || activeIdx == null || !items[activeIdx] || !items[activeIdx].children) return null;
  return (
    <div className={`submenu-content level-${level}`}>
      <div style={{ fontWeight: 700, marginBottom: 12 }}>
        See All {items[activeIdx].label}
      </div>
      <ul>
        {items[activeIdx].children.map((child) => (
          <li key={child.key} className="submenu-content-item">
            {child.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Navbar = ({ search, setSearch, searchResults, setSearchResults, cart }) => {
  const { fetchProductsByChildMenu, setSelectedProducts, menu } = useContext(AppContext);
  const [activeIdx, setActiveIdx] = useState(null);
  const [activeSubIdx, setActiveSubIdx] = useState(null);
  const navigate = useNavigate();


  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() !== "") {
      const baseUrl = import.meta.env.VITE_API_URL;
      const awsUrl = import.meta.env.VITE_APP_API_URL;

      const response = await axios.get(
        `${baseUrl}/product/searchByPrefix?nameSuffix=${encodeURIComponent(value)}`
        
      );
      // console.log("API URL:", process.env.REACT_APP_API_URL);
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
    setSelectedProducts(products);
    navigate("/");
  };

  const handleSubChildClick = async (childMenuName) => {
    setSearch("");            // Clear the search bar
    setSearchResults([]);     // Clear the search results
    const data = await fetchProductsByChildMenu(childMenuName);
    setSelectedProducts(data);
    navigate("/");
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
        <div
          style={{
            display: "flex",
            gap: "32px",
            background: "#181818",
            color: "#fff",
            fontWeight: 700,
            fontSize: "1.1rem",
            padding: "12px 0",
            borderBottom: "1px solid #eee",
            marginBottom: "8px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {menu.map((item, idx) => (
            <div
              key={item.key}
              className="navbar-item"
              style={{
                position: "relative",
                padding: "0 18px",
                cursor: "pointer",
                color: "#fff",
                height: "40px",
                display: "flex",
                alignItems: "center",
                borderBottom: activeIdx === idx ? "3px solid #e53935" : "none",
                background: activeIdx === idx ? "#fff" : "#181818",
                color: activeIdx === idx ? "#e53935" : "#fff",
                zIndex: 11,
              }}
              onMouseEnter={() => { setActiveIdx(idx); setActiveSubIdx(null); }}
              onMouseLeave={() => { setActiveIdx(null); setActiveSubIdx(null); }}
            >
              <span>{item.label}</span>
              {item.children && <span style={{ marginLeft: 6, color: "#2196f3" }}>▼</span>}
              {/* Dropdown panel */}
              {activeIdx === idx && item.children && (
                <div
                  className="mega-menu-panel"
                  style={{
                    display: "flex",
                    position: "absolute",
                    left: 0,
                    top: "100%",
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    minWidth: 600,
                    zIndex: 100,
                  }}
                  onMouseLeave={() => { setActiveIdx(null); setActiveSubIdx(null); }}
                >
                  {/* Sidebar */}
                  <div style={{
                    minWidth: 220,
                    borderRight: "1px solid #eee",
                    background: "#fff",
                    padding: "16px 0",
                  }}>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                      {item.children.map((child, subIdx) => (
                        <li
                          key={child.key}
                          className={`submenu-item${activeSubIdx === subIdx ? " active" : ""}`}
                          style={{
                            padding: "12px 24px",
                            cursor: "pointer",
                            color: activeSubIdx === subIdx ? "#e53935" : "#222",
                            background: activeSubIdx === subIdx ? "#f5f5f5" : "#fff",
                            fontWeight: 500,
                          }}
                          onMouseEnter={() => setActiveSubIdx(subIdx)}
                        >
                          <span>{child.label}</span>
                          {child.children && <span style={{ float: "right" }}>▶</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Right panel */}
                  {activeSubIdx !== null && item.children[activeSubIdx] && item.children[activeSubIdx].children && (
                    <div style={{
                      minWidth: 320,
                      padding: "24px 32px",
                      background: "#fff",
                    }}>
                      <div style={{ fontWeight: 700, marginBottom: 12 }}>
                        See All {item.children[activeSubIdx].label}
                      </div>
                      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                        {item.children[activeSubIdx].children.map((child) => (
                          <li
                            key={child.key}
                            style={{ padding: "8px 0", color: "#222", fontWeight: 400, cursor: "pointer" }}
                            onClick={() => handleSubChildClick(child.label)}
                          >
                            {child.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;