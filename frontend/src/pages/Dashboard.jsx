import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CategorySidebar from "../components/CategorySidebar";
import MenuGrid from "../components/MenuGrid";
import Cart from "../components/Cart";

function Dashboard() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);

  return (
    <>
      <nav className="top-nav">
        <div className="brand">🍔 FoodHub</div>

        <div className="nav-actions">
          <button className="nav-btn" onClick={() => navigate("/orders")}>
            Order History
          </button>

          <button className="nav-btn" onClick={() => navigate("/admin")}>
            Admin Panel
          </button>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard mobile-dashboard">
        <CategorySidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <MenuGrid
          selectedCategory={selectedCategory}
          cart={cart}
          setCart={setCart}
        />

        <Cart cart={cart} setCart={setCart} />
      </main>
    </>
  );
}

export default Dashboard;
