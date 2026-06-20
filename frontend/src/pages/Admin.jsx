import { useEffect, useState } from "react";
import API from "../services/api";
import { FaTrash, FaEdit } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [categoryName, setCategoryName] = useState("");

  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [editingItemId, setEditingItemId] = useState(null);

  const loadData = () => {
    API.get("/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));

    API.get("/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));

    API.get("/menu-items")
      .then((res) => setMenuItems(res.data))
      .catch((err) => console.error(err));

    // orders already fetched above
  };

  useEffect(() => {
    loadData();
  }, []);

  const clearForm = () => {
    setItemName("");
    setItemPrice("");
    setSelectedCategoryId("");
    setEditingItemId(null);
  };

  const addCategory = async () => {
    if (!categoryName.trim()) {
      alert("Enter category name");
      return;
    }

    try {
      await API.post("/categories", {
        name: categoryName,
      });

      alert("Category Added");
      setCategoryName("");
      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to add category");
    }
  };

  const addMenuItem = async () => {
    if (!itemName || !itemPrice || !selectedCategoryId) {
      alert("Fill all fields");
      return;
    }

    try {
      await API.post("/menu-items", {
        name: itemName,
        price: Number(itemPrice),
        category: {
          id: Number(selectedCategoryId),
        },
      });

      alert("Menu Item Added");

      clearForm();
      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to add menu item");
    }
  };

  const updateMenuItem = async () => {
    if (!itemName || !itemPrice || !selectedCategoryId) {
      alert("Fill all fields");
      return;
    }

    try {
      await API.put(`/menu-items/${editingItemId}`, {
        name: itemName,
        price: Number(itemPrice),
        category: {
          id: Number(selectedCategoryId),
        },
      });

      alert("Menu Item Updated");

      clearForm();
      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to update menu item");
    }
  };

  const deleteMenuItem = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/menu-items/${id}`);

      alert("Menu Item Deleted");

      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to delete menu item");
    }
  };

  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/categories/${id}`);

      alert("Category Deleted");

      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to delete category");
    }
  };

  const editMenuItem = (item) => {
    setEditingItemId(item.id);
    setItemName(item.name);
    setItemPrice(item.price);
    setSelectedCategoryId(item.category?.id || "");
  };
  const updateOrderStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, {
        status,
      });

      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to update order status");
    }
  };

  // dashboard summary values
  const totalCategories = categories.length;
  const totalMenuItems = menuItems.length;
  const totalOrders = orders.length; // placeholder until orders are implemented
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  ); // placeholder until revenue calculation is implemented

  const revenueData = Object.values(
    orders.reduce((acc, order) => {
      const date = new Date(order.orderDate).toISOString().split("T")[0];

      if (!acc[date]) {
        acc[date] = {
          date,
          revenue: 0,
        };
      }

      acc[date].revenue += order.totalAmount;

      return acc;
    }, {}),
  );

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Dashboard
        </button>
      </div>
      <div className="stats-grid">
        <div className="stats-card">
          <h3>Total Categories</h3>
          <h2>{totalCategories}</h2>
        </div>

        <div className="stats-card">
          <h3>Total Menu Items</h3>
          <h2>{totalMenuItems}</h2>
        </div>

        <div className="stats-card">
          <h3>Total Orders</h3>
          <h2>{totalOrders}</h2>
        </div>

        <div className="stats-card">
          <h3>Total Revenue</h3>
          <h2>₹{totalRevenue}</h2>
        </div>
      </div>

      <h2 className="chart-title">Revenue Analytics</h2>

      <div
        style={{
          width: "100%",
          height: "350px",
          marginBottom: "30px",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueData}>
            <CartesianGrid stroke="#f4d7b0" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip
              formatter={(value) => [`₹${value}`, "Revenue"]}
              contentStyle={{ borderRadius: "12px", border: "none" }}
            />

            <Bar dataKey="revenue" fill="#ff7a00" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2>Add Category</h2>

      <input
        className="admin-input"
        type="text"
        placeholder="Category Name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        style={{
          padding: "10px",
          marginRight: "10px",
        }}
      />

      <button className="admin-btn" onClick={addCategory}>
        Add Category
      </button>

      <h2>{editingItemId ? "Edit Menu Item" : "Add Menu Item"}</h2>

      <input
        className="admin-input"
        type="text"
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />

      <input
        className="admin-input"
        type="number"
        placeholder="Price"
        value={itemPrice}
        onChange={(e) => setItemPrice(e.target.value)}
      />

      <select
        className="admin-select"
        value={selectedCategoryId}
        onChange={(e) => setSelectedCategoryId(e.target.value)}
      >
        <option value="">Select Category</option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      {editingItemId ? (
        <>
          <button className="admin-btn" onClick={updateMenuItem}>
            Update Menu Item
          </button>

          <button
            className="admin-btn"
            onClick={clearForm}
            style={{
              marginLeft: "10px",
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <button className="admin-btn" onClick={addMenuItem}>
          Add Menu Item
        </button>
      )}

      <h2>Categories</h2>
      <div className="table-wrapper">
        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            marginBottom: "30px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Category Name</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>

                <td>{category.name}</td>

                <td>
                  <button
                    className="icon-btn delete-btn"
                    onClick={() => deleteCategory(category.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Menu Items</h2>
      <div className="table-wrapper">
        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>₹{item.price}</td>
                <td>{item.category?.name}</td>

                <td>
                  <div className="action-buttons">
                    <button
                      className="icon-btn edit-btn"
                      onClick={() => editMenuItem(item)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="icon-btn delete-btn"
                      onClick={() => deleteMenuItem(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Orders</h2>
      <div className="table-wrapper">
        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Order Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>

                <td>{order.items}</td>

                <td>₹{order.totalAmount}</td>

                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Ready">Ready</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>

                <td>{new Date(order.orderDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
