import { useState, useRef } from "react";
import "./scss/allStyle.scss";
import { Content } from "./components/Content";
import st from "./scss/app.module.scss";

const App = () => {
  const inputRefPrice = useRef(null);
  const inputRefBrand = useRef(null);
  const inputRefName = useRef(null);
  const [flag, setFlag] = useState({ value: null, flag: 1 });
  const [disabledButton, setDisabledButton] = useState(true);
  const [buttonRequests, setButtonRequests] = useState(flag);
  const funPrice = () => {
    setButtonRequests(flag);
    inputRefPrice.current.value = "";
    inputRefBrand.current.value = "";
  };

  const handleChange = (e) => {
    // Получаем значение инпута через inputRef.current.value

    const inputValue = e.target.value;












    // настороить валидацию















    
    setDisabledButton();

    const inputFlag = e.target.getAttribute("flag");
    setFlag({ value: inputValue, flag: inputFlag });
  };

  function noDigits(event) {
    if ("1234567890".indexOf(event.key) != -1) event.preventDefault();
  }
  return (
    <>
      <header className="container header">
        <ul className={st.allFilter}>
          <li>
            <button
              flag="NoFilter"
              onClick={(event) =>
                setButtonRequests({
                  value: null,
                  flag: event.target.getAttribute("flag"),
                })
              }
            >
              Reset filters
            </button>
          </li>
          <li>
            <input
              min="1"
              flag="Price"
              ref={inputRefPrice}
              onChange={(e) => handleChange(e)}
              placeholder="Price"
              type="number"
            ></input>
          </li>
          <li>
            <input
              flag="Brand"
              ref={inputRefBrand}
              onChange={(e) => handleChange(e)}
              placeholder="Brand"
              type="text"
            ></input>
          </li>
          <li>
            <input
              flag="Name"
              ref={inputRefName}
              onChange={(e) => handleChange(e)}
              placeholder="Name"
              type="text"
              onKeyPress={(event) => noDigits(event)}
            ></input>
          </li>
        </ul>
        <button
          disabled={disabledButton}
          className={st.buttonRequests}
          onClick={funPrice}
        >
          Search
        </button>
        <div>
          {buttonRequests.value
            ? `Filter: ${buttonRequests.value}`
            : "No filter"}
        </div>
      </header>
      <main className="main container">
        <h2>Список товара</h2>
        <Content flag={buttonRequests}></Content>
      </main>
    </>
  );
};

export default App;
