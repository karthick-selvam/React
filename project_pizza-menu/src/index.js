import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return <h1>Hello World</h1>;
}

//After React 18
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

//Before React 18
// ReactDOM.render(<App />,document.getElementById("root"));
