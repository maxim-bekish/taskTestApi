import { useState, useEffect } from "react";
import axios from "axios";
import { authString } from "./../helpers/authString";
import { removeDuplicates } from "../helpers/removeDuplicates";
import { Spin } from "../components/Spin";
import { NumPogin } from "./NumPogin";

const URL = "http://api.valantis.store:40000/";

export const TestTwo = ({ flag }) => {
  const [finalResult, setFinalResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorView, setErrorView] = useState(null);
  const [pagin, setPagin] = useState(0);
  const [arrayData, setArrayData] = useState([]);

  const valueSee = 50;
  let defaultFilter = {
    action: "get_ids",
    params: {
      offset: 0,
      limit: 50,
    },
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
    setError(null); // Сбрасываем состояние ошибки, если оно было
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
        // arrayWWW(extractedData);

        sessionStorage.setItem(
          "pagin",
          Math.ceil(extractedData.length / valueSee)
        );

        // console.log(extractedData);
        setArrayData(extractedData);
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

    fetchData();

    // Вызываем функцию fetchData при монтировании компонента
  }, [flagValue, error]);
  useEffect(() => {
    setLoading(true);
    async function qwe123() {
      // valueSee сколько отображать на странице
      // pagin число нажатой пагинации
      const y = pagin * valueSee;
      const newArr = arrayData.slice(y, y + valueSee);
      try {
        const response2 = await axios.post(
          URL,
          {
            action: "get_items",
            params: { ids: newArr },
          },
          {
            // Отправляем запрос на сервер
            headers: {
              "Content-Type": "application/json",
              "X-Auth": authString(),
            },
          }
        );

        // Обрабатываем итоговый ответ от сервера и удаляем товар с одинаковыми id
        const finalResultFromServer = removeDuplicates(response2.data.result);
        // Устанавливаем итоговый результат в состояние компонента
        setFinalResult(finalResultFromServer);
      } catch (error) {
        setErrorView(error.message);
      } finally {
        if (error === null) {
          setLoading(false);
        }
        if (error !== null) {
          setLoading(true);
        }
      }

      setErrorView(null); // Сбрасываем состояние ошибки, если оно было
    }
    if (arrayData.length > 0) qwe123();
  }, [pagin, arrayData, errorView]);

  return (
    <>
      <div style={{ position: "relative" }}>
        {!loading ? (
          finalResult &&
          finalResult.map((el, index) => (
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
        <NumPogin usePagin={{ setPagin, pagin }} />
      </div>
    </>
  );
};
