import React, { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => setUsers(data));

    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Application Système Réparti</h1>

      <h2>Utilisateurs</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>

      <h2>Produits</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name} - {product.price} €</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
