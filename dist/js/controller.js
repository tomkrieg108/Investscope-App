import transactionsModel from "./models/transactionsModel.js";
import stocksModel from "./models/stocksModel.js";

import navbarView from "./views/navbarView.js";
import portfolioView from "./views/portfolioView.js";
import transactionsView from "./views/transactionsView.js";
import transactionDetailsView from "./views/transactionDetailsView.js";
import transactionModalView from "./views/transactionModalView.js";
import stocksView from "./views/stocksView.js";

const controlNavLinkClicked = function (link) {
  if (link === "transactions") {
    loadTransactionsPage(1);
  }
  if (link === "portfolio") {
    portfolioView.render(transactionsModel.state.portfolio);
  }
  if (link === "stocks") {
    stocksView.render(stocksModel.state.stockList);
  }
};

const loadTransactionsPage = function (page) {
  transactionsView.render(
    transactionsModel.state.filteredTransactionDetailsList,
    page,
    100,
    transactionsModel.state.transactionSummary
  );
  transactionsView.addHandlerApplyFilter(controlFilterTransactions);
  transactionsView.addHandlerPaginationPageClicked(
    controlUpdateTransactionPage
  );
};

const controlInitTransactionsContent = async function () {
  try {
    // Don't think this function needs to be async
    const data = await transactionsModel.read();
    //render data in the view
    transactionsModel.processTransactions(
      transactionsModel.state.transactionList
    );
    loadTransactionsPage(1);
    // transactionsView.render(
    //   transactionsModel.state.transactionDetailsList,
    //   1,
    //   100
    // );
    // transactionsView.addHandlerApplyFilter(controlFilterTransactions);
    // transactionsView.addHandlerPaginationPageClicked(
    //   controlUpdateTransactionPage
    // );
  } catch (err) {
    transactionsView.renderError();
  }
};

const controlFilterTransactions = function () {
  const filterData = transactionsView.getFilterData();
  transactionsModel.filterTransactionDetailList(filterData);
  loadTransactionsPage(1);
  // console.log("Filter params: ", filterData);
  // transactionsView.render(
  //   transactionsModel.state.filteredTransactionDetailsList,
  //   1,
  //   100
  // );
};

const controlUpdateTransactionPage = function (pageNumber) {
  // transactionsView.render(
  //   transactionsModel.state.transactionDetailsList,
  //   pageNumber,
  //   100,
  //   transactionsModel.state.transactionSummary
  // );
  loadTransactionsPage(pageNumber);
};

const controlOpenCreateModal = function () {
  // console.log("Create Model opened.");
  transactionModalView.openModal("create");
  transactionModalView.addHandlerModalAction(controlCreateTransaction);
};

const controlOpenUpdateModal = function (transData) {
  // console.log("Update opened. trans data:", transData);
  transactionModalView.openModal("update", transData);
  transactionModalView.addHandlerModalAction(
    controlUpdateTransaction,
    transData
  );
};

const getFormData = function () {
  const formData = transactionModalView.getFormData();

  const data = {
    userId: 1,
    stockId: stocksModel.getStockIDFromCode(formData.stockCode),
    numShares: formData.numShares,
    price: formData.price,
    transType: formData.transType === "Buy" ? 0 : 1,
    brokerage: formData.brokerage,
    comment: "default comment",
    transDate: formData.transDate,
  };
  return data;
};

const controlUpdateTransaction = async function (transData) {
  const data = getFormData();
  // console.log("controlUpdateTransaction() data:", data);
  // console.log("trans id to update:", transData.id);

  try {
    const response = await transactionsModel.update(data, transData.id);
    // console.log("update trans response: ", response);

    transactionModalView.removeHandlerModalAction(controlUpdateTransaction);
    transactionModalView.closeModal();
    const newData = await transactionsModel.read();
    transactionsView.render(newData);
  } catch (err) {}
};

const controlCreateTransaction = async function () {
  // console.log("controlCreateTransaction called");
  const data = getFormData();
  // console.log("controlCreateTransaction() data:", data);
  try {
    const response = await transactionsModel.create(data);
    // console.log("create trans response: ", response);

    transactionModalView.removeHandlerModalAction(controlCreateTransaction);
    transactionModalView.closeModal();
    const newData = await transactionsModel.read();
    transactionsView.render(newData);
  } catch (err) {}
};

const controlDeleteTransaction = async function (transData) {
  // console.log("controlDeleteTransaction() data:", transData);
  try {
    const response = await transactionsModel.delete(transData.id);
    //console.log("delete trans response: ", response);
    const newData = await transactionsModel.read();
    transactionsView.render(newData);
  } catch (err) {}
};

const readStockList = async function () {
  try {
    // todo - these can be done in parallel along with reading the transaction data
    //don't need to save in a variable - they are saved in the state obj in model
    await stocksModel.read();
    // await stocksModel.readSectors();
    // await stocksModel.readRegistries();

    //render a spinner while waiting for data

    // console.log("registries from state: ", stocksModel.state.registryList);
    // console.log("sectors from state: ", stocksModel.state.sectorList);
    console.log("stock list: ", stocksModel.state.stockList);

    transactionModalView.setStockCodeList(stocksModel.getStockCodeList());
  } catch (err) {
    //render error
    transactionsView.renderError();
  }
};

const init = function () {
  navbarView.render();
  navbarView.addHandlerLinkClicked(controlNavLinkClicked);

  transactionsView.addHandlerInit(controlInitTransactionsContent);
  transactionsView.addHandlerOpenCreateModal(controlOpenCreateModal);

  readStockList();
};

init();
