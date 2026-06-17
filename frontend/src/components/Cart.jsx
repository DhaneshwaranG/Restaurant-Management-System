import API from "../services/api";

function Cart({ cart, setCart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQty = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
  };

  const checkout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const itemNames = cart
      .map((item) => `${item.name} x${item.quantity}`)
      .join(", ");

    try {
      await API.post("/orders", {
        totalAmount: total,
        orderDate: new Date().toISOString(),
        items: itemNames,
        status: "Pending",
      });

      alert("Order placed successfully!");

      setCart([]);

      window.location.reload();
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Failed to place order");
    }
  };

  return (
    <aside className="cart">
      <h2>🛒 Order Summary</h2>

      <div className="cart-body">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <h3>No Items Added</h3>
            <p>Select dishes from menu</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              <h4>{item.name}</h4>

              <div className="quantity-controls">
                <button onClick={() => decreaseQty(item.id)}>-</button>

                <span>{item.quantity}</span>

                <button onClick={() => increaseQty(item.id)}>+</button>
              </div>

              <p>₹{item.price * item.quantity}</p>
            </div>
          ))
        )}
      </div>

      <div className="cart-footer">
        <h3>Total: ₹{total}</h3>

        <button className="checkout-btn" onClick={checkout}>
          Place Order
        </button>
      </div>
    </aside>
  );
}

export default Cart;
