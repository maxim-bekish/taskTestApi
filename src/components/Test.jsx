import md5 from "md5";
import { ErrorModal } from "./ErrorModal";
import { useEffect, useState } from "react";
import axios from "axios";
import { removeDuplicates } from "../helpers/removeDuplicates";
const password = "Valantis";
const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
const authString = md5(`${password}_${timestamp}`);

// Создаем функцию debounce
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

export const Test = ({ flag }) => {
  const [postData, setPostData] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [www, setwww] = useState(1);
  let x = {
    action: "filter",
    params: { price: 17500.0 },
  };
  let y = {
    action: "filter",
    params: { price: 15000.0 },
  };
  let all = {
    action: "get_ids",
    params: {
      offset: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage,
    },
  };

  // console.log( typeof flag);
  useEffect(() => {
    let action;
    switch (Number(flag)) {
      case 1:
        action = all;
        break;
      case 2:
        action = x;
        break;
      case 3:
        action = y;
        break;
      default:
        action = all;
    }
    setwww(action);
  }, [flag]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://api.valantis.store:40000/",
          www,
          {
            headers: {
              "Content-Type": "application/json",
              "X-Auth": authString,
            },
          }
        );
        setPostData(response.data.result);
        setError(null);
      } catch (error) {
        setError(error.message);
      }
    };

    const delayedFetchData = debounce(fetchData, 500); // Например, 500 миллисекунд

    delayedFetchData();

    // Возвращаем функцию для очистки таймера debounce при размонтировании компонента или изменении зависимостей
    return () => clearTimeout(delayedFetchData);

    // fetchData();
  }, [currentPage, www]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.post(
          "http://api.valantis.store:40000/",
          {
            action: "get_items",
            params: { ids: postData },
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Auth": authString,
            },
          }
        );
        setResponseData(removeDuplicates(response.data.result));
        setError(null);
      } catch (error) {
        setError(error.message);
      }
    };

    if (postData.length > 0) {
      fetchItems();
    }
  }, [postData]);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div>
      {error && <ErrorModal message={error} />}
      {responseData.map((el, index) => (
        <div key={`div-${index}`}>
          <ul key={`ui-${index}`}>
            <li key={`li-brand-${index}`}>{el.brand ? el.brand : "null"}</li>
            <li key={`li-price-${index}`}>{el.price}</li>
            <li key={`li-product-${index}`}>{el.product}</li>
            <li key={`li-id-${index}`}>{el.id}</li>
          </ul>
        </div>
      ))}
      <div>
        <button onClick={prevPage} disabled={currentPage === 1}>
          Предыдущая страница
        </button>
        <button onClick={nextPage}>Следующая страница</button>
      </div>
    </div>
  );
};
