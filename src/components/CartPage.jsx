import React from "react";

const CartPage = ({ cart, setCart }) => {
  const handleIncrease = (code) => {
    setCart((prev) =>
      prev.map((item) =>
        item.code === code ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (code) => {
    setCart((prev) =>
      prev.map((item) =>
        item.code === code && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemove = (code) => {
    setCart((prev) => prev.filter((item) => item.code !== code));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", background: "#fff", padding: 24, borderRadius: 12 }}>
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.code} style={{ display: "flex", alignItems: "center", marginBottom: 24, borderBottom: "1px solid #eee", paddingBottom: 16 }}>
              <img src={item.image_url} alt={item.productRealName} style={{ width: 80, height: 80, objectFit: "contain", marginRight: 24 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold" }}>{item.productRealName}</div>
                <div style={{ color: "#888" }}>${item.price.toFixed(2)} each</div>
                {/* Low stock alert example */}
                {item.lowStock && (
                  <div style={{ color: "red", fontWeight: "bold" }}>This item is running low.</div>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => handleDecrease(item.code)} style={{ fontSize: 20, width: 32, height: 32 }}>-</button>
                <span style={{ fontWeight: "bold", fontSize: 18 }}>{item.quantity}</span>
                <button onClick={() => handleIncrease(item.code)} style={{ fontSize: 20, width: 32, height: 32 }}>+</button>
              </div>
              <div style={{ width: 80, textAlign: "right", fontWeight: "bold", fontSize: 18 }}>
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button onClick={() => handleRemove(item.code)} style={{ marginLeft: 16, color: "#d32f2f", background: "none", border: "none", cursor: "pointer" }}>
                Remove
              </button>
            </div>
          ))}
          <div style={{ textAlign: "right", fontWeight: "bold", fontSize: 22, marginTop: 24 }}>
            Est. Subtotal ${subtotal.toFixed(2)}
          </div>
          <button
            style={{
              marginTop: 24,
              background: subtotal >= 30 ? "#d32f2f" : "#f8bcbc",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 20,
              border: "none",
              borderRadius: 8,
              padding: "16px 48px",
              cursor: subtotal >= 30 ? "pointer" : "not-allowed"
            }}
            disabled={subtotal < 30}
          >
            CHECKOUT
          </button>
          {subtotal < 30 && (
            <div style={{ color: "#d32f2f", marginTop: 8 }}>
              Spend at least $30 on groceries after discounts to check out.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;