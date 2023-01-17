class TransactionsView {
  #parentElement = document.querySelector(".main-content .container");
  // #ntableElement = document.querySelector(".ntable");

  #errorMessage = "Error loading transactions";

  addHandlerInit(handler) {
    // This fires when html is loaded and DOM tree created
    // ["DOMContentLoaded"].forEach((ev) =>
    //   document.addEventListener(ev, handler)
    // );

    //this is fired when the whole page is loaded including all dependent resources
    // ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
    ["load"].forEach((ev) => window.addEventListener(ev, handler));
  }

  addHandlerApplyFilter(handler) {
    // When the filter 'apply' button is clicked, handler is called
    const filterApplyEl =
      this.#parentElement.querySelector(".form--filter .btn");
    filterApplyEl.addEventListener("click", function (e) {
      e.preventDefault();
      //could get the form data here but need to call bind() somehow?
      handler();
    });
  }

  addHandlerPaginationPageClicked(handler) {
    //when one of the pagination buttons is clicked - handler is called
    const paginationElement = this.#parentElement.querySelector(".pagination");
    console.log("pagination element: ", paginationElement);
    paginationElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn-page-ref");
      console.log(btn.dataset.page);
      if (btn !== null) handler(parseInt(btn.dataset.page));
    });
  }

  // addHandlerRowSelected(handler) {
  //   const tableElement = this.#parentElement.querySelector(".ntable");
  //   tableElement.addEventListener("click", function (e) {
  //     const row = e.target.closest(".ntable-row");
  //     row.classList.toggle("active");
  //     console.log(row);
  //   });
  // }

  getFilterData() {
    let startDate = this.#parentElement.querySelector(
      ".form--filter .start-date"
    ).value;
    startDate = startDate === "" ? null : new Date(startDate);
    let endDate = this.#parentElement.querySelector(
      ".form--filter .end-date"
    ).value;
    endDate = endDate === "" ? null : new Date(endDate);
    const stockCode = this.#parentElement.querySelector(
      ".form--filter .stock-code"
    ).value;

    const filterData = {
      startDate,
      endDate,
      stockCode,
    };
    return filterData;
  }

  addHandlerOpenCreateModal(handler) {
    const btnShowModalEl =
      this.#parentElement.querySelector(".transbar__new-btn");
    btnShowModalEl.addEventListener("click", handler);
  }

  renderFilterForm() {
    let html = "";
    html = `
    <div class="transbar">
    <div class="transbar__filter">
      <h4 class="transbar__heading">Filter By:</h4>
      <form class="form form--filter">
        <input
          type="date"
          placeholder="Start Date"
          class="form__input form__input--filter start-date"
        />
        <input
          type="date"
          placeholder="End Date"
          class="form__input form__input--filter end-date"
        />
        <input
          type="text"
          placeholder="Stock code"
          class="form__input form__input--filter stock-code"
          id="stock-code-id"
        />
        <button id="btn-filter" class="btn">Apply</button>
        <!-- <input
          type="text"
          placeholder="Type (b/s)"
          class="form__input form__input--filter"
        /> -->
      </form>
    </div>

    <div class="transbar__actions">
      <button class="btn transbar__new-btn">New</button>
      <button class="btn transbar__import-btn">Import</button>
    </div>
  </div>
    `;
    this.#parentElement.insertAdjacentHTML("beforeend", html);
  }

  renderSummary(summaryData) {
    let html = `
    <div class="trans-summary">
          <div class="label">Tot Transactions</div>
          <div class="value">${summaryData.totTransactions}</div>
          <div class="label">Tot Buys</div>
          <div class="value">${summaryData.buyCount}</div>
          <div class="label">Tot Sells</div>
          <div class="value">c</div>

          <div class="label">Tot Buy Amt</div>
          <div class="value">${summaryData.totBuyAmount}</div>
          <div class="label">Tot Sell Amt</div>
          <div class="value">${summaryData.totSellAmount}</div>
          <div class="label">Profit/Loss</div>
          <div class="value">${summaryData.profitLoss}</div>

          <div class="label">Ave Buy Amt</div>
          <div class="value">${summaryData.aveBuyAmount}</div>
          <div class="label">Ave Sell Amt</div>
          <div class="value">${summaryData.aveSellAmount}</div>
          <div class="label">Ave Holding Time</div>
          <div class="value">${summaryData.aveHoldingTime}</div>
        </div>
    `;

    this.#parentElement.insertAdjacentHTML("beforeend", html);
  }

  renderPagination(data, pageNumber, recordsPerPage) {
    //data is a transactionDetailsList
    const paginationElement = this.#parentElement.querySelector(".pagination");
    const pageCount = Math.ceil(data.length / recordsPerPage);
    let html = "";

    //left arrow
    html = `
    <div class="action-bar">
      <div class="pagination">
        <div class="btn-page btn-left">
          <i class="fa-solid fa-chevron-left"></i>
        </div>
    `;
    for (let i = 1; i <= pageCount; i++) {
      const active = i === pageNumber ? "active" : "";
      html = html.concat(
        `<div class="btn-page btn-page-ref ${active}" data-page=${i}>${i}</div>`
      );
    }

    html = html.concat(
      `   <div class="btn-page btn-right">
            <i class="fa-solid fa-chevron-right"></i>
          </div>
        </div>
        <div class="buttons">buttons</div>
      </div>
      `
    );

    this.#parentElement.insertAdjacentHTML("beforeend", html);

    // paginationElement.innerHTML = "";
    // paginationElement.insertAdjacentHTML("afterbegin", html);

    // console.log(paginationElement);
    // console.log("page count: ", pageCount);
  }

  renderTableHeading() {
    // table header
    const html = `
    <div class="ntable">
      <div class="ntable-heading">
        <div class="ntable-heading-el">Trans #</div>
        <div class="ntable-heading-el">date</div>
        <div class="ntable-heading-el">code</div>
        <div class="ntable-heading-el">type</div>
        <div class="ntable-heading-el">shares</div>
        <div class="ntable-heading-el">price</div>
      </div>
    </div>
    `;
    this.#parentElement.insertAdjacentHTML("beforeend", html);
  }

  #renderRow(transactionDetail) {
    const type =
      transactionDetail.transactionData.transType === 0 ? "Buy" : "Sell";
    const profitLoss = type === "Sell" ? transactionDetail.profitLoss : "N/A";

    let fifoSales = "";
    if (type === "Sell") {
      transactionDetail.fifoSales.forEach(function (el) {
        fifoSales = fifoSales.concat(
          `<p>Sell ${el.shareCount}, purchased ${el.purchaseDate} at price ${el.purchasePrice},  P/L=${el.profitLoss}, days held: ${el.daysHeld}</p>`
        );
      });
    }

    let ntableElement = this.#parentElement.querySelector(".ntable");

    let html = `
      <div class="ntable-row" data-id=${transactionDetail.transactionData.transactionId}>
        <div class="ntable-row-data">
          <div class="ntable-row-data-el">${transactionDetail.transNumber}</div>
          <div class="ntable-row-data-el">${transactionDetail.transactionData.transDate}</div>
          <div class="ntable-row-data-el">${transactionDetail.transactionData.stockCode}</div>
          <div class="ntable-row-data-el">${type}</div>
          <div class="ntable-row-data-el">${transactionDetail.transactionData.numShares}</div>
          <div class="ntable-row-data-el">${transactionDetail.transactionData.price}</div>
        </div>

        <div class="ntable-row-detail">
          <p class="description">
            ${type} ${transactionDetail.transactionData.numShares} shares in ${transactionDetail.transactionData.companyName}, sector: ${transactionDetail.transactionData.sectorName} on ${transactionDetail.transactionData.transDate} at price:  ${transactionDetail.transactionData.price}.
          </p>
          <div class="buttons">
            <button class="btn modal-update-btn">Update</button>
            <button class="btn modal-delete-btn">Delete</button>
          </div>
          <div class="label">Consideration</div>
          <div class="value">${transactionDetail.dollarValue}</div>
          <div class="label">Brokerage</div>
          <div class="value">${transactionDetail.transactionData.brokerage}</div>
          <div class="label">Num Shares</div>
          <div class="value">${transactionDetail.transactionData.numShares}</div>
          <div class="label">New Share Count</div>
          <div class="value">${transactionDetail.shareCount}</div>
          <div class="label">New Ave Buy Price</div>
          <div class="value">${transactionDetail.aveBuyPrice}</div>
          <div class="label">Buy Count</div>
          <div class="value">${transactionDetail.buyCount}</div>
          <div class="label">Sell Count</div>
          <div class="value">${transactionDetail.buyCount}</div>
          <div class="label">P/L</div>
          <div class="value">${profitLoss}</div>
          <div class="fifosales">
            ${fifoSales}
          </div>
          <div class="comment">
          </div>
        </div>
      </div>
    `;
    ntableElement.insertAdjacentHTML("beforeend", html);
  }

  render(data, pageNumber, recordsPerPage, summaryData) {
    // this.#ntableElement.innerHTML = "";
    this.#parentElement.innerHTML = "";
    const pageCount = Math.ceil(data.length / recordsPerPage);
    if (pageNumber > pageCount) return;

    this.renderFilterForm();
    this.renderSummary(summaryData);
    this.renderPagination(data, pageNumber, recordsPerPage);
    this.renderTableHeading();

    const startRecord = (pageNumber - 1) * recordsPerPage;
    const endRecord = pageNumber * recordsPerPage - 1;
    for (let i = startRecord; i <= endRecord; i++) {
      if (i === data.length) break;
      this.#renderRow(data[i]);
    }
    let ntableElement = this.#parentElement.querySelector(".ntable");
    ntableElement.addEventListener("click", function (e) {
      const row = e.target.closest(".ntable-row");
      row.classList.toggle("active");
    });
  }

  renderSpinner() {}

  renderError(message = this.#errorMessage) {}
}

export default new TransactionsView();
