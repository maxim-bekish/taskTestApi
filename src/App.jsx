import { useState } from "react";
import "./scss/allStyle.scss";
import { Content } from "./components/Content";
import st from "./scss/app.module.scss";

const App = () => {
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");
  const [flag, setFlag] = useState({ value: null, flag: "NoFilter" });

  const funPrice = () => {
    const filledFields = [
      { value: price, name: "Price" },
      { value: brand, name: "Brand" },
      { value: name, name: "Name" },
    ].filter((field) => field.value);
    setPrice("");
    setBrand("");
    setName("");
    if (filledFields.length === 1) setFlag(filledFields[0]);
    if (filledFields.length > 1) alert("Только одно поле");
    if (filledFields.length === 0) alert("Введите 1 поле");
  };

  function noDigits(event) {
    if ("1234567890".indexOf(event.key) !== -1) event.preventDefault();
  }
  function noMinusNum(event) {
   if ("-".indexOf(event.key) !== -1) event.preventDefault();
    // if (Number(event.target.value) < 1) event.target.value='';
  }
  return (
    <>
      <header className="container header">
        <ul className={st.allFilter}>
          <li>
            <button
              onClick={(event) => {
                setFlag({
                  value: null,
                  flag: "NoFilter",
                });
                setPrice("");
                setBrand("");
                setName("");
              }}
            >
              Reset filters
            </button>
          </li>
          <li>
            <input
              min="1"
              onKeyPress={(event) => noMinusNum(event)}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              type="number"
            ></input>
          </li>
          <li>
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Brand"
              type="text"
            ></input>
          </li>
          <li>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              type="text"
              onKeyPress={(event) => noDigits(event)}
            ></input>
          </li>
        </ul>
        <button className={st.buttonRequests} onClick={funPrice}>
          Search
        </button>

        <div>
          {flag.value
            ? `Last request: ${flag.value}`
            : "Last request: no filter"}
        </div>
      </header>
      <main className="main container">
        <h2>Список товара</h2>
        <Content flag={flag}></Content>
      </main>
    </>
  );
};

export default App;
