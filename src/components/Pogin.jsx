import ReactPaginate from "react-paginate";
import { useState } from "react";

function Items({ currentItems }) {
  return (
    <>
      {currentItems &&
        currentItems.map((el, index) => (
          <div key={`div-${index}`}>
            <ul key={`ui-${index}`}>
              <li key={`li-brand-${index}`}>{el.brand ? el.brand : "null"}</li>
              <li key={`li-price-${index}`}>{el.price}</li>
              <li key={`li-product-${index}`}>{el.product}</li>
              <li key={`li-id-${index}`}>{el.id}</li>
            </ul>
          </div>
        ))}
    </>
  );
}


const xxx = (isNext) => {
  // попробовать реализовать загрузку 
  console.log(isNext.event.target.getAttribute('rel'));
};

export const PaginatedItems = ({ itemsPerPage }) => {
  const num = 50;

  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + num;

  const currentItems = itemsPerPage.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(itemsPerPage.length / num);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * num) % itemsPerPage.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <Items currentItems={currentItems} />
      <ReactPaginate
        breakLabel="..."
        onClick={(isNext) => xxx(isNext)}
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
      />
    </>
  );
};
