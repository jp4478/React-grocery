import { useState, useEffect, createContext } from "react";
import axios from "axios";

const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  addToCart: (product) => {},
  removeFromCart: (productId) => {},
  refreshData: () => {},
  updateStockQuantity: (productId, newQuantity) => {},
  menu: [],
  fetchMenu: () => {},
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [menu, setMenu] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);
    if (existingProductIndex !== -1) {
      const updatedCart = cart.map((item, index) =>
        index === existingProductIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Commented out API call
  // const refreshData = async () => {
  //   try {
  //     const response = await axios.get("/products");
  //     setData(response.data);
  //   } catch (error) {
  //     setIsError(error.message);
  //   }
  // };

  const refreshData = () => {}; // Dummy function

  const clearCart = () => {
    setCart([]);
  };

  const fetchMenu = async () => {
    try {
      const response = await axios.get("http://localhost:8080/menu");
      console.log(response.data);
      setMenu(response.data);
    } catch (error) {
      setMenu([]);
    }
  };

  const fetchProductsByChildMenu = async (childMenuName) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/subCategory/display?childMenuName=${encodeURIComponent(childMenuName)}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // Fetch menu on mount
  useEffect(() => {
    fetchMenu();
  }, []);

  // Commented out useEffect that calls refreshData
  // useEffect(() => {
  //   refreshData();
  // }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  return (
    <AppContext.Provider
      value={{
        data,
        isError,
        cart,
        addToCart,
        removeFromCart,
        refreshData,
        clearCart,
        menu,
        fetchMenu,
        fetchProductsByChildMenu,
        selectedProducts,
        setSelectedProducts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;