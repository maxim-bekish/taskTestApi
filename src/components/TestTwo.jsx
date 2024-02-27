import { useState, useEffect } from "react";
import axios from "axios";
import { authString } from "./../helpers/authString"; //  кодировка токена авторизации
import { removeDuplicates } from "../helpers/removeDuplicates"; // функция которая удаляет елемента с одинаковыми id
import { Spin } from "../components/Spin"; // этот спинер показан во время запроса
import { Pagination } from "./Pagination"; // тут отрисовывается пагинация

const API_URL = "http://api.valantis.store:40000/";

export const TestTwo = ({ flag }) => {
  const [displayedProducts, setDisplayedProducts] = useState(null); //результат который отрисовывается на странице
  const [loading, setLoading] = useState(true); // состояние загрузки когда показывать спинер
  const [firstRequestError, setFirstRequestError] = useState(null); // состояние ошибок при первом запросе
  const [secondRequestError, setSecondRequestError] = useState(null); //  состояние ошибок при втором запросе
  const [currentPageNumber, setCurrentPageNumber] = useState(0); // номер на котором находиться пагинация в настоящем времени
  const [arrayData, setArrayData] = useState([]); // сюда записывается результам после первого запроса
  const itemsPerPage = 10; // сколько показывать карточек на одной странице
  let defaultFilter = {
    action: "get_ids",
    params: {
      offset: 0,
      limit: 100,
    },
  };
  let filterByPrice = {
    action: "filter",
    params: {
      price: Number(flag.value),
    },
  };
  let filterByBrand = {
    action: "filter",
    params: {
      brand: flag.value,
    },
  };
  let filterByName = {
    action: "filter",
    params: {
      product: flag.value,
    },
  };

  const [filterOptions, setFilterOptions] = useState(defaultFilter); // настройка body для первого запроса

  useEffect(() => {
    let action;
    switch (Number(flag.flag)) {
      case 1:
        action = defaultFilter;
        break;
      case 2:
        action = filterByPrice;
        break;
      case 3:
        action = filterByBrand;
        break;
      case 4:
        action = filterByName;
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
        const extractedData = response1.data.result;
        sessionStorage.setItem(
          "currentPageNumber",
          Math.ceil(extractedData.length / itemsPerPage)
        );
        setArrayData(extractedData);
      } catch (error) {
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
      <div style={{ position: "relative" }}>
        {!loading ? (
          displayedProducts &&
          displayedProducts.map((el, index) => (
            <div key={`div-${index}`}>
              <ul key={`ui-${index}`}>
                <li key={`li-brand-${index}`}>
                  {el.brand ? el.brand : "null"}
                </li>
                <li key={`li-price-${index}`}>{el.price}</li>
                <li key={`li-product-${index}`}>{el.product}</li>
                <li key={`li-id-${index}`}>{el.id}</li>
              </ul>
            </div>
          ))
        ) : (
          <Spin />
        )}
        <Pagination
          usePagination={{ setCurrentPageNumber, currentPageNumber }}
        />
      </div>
    </>
  );
};
