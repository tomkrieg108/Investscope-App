class TransactionDetailsView {
  #parentElement = document.querySelector(".transactions__detail");

  render(data, handlerOpenUpdateModal) {
    const html = `
      <div class="infobox">
        <div class="infobox__header">
          <h4 class="heading--4">transaction Details</h4>
          <div class="infobox__actions">
            <button class="btn modal-update-btn">Update</button>
            <button class="btn modal-delete-btn">Delete</button>
          </div>
        </div>
        <ul class="infobox__list">
          <li class="infobox__item">
            <div class="infobox__label">Transactiondate</div>
            <div class="infobox__value">${data.transDate}</div>
          </li>
          <li class="infobox__item">
            <div class="infobox__label">Stock Code</div>
            <div class="infobox__value">${data.stockCode}</div>
          </li>
          <li class="infobox__item">
            <div class="infobox__label">Company Name</div>
            <div class="infobox__value"></div>
          </li>
          <li class="infobox__item">
            <div class="infobox__label">shares Bought</div>
            <div class="infobox__value">${data.numShares}</div>
          </li>
          <li class="infobox__item">
            <div class="infobox__label">Buy Price</div>
            <div class="infobox__value">$${data.price}</div>
          </li>
          <li class="infobox__item">
            <div class="infobox__label">Brokerage</div>
            <div class="infobox__value">$${data.brokerage}</div>
          </li>
          <li class="infobox__item">
            <div class="infobox__label">Shares held Old</div>
            <div class="infobox__value"></div>
          </li>
          <li class="infobox__item">
            <div class="infobox__label">Shares Held New</div>
            <div class="infobox__value"></div>
          </li>
          <li class="infobox__item">
            <div class="infobox__label">Ave Buy Price Old</div>
            <div class="infobox__value"></div>
          </li>
          <li class="infobox__item">
            <div class="infobox__label">Ave Buy Price New</div>
            <div class="infobox__value"></div>
          </li>
        </ul>
      </div>
    `;

    this.#parentElement.innerHTML = "";
    this.#parentElement.insertAdjacentHTML("beforeend", html);
  }

  addHandlerOpenUpdateModal(handler, data) {
    const btnShowModal = this.#parentElement.querySelector(".modal-update-btn");
    btnShowModal.addEventListener("click", () => handler(data));
  }

  addHandlerDelete(handler, data) {
    const btnDelete = this.#parentElement.querySelector(".modal-delete-btn");
    btnDelete.addEventListener("click", () => handler(data));
  }
}

export default new TransactionDetailsView();
