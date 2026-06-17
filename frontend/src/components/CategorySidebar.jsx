import { useEffect, useState } from "react";
import API from "../services/api";

function CategorySidebar({ selectedCategory, setSelectedCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get("/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>🍽️ Categories</h2>
      </div>

      <button
        className={`category-btn ${
          selectedCategory === "All" ? "active-category" : ""
        }`}
        onClick={() => setSelectedCategory("All")}
      >
        All Items
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          className={`category-btn ${
            selectedCategory === category.name ? "active-category" : ""
          }`}
          onClick={() => setSelectedCategory(category.name)}
        >
          {category.name}
        </button>
      ))}
    </aside>
  );
}

export default CategorySidebar;
