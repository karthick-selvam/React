import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriendForm() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    setShowAddFriend(false);
  }

  function handleSelectFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          selectedFriend={selectedFriend}
          onSelectFriend={handleSelectFriend}
          friends={friends}
        />

        {showAddFriend && <AddFriendForm onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriendForm}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>

      {selectedFriend && (
        <SplitBillForm
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, selectedFriend, onSelectFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <FriendsListItem
          key={friend.id}
          friend={friend}
          selectedFriend={selectedFriend}
          onSelectFriend={onSelectFriend}
        ></FriendsListItem>
      ))}
    </ul>
  );
}

function FriendsListItem({ friend, selectedFriend, onSelectFriend }) {
  const isSelected = friend.id === selectedFriend?.id;
  return (
    <li className={`${isSelected ? "selected" : ""}`}>
      <img src={friend.image} alt={friend.name} />
      <div>
        <h3>{friend.name}</h3>

        {friend.balance === 0 && <p>You and {friend.name} are even</p>}

        {friend.balance > 0 && (
          <p className="green">
            {friend.name} owes you ${Math.abs(friend.balance)}
          </p>
        )}

        {friend.balance < 0 && (
          <p className="red">
            You owe {friend.name} ${Math.abs(friend.balance)}
          </p>
        )}
      </div>

      <Button onClick={() => onSelectFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function AddFriendForm({ onAddFriend }) {
  const [name, setName] = useState("");
  const [imgUrl, setImgUrl] = useState("https://i.pravatar.cc/48");

  function handleAddFriend(e) {
    e.preventDefault();

    if (!name || !imgUrl) return;

    const id = Date.now();
    const newFriend = {
      id,
      name,
      image: `${imgUrl}?u=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImgUrl("");
  }

  return (
    <form className="form form-add-friend" onSubmit={handleAddFriend}>
      <label>🤡 Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>📸 Image URL</label>
      <input
        type="text"
        value={imgUrl}
        onChange={(e) => setImgUrl(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function SplitBillForm({ selectedFriend, onSplitBill }) {
  const [billAmount, setBillAmount] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const friendExpense = billAmount ? billAmount - myExpense : "";
  const [billPaidBy, setBillPaidBy] = useState("user");

  function handleSplitBill(e) {
    e.preventDefault();

    if (!billAmount || !myExpense) return;

    onSplitBill(billPaidBy === "user" ? friendExpense : -myExpense);
  }

  return (
    <form className="form form-split-bill" onSubmit={handleSplitBill}>
      <h2>Split Bill with {selectedFriend.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="number"
        value={billAmount}
        onChange={(e) => setBillAmount(Number(e.target.value))}
      />

      <label>🧑🏻 Your Expense</label>
      <input
        type="number"
        value={myExpense}
        onChange={(e) =>
          setMyExpense(
            Number(e.target.value) > billAmount
              ? billAmount
              : Number(e.target.value)
          )
        }
      />

      <label>🧑🏻‍🤝‍👩🏻 {selectedFriend.name} Expense</label>
      <input type="number" value={friendExpense} disabled />

      <label>💸 Who is Paying the Bill</label>
      <select
        value={billPaidBy}
        onChange={(e) => setBillPaidBy(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}

function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
