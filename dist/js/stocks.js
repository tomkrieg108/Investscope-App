console.log("stocks.js");

const tableStocks = document.querySelector(".table--stocks");
// const btnNewStock = document.querySelector(".btn__new-stock");

// Open modal --Repeated from transactions.js!
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn__close-modal");
const btnOpenModal = document.querySelector(".btn__open-modal");

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnOpenModal.addEventListener("click", openModal);
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// -----------------------

// btnNewStock.addEventListener("click", function (e) {
//   addStock();
// });

// $this->db->bind(':sector_id', htmlspecialchars(strip_tags($data->sector_id)));
// $this->db->bind(':registry_id', htmlspecialchars(strip_tags($data->registry_id)));
// $this->db->bind(':stock_code', htmlspecialchars(strip_tags($data->stock_code)));
// $this->db->bind(':company_name', htmlspecialchars(strip_tags($data->company_name)));
// $this->db->bind(':url', htmlspecialchars(strip_tags($data->url)));
// $this->db->bind(':risk_rating', htmlspecialchars(strip_tags($data->risk_rating)));
// $this->db->bind(':max_weight', htmlspecialchars(strip_tags($data->max_weight)));
// $this->db->bind(':buy_below', htmlspecialchars(strip_tags($data->buy_below)));
// $this->db->bind(':sell_above', htmlspecialchars(strip_tags($data->sell_above)));

const newData = {
  sector_id: "1",
  registry_id: "2",
  stock_code: "ZZZ",
  company_name: "Zed Inc",
  url: "https:\\www.zzzz.com",
  risk_rating: "2",
  max_weight: "4",
  buy_below: "12.50",
  sell_above: "18.00",
};

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newData),
};

const addStock = async function () {
  console.log("Add stock");

  try {
    const data = await fetch(
      "http://localhost/api-invtrack/api/stocks/create",
      options
    );
    if (!data.ok) throw new Error("Problem adding new stock");

    const res = await data.json();
    console.log(res);
    return res;
  } catch (err) {
    console.error(`${err} 💥`);
  } finally {
  }
};

const renderRow = function (data) {
  let html = `
    <tr class="table__row table__row--data">
      <td>${data.stockCode}</td>
      <td>${data.companyCame}</td>
      <td>${data.sectorCame}</td>
      <td>$${data.maxWeight}</td>
      <td>${data.riskRating}</td>
      <td>$${data.buyBelow}</td>
      <td>$${data.sellAbove}</td>
    </tr>
  `;
  tableStocks.insertAdjacentHTML("beforeend", html);
};

let config = {
  headers: {
    Accept: "application/json", //or text/json
  },
};

// const getStockData = function () {
//   return fetch("http://localhost/api-invtrack/api/stocks/read")
//     .then(function (response) {
//       if (!response.ok) throw new Error("Problem fetching stocks data");
//       return response.json();
//     })
//     .then(function (data) {
//       return data;
//     })
//     .catch((err) => {
//       console.log(`${err} 💥💥💥`);
//     })
//     .finally(() => {});
// };

// const renderStockData = function () {
//   getStockData().then((data) => {
//     console.log("data: ", data);
//   });
// };

// renderStockData();

const getStockData = async function () {
  try {
    const data = await fetch("http://localhost/api-invtrack/api/stocks/read");
    if (!data.ok) throw new Error("Problem fetching stocks data");

    const jsonData = await data.json();
    // if(jsonData.err())
    return jsonData;
  } catch (err) {
    console.error(`${err} 💥`);
  } finally {
  }
};

const renderStockData = async function () {
  let stockData2 = await getStockData();
  // console.log("stock data 2: ", stockData2);

  stockData2.forEach((element) => {
    console.log(element);
    renderRow(element);
  });
};

renderStockData();
