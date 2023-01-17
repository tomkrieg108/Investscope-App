class TransactionModalView {
  //The modal to display the transaction form
  #modal = document.querySelector(".create-update-modal");

  //Button on the modal to create / update a transaction
  #btnAdd = document.querySelector(".modal__btn");

  //Button on the modal to close the modal
  #btnCloseModal = document.querySelector(".btn__close-modal");

  //Document overlay visible when modal is showing
  #overlay = document.querySelector(".overlay");

  //List of stock codes to display in the form input - set by controller
  #stockList = [];

  constructor() {
    //Note: event handler to open the model is setup in transactionView.js and transactionDetail.js
    this.#btnCloseModal.addEventListener("click", this.closeModal.bind(this));
    this.#overlay.addEventListener("click", this.closeModal.bind(this));

    // document.addEventListener("keydown", function (e) {
    //   if (e.key === "Escape" && !this.#modal.classList.contains("hidden")) {
    //     closeModal();
    //   }
    // });
  }

  getFormData() {
    const formData = {
      transDate: this.#modal.querySelector(".form__input--date").value,
      stockCode: this.#modal.querySelector(".form__input--code").value,
      transType: this.#modal.querySelector(".form__input--type").value,
      numShares: this.#modal.querySelector(".form__input--amount").value,
      price: this.#modal.querySelector(".form__input--price").value,
      brokerage: this.#modal.querySelector(".form__input--brokerage").value,
    };
    return formData;
  }

  #setFormData(formData) {
    if (!formData) return;
    this.#modal.querySelector(".form__input--date").value = formData.transDate;
    this.#modal.querySelector(".form__input--code").value = formData.stockCode;
    this.#modal.querySelector(".form__input--type").value =
      formData.transType === 0 ? "Buy" : "Sell";
    this.#modal.querySelector(".form__input--amount").value =
      formData.numShares;
    this.#modal.querySelector(".form__input--price").value = formData.price;
    this.#modal.querySelector(".form__input--brokerage").value =
      formData.brokerage;
  }

  addHandlerModalAction(handler, transData = null) {
    this.#btnAdd.addEventListener("click", () => handler(transData));
  }

  removeHandlerModalAction(handler) {
    this.#btnAdd.removeEventListener("click", handler);
  }

  setStockCodeList(stockCodeList) {
    this.#stockList = stockCodeList;
  }

  //todo can use toggle instead of add/remove
  openModal(modalType, formData = null) {
    this.#modal.classList.remove("hidden");
    this.#overlay.classList.remove("hidden");
    const codeDropdown = this.#modal.querySelector(".form__input--code");
    codeDropdown.innerHTML = "";

    this.#stockList.forEach(function (el) {
      const markup = `<option value=${el}>${el}</option>`;
      codeDropdown.insertAdjacentHTML("beforeend", markup);
    });

    this.#modal.querySelector(".modal__title").textContent =
      modalType === "create" ? "New Transaction" : "Update Transaction";
    this.#btnAdd.textContent = modalType === "create" ? "Create New" : "Update";
    this.#setFormData(formData);
  }

  closeModal() {
    this.#modal.classList.add("hidden");
    this.#overlay.classList.add("hidden");
  }
}

export default new TransactionModalView();
