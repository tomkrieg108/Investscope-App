class PortfolioView {
  #parentElement = document.querySelector(".main-content .container");

  renderTableHeading() {
    // table header
    const html = `
    <div class="ntable">
      <div class="ntable-heading">
        <div class="ntable-heading-el">#</div>
        <div class="ntable-heading-el">Code</div>
        <div class="ntable-heading-el">Shares</div>
        <div class="ntable-heading-el">Ave Price</div>
        <div class="ntable-heading-el">Cost Base</div>
      </div>
    </div>
    `;
    this.#parentElement.insertAdjacentHTML("beforeend", html);
  }

  renderTableRow(portfolioEntry) {
    let html = `
      <div class="ntable-row">
        <div class="ntable-row-data">
          <div class="ntable-row-data-el"></div>
          <div class="ntable-row-data-el">${portfolioEntry.stockCode}</div>
          <div class="ntable-row-data-el">${portfolioEntry.shareCount}</div>
          <div class="ntable-row-data-el">${portfolioEntry.aveBuyPrice}</div>
          <div class="ntable-row-data-el">${portfolioEntry.costBase}</div>
        </div>
      </div>`;

    let tableElement = this.#parentElement.querySelector(".ntable");
    tableElement.insertAdjacentHTML("beforeend", html);
  }

  render(data) {
    this.#parentElement.innerHTML = "";
    this.renderTableHeading();
    data.forEach((entry) => this.renderTableRow(entry));
  }
}

export default new PortfolioView();
