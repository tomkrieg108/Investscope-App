class NavbarView {
  #mainContentElement = document.querySelector(".main-content");
  #parentElement = document.querySelector(".nav");

  render() {
    const html = `
    <img src="" alt="LOGO" class="nav__logo" />
    <ul class="nav__links">
      <li class="nav__item portfolio"><a href="#">Portfolio</a></li>
      <li class="nav__item transactions"><a href="#">Transactions</a></li>
      <li class="nav__item stocks"><a href="#">Stocks</a></li>
      <li class="btn nav__btn"><a href="#">Log Out</a></li>
    </ul>
    `;
    this.#parentElement.innerHTML = "";
    this.#parentElement.insertAdjacentHTML("afterbegin", html);
  }

  addHandlerLinkClicked(handler) {
    this.#parentElement
      .querySelector(".portfolio")
      .addEventListener("click", function (e) {
        e.preventDefault();
        handler("portfolio");
      });
    this.#parentElement
      .querySelector(".transactions")
      .addEventListener("click", function (e) {
        e.preventDefault();
        handler("transactions");
      });
    this.#parentElement
      .querySelector(".stocks")
      .addEventListener("click", function (e) {
        e.preventDefault();
        handler("stocks");
      });
  }

  clearMainContent() {
    this.#mainContentElement.innerHTML = "";
  }

  // render() {
  //   this.#generateMarkup();
  // }
}

export default new NavbarView();
