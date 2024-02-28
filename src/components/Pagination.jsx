import React, { useState, useEffect } from "react";
import st from "./../scss/pagination.module.scss";

export const Pagination = ({ usePagination }) => {
  const { setCurrentPageNumber, currentPageNumber } = usePagination;
  const [visiblePages, setVisiblePages] = useState([]);
  const [buttonActive, setButtonActive] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(1); // Состояние общего количества страниц

  setTimeout(() => {
    const pageCount = sessionStorage.getItem("currentPageNumber");
    // if (Number(pageCount)===0) pageCount = 1;
    setTotalPageCount(Number(pageCount));
  });

  useEffect(() => {
    const visiblePageCount = 9;
    const middleIndex = Math.floor(visiblePageCount / 2);
    let startPage = Math.max(currentPageNumber - middleIndex + 1, 1);
    const endPage = Math.min(startPage + visiblePageCount - 1, totalPageCount);

    const calculateVisiblePages = () => {
      let pages = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (pages.length === 0) {
        pages = [1];
        setButtonActive(true);
      }
      if (pages.length < 2) setButtonActive(true);
      if (pages.length > 1) setButtonActive(false);

      return pages;
    };

    setVisiblePages(calculateVisiblePages());
  }, [currentPageNumber, totalPageCount]);

  const handlePageClick = (pageNumber) => {
    setCurrentPageNumber(pageNumber);
  };

  const goToFirstPage = () => {
    setCurrentPageNumber(0);
  };

  const goToLastPage = () => {
    setCurrentPageNumber(totalPageCount - 1);
  };

  return (
    <div className={st.wrapper}>
      <div className={st.pagination}>
        {/* Кнопка "В начало" */}
        <div
          className={`${st.item} ${buttonActive ? st.buttonActive : ""}`}
          onClick={goToFirstPage}
        >
          {"<< First"}
        </div>
        {/* Номера страниц */}
        {visiblePages.map((pageNumber) => (
          <div
            id={pageNumber}
            key={pageNumber}
            className={`${st.item} ${
              pageNumber - 1 === currentPageNumber ? st.itemActive : ""
            }`}
            onClick={() => handlePageClick(pageNumber - 1)}
          >
            {pageNumber}
          </div>
        ))}
        {/* Кнопка "В конец" */}
        <div
          className={`${st.item} ${buttonActive ? st.buttonActive : ""}`}
          onClick={goToLastPage}
        >
          {"Last >>"}
        </div>
      </div>
    </div>
  );
};
