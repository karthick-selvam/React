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
  const [friends, setFriends] = useState([]);
  const [splitBillWith, setSplitBillWith] = useState(null);
  const [billAmount, setBillAmount] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const [friendExpense, setFriendExpense] = useState("");
  const [billPaidBy, setBillPaidBy] = useState(1);

  function handleSplitBill(e) {
    e.preventDefault();
    if (
      billAmount &&
      splitBillWith &&
      myExpense &&
      friendExpense &&
      billPaidBy
    ) {
      let balance = billAmount;
      billPaidBy === 1
        ? (balance = balance - myExpense)
        : (balance = balance - friendExpense);

      const friendsAfterCalc = friends.map((friend) => {
        if (friend.id !== splitBillWith.id) return friend;
        let balance = friend.balance;

        billPaidBy === 1 ? (balance -= friendExpense) : (balance += myExpense);

        return {
          ...friend,
          balance,
        };
      });

      setFriends(friendsAfterCalc);
      setBillAmount("");
      setMyExpense("");
      setFriendExpense("");
      setBillPaidBy(1);
      setSplitBillWith(null);
    }
  }

  return (
    <div className="app">
      <FriendsList
        onSelectFriend={setSplitBillWith}
        friends={friends}
        onSetFriends={setFriends}
      />
      {splitBillWith && (
        <SplitBillForm
          splitBillWith={splitBillWith}
          billAmount={billAmount}
          onBillAmount={setBillAmount}
          myExpense={myExpense}
          onMyExpense={setMyExpense}
          friendExpense={friendExpense}
          onFriendExpense={setFriendExpense}
          billPaidBy={billPaidBy}
          onBillPaidBy={setBillPaidBy}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSetFriends, onSelectFriend }) {
  const [addFriendForm, setAddFriendForm] = useState(false);

  return (
    <div className="sidebar">
      <ul>
        {friends.map((friend) => (
          <FriendsListItem
            key={friend.id}
            friend={friend}
            onSelectFriend={onSelectFriend}
          ></FriendsListItem>
        ))}
      </ul>

      {addFriendForm ? (
        <AddFriendForm
          onAddFriend={onSetFriends}
          onAfterAddFriend={setAddFriendForm}
        />
      ) : (
        <button
          className="button"
          onClick={() => setAddFriendForm((curr) => !curr)}
        >
          Add friend
        </button>
      )}
    </div>
  );
}

function FriendsListItem({ friend, onSelectFriend }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <div>
        <h3>{friend.name}</h3>
        {friend.balance > 0 ? (
          <p className="red">
            You owe {friend.name} ${Math.abs(friend.balance)}
          </p>
        ) : (
          <p className="green">
            {friend.name} owe you ${Math.abs(friend.balance)}
          </p>
        )}
      </div>

      <button className="button" onClick={() => onSelectFriend(friend)}>
        Select
      </button>
    </li>
  );
}

function AddFriendForm({ onAddFriend, onAfterAddFriend }) {
  const [name, setName] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  function handleAddFriend(e) {
    e.preventDefault();

    const friend = {
      id: Date.now(),
      name,
      image: imgUrl,
      balance: 0,
    };

    onAddFriend((curr) => {
      const existingFriends = curr.slice();
      existingFriends.push(friend);
      return existingFriends;
    });

    onAfterAddFriend((curr) => !curr);
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

      <button className="button">Add</button>
    </form>
  );
}

function SplitBillForm({
  billAmount,
  onBillAmount,
  myExpense,
  onMyExpense,
  friendExpense,
  onFriendExpense,
  billPaidBy,
  onBillPaidBy,
  splitBillWith,
  onSplitBill,
}) {
  return (
    <form className="form form-split-bill" onSubmit={onSplitBill}>
      <h2>Split Bill with {splitBillWith.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={billAmount}
        onChange={(e) => onBillAmount(Number(e.target.value))}
      />

      <label>🧑🏻 Your Expense</label>
      <input
        type="text"
        value={myExpense}
        onChange={(e) => onMyExpense(Number(e.target.value))}
      />

      <label>🧑🏻‍🤝‍👩🏻 {splitBillWith.name} Expense</label>
      <input
        type="text"
        value={friendExpense}
        onChange={(e) => onFriendExpense(Number(e.target.value))}
      />

      <label>💸 Who is Paying the Bill</label>
      <select
        value={billPaidBy}
        onChange={(e) => onBillPaidBy(Number(e.target.value))}
      >
        <option value="1">You</option>
        <option value={splitBillWith.id}>{splitBillWith.name}</option>
      </select>

      <button className="button">Split bill</button>
    </form>
  );
}
