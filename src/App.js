import { Test } from "./components/Test";

const App = () => {


  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <button>Сбросить фильтр</button>
            </li>
            <li>
              <button>По названию</button>
            </li>
            <li>
              <button>по цене</button>
            </li>
            <li>
              <button>По бренду</button>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <h2>Список товара</h2>
        <Test ></Test>
      </main>
    </>
  );
};

export default App;
