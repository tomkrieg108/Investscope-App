class StocksView {
  #parentElement = document.querySelector(".main-content .container");

  #renderRow(data) {}

  renderTableHeading() {
    // table header
    const html = `
    <div class="ntable">
      <div class="ntable-heading">
        <div class="ntable-heading-el">#</div>
        <div class="ntable-heading-el">Code</div>
        <div class="ntable-heading-el">Company</div>
        <div class="ntable-heading-el">Buy Below</div>
        <div class="ntable-heading-el">Sell Above</div>
        <div class="ntable-heading-el">Max Weight</div>
      </div>
    </div>
    `;
    this.#parentElement.insertAdjacentHTML("beforeend", html);
  }

  renderTableRow(stockEntry) {
    let html = `
      <div class="ntable-row">
        <div class="ntable-row-data">
          <div class="ntable-row-data-el"></div>
          <div class="ntable-row-data-el">${stockEntry.stockCode}</div>
          <div class="ntable-row-data-el">${stockEntry.companyName}</div>
          <div class="ntable-row-data-el">${stockEntry.buyBelow}</div>
          <div class="ntable-row-data-el">${stockEntry.sellAbove}</div>
          <div class="ntable-row-data-el">${stockEntry.maxWeight}</div>
        </div>
      </div>`;

    let tableElement = this.#parentElement.querySelector(".ntable");
    tableElement.insertAdjacentHTML("beforeend", html);
  }

  render(stockList) {
    this.#parentElement.innerHTML = "";
    this.renderTableHeading();
    stockList.forEach((entry) => this.renderTableRow(entry));
  }

  renderSpinner() {}

  // renderError(message = this.#errorMessage) {}
}

export default new StocksView();
