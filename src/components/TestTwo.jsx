import { useState, useEffect } from "react";
import axios from "axios";
import { authString } from "./../helpers/authString";
import { removeDuplicates } from "../helpers/removeDuplicates";

const URL = "http://api.valantis.store:40000/";

export const TestTwo = ({ flag }) => {
  const [finalResult, setFinalResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  let defaultFilter = {
    action: "get_ids",
    params: {
      offset: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage,
    },
  };
  let filterPrice = {
    action: "filter",
    params: {
      price: Number(flag.value),
      offset: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage,
    },
  };
  let filterBrand = {
    action: "filter",
    params: {
      brand: flag.value,
      offset: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage,
    },
  };
  let filterName = {
    action: "filter",
    params: {
      product: flag.value,
      offset: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage,
    },
  };

  const [flagValue, setFlagValue] = useState(defaultFilter);
  useEffect(() => {
    let action;
    switch (Number(flag.flag)) {
      case 1:
        action = defaultFilter;
        break;
      case 2:
        action = filterPrice;
        break;
      case 3:
        action = filterBrand;
        break;
      case 4:
        action = filterName;
        break;

      default:
        action = defaultFilter;
    }

    setFlagValue(action);
  }, [flag]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Отправляем данные на сервер
        const response1 = await axios.post(URL, flagValue, {
          headers: {
            "Content-Type": "application/json",
            "X-Auth": authString(),
          },
        });
        // После получения ответа от сервера, извлекаем необходимые данные
        const extractedData = response1.data.result;
        // Используем извлеченные данные для формирования запроса
        const requestData = {
          action: "get_items",
          params: { ids: extractedData },
        };
        // Отправляем запрос на сервер
        const response2 = await axios.post(URL, requestData, {
          headers: {
            "Content-Type": "application/json",
            "X-Auth": authString(),
          },
        });
        // Обрабатываем итоговый ответ от сервера и удаляем товар с одинаковыми id
        const finalResultFromServer = removeDuplicates(response2.data.result);
        // Устанавливаем итоговый результат в состояние компонента
        // removeDuplicates(response.data.result);
        setFinalResult(finalResultFromServer);
        setError(null); // Сбрасываем состояние ошибки, если оно было
      } catch (error) {
        // Обрабатываем ошибку, если возникла
        setError(error.message);
      }
    };

    fetchData(); // Вызываем функцию fetchData при монтировании компонента
  }, [currentPage, flagValue, error]); // Пустой массив зависимостей означает, что useEffect будет вызван только один раз при монтировании компонента
  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    // console.log(currentPage);
    setFlagValue(defaultFilter);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  return (
    <div>
      {error && <p>Произошла ошибка: {error}</p>}
      {finalResult &&
        finalResult.map((el, index) => (
          <div key={`div-${index}`}>
            <ul key={`ui-${index}`}>
              <li key={`li-brand-${index}`}>{el.brand ? el.brand : "null"}</li>
              <li key={`li-price-${index}`}>{el.price}</li>
              <li key={`li-product-${index}`}>{el.product}</li>
              <li key={`li-id-${index}`}>{el.id}</li>
            </ul>
          </div>
        ))}
      <button onClick={prevPage} disabled={currentPage === 1}>
        Предыдущая страница
      </button>
      <span>
        <strong> {currentPage} </strong>
      </span>
      <button onClick={nextPage}>Следующая страница</button>
    </div>
  );
};
