import { useState, useEffect } from "react";
import axios from "axios";
import { authString } from "./../helpers/authString";
import { removeDuplicates } from "../helpers/removeDuplicates";
import { Spin } from "../components/Spin";
import { PaginatedItems } from "./Pogin";

const URL = "http://api.valantis.store:40000/";

export const TestTwo = ({ flag }) => {
  const [finalResult, setFinalResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let defaultFilter = {
    action: "get_ids",
  };
  let filterPrice = {
    action: "filter",
    params: {
      price: Number(flag.value),
    },
  };
  let filterBrand = {
    action: "filter",
    params: {
      brand: flag.value,
    },
  };
  let filterName = {
    action: "filter",
    params: {
      product: flag.value,
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
    setLoading(true);

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

        const requestData = {
          action: "get_items",
          params: { ids: extractedData },
        };

        const response2 = await axios.post(URL, requestData, {
          // Отправляем запрос на сервер
          headers: {
            "Content-Type": "application/json",
            "X-Auth": authString(),
          },
        });

        // Обрабатываем итоговый ответ от сервера и удаляем товар с одинаковыми id
        const finalResultFromServer = removeDuplicates(response2.data.result);
        // Устанавливаем итоговый результат в состояние компонента
        setFinalResult(finalResultFromServer);
        console.log(finalResult);

        setError(null); // Сбрасываем состояние ошибки, если оно было
      } catch (error) {
        // Обрабатываем ошибку, если возникла

        setError(error.message);
      } finally {
        if (error === null) {
          setLoading(false);
        }
        if (error !== null) {
          setLoading(true);
        }
      }
    };

    fetchData(); // Вызываем функцию fetchData при монтировании компонента
  }, [flagValue, error]);

  return (
    <>
      <div style={{ position: "relative" }}>
        {!loading ? (
          finalResult && (
            <PaginatedItems itemsPerPage={finalResult}></PaginatedItems>
          )
        ) : (
          <Spin />
        )}
      </div>
    </>
  );
};
