import { useEffect, useState } from "react";
import API from "../services/api";

function MenuGrid({ selectedCategory, cart, setCart }) {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    API.get("/menu-items")
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category?.name === selectedCategory;

    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const addToCart = (item) => {
    const existingItem = cart.find((c) => c.id === item.id);

    if (existingItem) {
      setCart(
        cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          ...item,
          quantity: 1,
        },
      ]);
    }
  };

  return (
    <div className="menu-grid">
      <h2>Menu Items</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search dishes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="cards-container">
        {filteredItems.length === 0 ? (
          <p>No menu items found.</p>
        ) : (
          filteredItems.map((item) => (
            <div className="menu-card" key={item.id}>
              <h3>{item.name}</h3>

              <p className="price">₹{item.price}</p>

              <p className="category">{item.category?.name}</p>

              <button className="add-btn" onClick={() => addToCart(item)}>
                Add To Cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MenuGrid;
