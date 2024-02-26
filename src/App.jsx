import { useState, useRef } from "react";
import { TestTwo } from "./components/TestTwo";

const App = () => {
  const inputRefPrice = useRef(null);
  const inputRefBrand = useRef(null);
  const inputRefName = useRef(null);
  const [data, setData] = useState({ value: null, flag: 1 });
  const [x, setX] = useState(data);
  const funPrice = () => {
    setX(data);
    inputRefPrice.current.value = "";
    inputRefBrand.current.value = "";
  };

  const handleChangePrice = () => {
    // Получаем значение инпута через inputRef.current.value
    const inputValue = inputRefPrice.current.value;
    const inputFlag = inputRefPrice.current.getAttribute("flag");
    setData({ value: inputValue, flag: inputFlag });
  };
  const handleChangeBrand = () => {
    // Получаем значение инпута через inputRef.current.value
    const inputValue = inputRefBrand.current.value;
    const inputFlag = inputRefBrand.current.getAttribute("flag");
    setData({ value: inputValue, flag: inputFlag });
  };

  const handleChangeName = () => {
    // Получаем значение инпута через inputRef.current.value
    const inputValue = inputRefName.current.value;
    const inputFlag = inputRefName.current.getAttribute("flag");
    setData({ value: inputValue, flag: inputFlag });
  };

  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <button
                flag="1"
                onClick={(event) =>
                  setX({ value: null, flag: event.target.getAttribute("flag") })
                }
              >
                Сбросить фильтр
              </button>
            </li>
            <li>
              <input
                flag="2"
                ref={inputRefPrice}
                onChange={handleChangePrice}
                placeholder="price"
                type="number"
              ></input>
            </li>
            <li>
              <input
                flag="3"
                ref={inputRefBrand}
                onChange={handleChangeBrand}
                placeholder="brand"
                type="text"
              ></input>
            </li>
            <li>
              <input
                flag="4"
                ref={inputRefName}
                onChange={handleChangeName}
                placeholder="Name"
                type="text"
              ></input>
            </li>

            <button onClick={funPrice}>search</button>
            <div>{x.value ? `фильтр по ${x.value}` : "Без фильтра"}</div>
          </ul>
        </nav>
      </header>
      <main>
        <h2>Список товара</h2>
        <TestTwo flag={x}></TestTwo>
        {/* <TestTwo flag={x}></TestTwo> */}
      </main>
    </>
  );
};

export default App;
