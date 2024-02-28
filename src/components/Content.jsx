import { useState, useEffect } from "react";
import axios from "axios";
import st from "./../scss/cards.module.scss";
import { authString } from "../helpers/authString"; //  кодировка токена авторизации
import { removeDuplicates } from "../helpers/removeDuplicates"; // функция которая удаляет елемента с одинаковыми id
import { Spin } from "./Spin"; // этот спинер показан во время запроса
import { Pagination } from "./Pagination"; // тут отрисовывается пагинация
sessionStorage.removeItem("currentPageNumber");
const API_URL = "https://api.valantis.store:41000/";
const itemsPerPage = 50; // сколько показывать карточек на одной странице
let defaultFilter = {
  action: "get_ids",
};
export const Content = ({ flag }) => {
  const [displayedProducts, setDisplayedProducts] = useState(null); //результат который отрисовывается на странице
  const [loading, setLoading] = useState(true); // состояние загрузки когда показывать спинер
  const [firstRequestError, setFirstRequestError] = useState(null); // состояние ошибок при первом запросе
  const [secondRequestError, setSecondRequestError] = useState(null); //  состояние ошибок при втором запросе
  const [currentPageNumber, setCurrentPageNumber] = useState(0); // номер на котором находиться пагинация в настоящем времени
  const [arrayData, setArrayData] = useState([]); // сюда записывается результам после первого запроса
  const [filterOptions, setFilterOptions] = useState(defaultFilter); // настройка body для первого запроса

  useEffect(() => {
    setCurrentPageNumber(0);
    let action;
    switch (flag.name) {
      case "NoFilter":
        action = defaultFilter;
        break;
      case "Price":
        action = {
          action: "filter",
          params: {
            price: Number(flag.value),
          },
        };
        break;
      case "Brand":
        action = {
          action: "filter",
          params: {
            brand: flag.value,
          },
        };
        break;
      case "Name":
        action = {
          action: "filter",
          params: {
            product: flag.value,
          },
        };
        break;
      default:
        action = defaultFilter;
    }

    setFilterOptions(action);
  }, [flag]);

  useEffect(() => {
    setFirstRequestError(null); // Сбрасываем состояние ошибки, если оно было
    setLoading(true);
    const firstRequest = async () => {
      try {
        const response1 = await axios.post(API_URL, filterOptions, {
          headers: {
            "Content-Type": "application/json",
            "X-Auth": authString(),
          },
        });
        //  const xxx111= removeDuplicates(extractedData);
        let uniqueArray = [...new Set(response1.data.result)];
        sessionStorage.setItem(
          "currentPageNumber",
          Math.round((uniqueArray.length + 1) / itemsPerPage)
        );
        setArrayData(uniqueArray);
      } catch (error) {
        // console.clear();
        console.error(`Error: ${error.message}`);
        setFirstRequestError(error.message);
      } finally {
        if (firstRequestError === null) {
          setLoading(false);
        }
        if (firstRequestError !== null) {
          setLoading(true);
        }
      }
    };
    firstRequest();
  }, [filterOptions, firstRequestError]);

  useEffect(() => {
    setSecondRequestError(null); // Сбрасываем состояние ошибки, если оно было
    setLoading(true);
    async function secondRequest() {
      // itemsPerPage  сколько отображать на странице
      // currentPageNumber число нажатой пагинации
      const y = currentPageNumber * itemsPerPage;
      const newArr = arrayData.slice(y, y + itemsPerPage);
      try {
        const response2 = await axios.post(
          API_URL,
          { action: "get_items", params: { ids: newArr } },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Auth": authString(),
            },
          }
        );

        // Обрабатываем итоговый ответ от сервера и удаляем товар с одинаковыми id
        const finalResultFromServer = removeDuplicates(response2.data.result);
        // Устанавливаем итоговый результат в состояние компонента

        setDisplayedProducts(finalResultFromServer);
      } catch (error) {
        // console.clear();
        console.error(`Error: ${error.message}`);
        setSecondRequestError(error.message);
      } finally {
        if (secondRequestError === null) {
          setLoading(false);
        }
        if (secondRequestError !== null) {
          setLoading(true);
        }
      }
    }
    if (arrayData.length > 0) secondRequest();
  }, [currentPageNumber, arrayData, secondRequestError]);

  return (
    <>
      <Pagination usePagination={{ setCurrentPageNumber, currentPageNumber }} />
      <div className={`${st.wrapper} ${loading ? st.wrapperActive : ""}`}>
        <div className={st.cards}>
          {loading && <Spin />}
          {displayedProducts &&
            displayedProducts.map((el, index) => (
              <div className={st.card} key={`div-${index}`}>
                <ul key={`ui-${index}`}>
                  <li key={`li-brand-${index}`}>
                    <span> Brand:</span> {el.brand ? el.brand : "not specified"}
                  </li>
                  <li key={`li-price-${index}`}>
                    <span> Price:</span> {el.price}
                  </li>
                  <li key={`li-product-${index}`}>
                    <span> Name:</span> {el.product}
                  </li>
                  <li key={`li-id-${index}`}>
                    <span> Id:</span> {el.id}
                  </li>
                </ul>
              </div>
            ))}
        </div>
      </div>
      <Pagination usePagination={{ setCurrentPageNumber, currentPageNumber }} />
    </>
  );
};
