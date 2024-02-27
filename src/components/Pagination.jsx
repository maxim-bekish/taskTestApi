export const Pagination = ({ usePagination }) => {
  let { setCurrentPageNumber, currentPageNumber } = usePagination;
  const nextPage = () => {
    setCurrentPageNumber(currentPageNumber + 1);
  };

  const prevPage = () => {
    setCurrentPageNumber(currentPageNumber - 1);
  };
  const handlePage = (event) => {
    setCurrentPageNumber(event.target.textContent);
  };

  return (
    <div>
      <button onClick={prevPage} disabled={currentPageNumber === 1}>
        Предыдущая страница
      </button>
      <ul>
        {[...Array(Number(sessionStorage.getItem("currentPageNumber")))].map(
          (_, index) => (
            <li onClick={(event) => handlePage(event)} key={`key${index + 1}`}>
              {index + 1}{" "}
            </li>
          )
        )}
      </ul>
      <button onClick={nextPage}>Следующая страница</button>
    </div>
  );
};
