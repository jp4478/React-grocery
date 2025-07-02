import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";
import { FaSearch } from "react-icons/fa";

const Home = ({ addToCart, search, searchResults }) => {
  const { data, isError, refreshData, selectedProducts } = useContext(AppContext);
  const [isDataFetched, setIsDataFetched] = useState(false);
  // Track quantity for each product by code
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  // Normalize searchResults to ensure all products have the same structure
  const normalizedResults = searchResults.map((product) => ({
    ...product,
    productRealName: product.productRealName || product.productName || "",
    image_url: product.image_url,
    price: product.price,
    code: product.code,
  }));

  // Use searchResults if searching, otherwise show selectedProducts
  const productsToShow =
    search && searchResults && searchResults.length > 0
      ? normalizedResults
      : selectedProducts; // allProducts = your normal product list

  const handleIncrease = (code) => {
    setQuantities((prev) => ({
      ...prev,
      [code]: (prev[code] || 1) + 1,
    }));
  };

  const handleDecrease = (code) => {
    setQuantities((prev) => ({
      ...prev,
      [code]: prev[code] > 1 ? prev[code] - 1 : 1,
    }));
  };

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
        <img
          src={unplugged}
          alt="Error"
          style={{ width: "100px", height: "100px" }}
        />
      </h2>
    );
  }
  return (
    <div>
      <div
        className="grid"
        style={{
          marginTop: "64px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          padding: "20px",
        }}
      >
        {productsToShow.length === 0 ? (
          <h2
            className="text-center"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            No Products Available
          </h2>
        ) : (
          productsToShow.map((product) => {
            const id = product.code;
            const name = product.productRealName || product.productName || "";
            const price = product.price;
            const imageUrl = product.image_url;
            const productAvailable = true;
            const quantity = quantities[id] || 1;

            return (
              <div
                className="card mb-3"
                style={{
                  width: "250px",
                  height: "360px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  backgroundColor: productAvailable ? "#fff" : "#ccc",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "stretch",
                  position: "relative",
                }}
                key={id}
              >
                {/* Quantity controls */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    background: "#00695c",
                    borderRadius: "999px",
                    padding: "8px 16px",
                    position: "absolute",
                    top: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 2,
                    color: "#fff",
                    minWidth: 120,
                  }}
                >
                  <button
                    onClick={() => handleDecrease(id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#fff",
                      fontSize: 28,
                      cursor: "pointer",
                      width: 32,
                      height: 32,
                    }}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    style={{
                      width: 36,
                      height: 32,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 20,
                      background: "#fff",
                      color: "#00695c",
                      borderRadius: 8,
                      border: "none",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={() => handleIncrease(id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#fff",
                      fontSize: 28,
                      cursor: "pointer",
                      width: 32,
                      height: 32,
                    }}
                  >
                    +
                  </button>
                </div>
                
                <img
                  src={imageUrl}
                  alt={name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    padding: "5px",
                    margin: "0",
                    borderRadius: "10px 10px 10px 10px",
                  }}
                />
                <div
                  className="card-body"
                  style={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "10px",
                  }}
                >
                  <div>
                    <h5 className="card-title">
                      {name ? name.toUpperCase() : ""}
                    </h5>
                  </div>
                  <hr className="hr-line" style={{ margin: "10px 0" }} />
                  <div className="home-cart-price">
                    <h5
                      className="card-text"
                      style={{
                        fontWeight: "600",
                        fontSize: "1.1rem",
                        marginBottom: "5px",
                      }}
                    >
                      ${price}
                    </h5>
                  </div>``
                  <button
                    className="btn-hover color-9"
                    style={{ margin: "10px 25px 0px " }}
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product, quantity); // This sends product and quantity to your cart logic
                    }}
                    disabled={!productAvailable}
                  >
                    {productAvailable ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Home;
