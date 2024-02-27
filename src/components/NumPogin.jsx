export const NumPogin = ({ usePagin }) => {

  let { setPagin, pagin } = usePagin;
  const nextPage = () => {
    setPagin(pagin + 1);
  };

  const prevPage = () => {
    setPagin(pagin - 1);
  };
  const handlePage = (event) => {
    setPagin(event.target.textContent);
  };

  return (
    <div>
      <button onClick={prevPage} disabled={pagin === 1}>
        Предыдущая страница
      </button>
      <ul>
        {[...Array(Number(sessionStorage.getItem("pagin")))].map((_, index) => (
          <li onClick={(event) => handlePage(event)} key={`key${index + 1}`}>
            {index + 1}{" "}
          </li>
        ))}
      </ul>
      <button onClick={nextPage}>Следующая страница</button>
    </div>
  );
};
