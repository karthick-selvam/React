import { useState } from "react";

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
  { id: 3, description: "Shirts", quantity: 6, packed: false },
  { id: 4, description: "Laptop", quantity: 1, packed: true },
  { id: 5, description: "Charger", quantity: 1, packed: true },
];

export default function App() {
  return (
    <div className="app">
      <Logo />
      <Form />
      <PackingList />
      <Stats />
    </div>
  );
}

function Logo() {
  return <h1>🌴 Far Away 👜</h1>;
}

function Form() {
  const [description, setdescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleFormSubmit(e) {
    e.preventDefault();

    if (!description) return;

    const newItem = { id: Date.now(), description, quantity, packed: false };

    setdescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleFormSubmit}>
      <h3>What do you need for your 😍 trip?</h3>

      <select
        value={quantity}
        onChange={(e) => setQuantity((c) => Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>

      <input
        placeholder="Item.."
        value={description}
        onChange={(e) => setdescription((c) => e.target.value)}
      />

      <button>Submit</button>
    </form>
  );
}

function PackingList() {
  return (
    <div className="list">
      <ul>
        {initialItems.map((item) => (
          <List item={item} key={item.id} />
        ))}
      </ul>
    </div>
  );
}

function List({ item }) {
  return (
    <li>
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button>❌</button>
    </li>
  );
}

function Stats() {
  return (
    <footer className="stats">
      <em>👜 You have X items on your list, and you already packed X (X%)</em>
    </footer>
  );
}
