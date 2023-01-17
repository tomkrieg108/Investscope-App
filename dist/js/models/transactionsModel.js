import { API_URL } from "../config.js";
import { getJSON, sendJSON, updateJSON, deleteJSON } from "../helpers.js";

class TransactionSummary {
  totTransactions = 0;
  buyCount = 0;
  sellCount = 0;
  totBuyAmount = 0;
  totSellAmount = 0;
  totBrokerage = 0;
  profitLoss = 0;
  aveHoldingTime = 0;
  weightedAveHoldingTime = 0;
  aveBuyAmount = 0;
  aveSellAmount = 0;
}

class TransactionDetail {
  transactionData = {};
  transNumber = 0;
  businessName = "";
  buyCount = 0;
  sellCount = 0;
  dollarValue = 0; //excluding brokerage
  shareCount = 0;
  aveBuyPrice = 0;
  profitLoss = 0; //only applies to sells, based on ave buy price
  fifoSales = [];
  date = null;

  constructor(transaction) {
    this.transactionData = transaction;
  }
}

class FifoElement {
  shareCount = 0;
  purchasePrice = 0.0;
  purchaseDate = null;
  daysHeld = 0;
  profitLoss = 0;

  constructor(shareCount, price, purchaseDate) {
    this.shareCount = shareCount;
    this.purchasePrice = price;
    this.purchaseDate = new Date(purchaseDate);
  }

  calculateDaysHeld(saleDate) {
    this.daysHeld =
      (new Date(saleDate).getTime() - this.purchaseDate.getTime()) /
      (1000 * 3600 * 24);
    this.daysHeld = Math.ceil(this.daysHeld);
  }

  calculateProfitLoss(salePrice) {
    this.profitLoss = (salePrice - this.purchasePrice) * this.shareCount;
  }
}

class PortfolioEntry {
  stockCode = "";
  businessName = "";
  shareCount = 0;
  aveBuyPrice = 0.0;
  costBase = 0;
  constructor(stockCode, businessName, shareCount, aveBuyPrice) {
    this.stockCode = stockCode;
    this.businessName = businessName;
    this.shareCount = shareCount;
    this.aveBuyPrice = aveBuyPrice;
    this.costBase = this.aveBuyPrice * this.shareCount;
  }
}

class TransactionModel {
  state = {
    transactionList: [],
    transactionDetailsList: [],
    filteredTransactionDetailsList: [],
    transactionSummary: [],
    portfolio: [],
  };

  constructor() {}

  processTransactions(data) {
    const myMap = new Map();
    data.forEach(function (el) {
      if (!myMap.has(el.stockId)) {
        let arr = [new TransactionDetail(el)];
        //myMap.set(el.stockCode, arr);
        myMap.set(el.stockId, arr);
      } else {
        let arr = myMap.get(el.stockId);
        arr.unshift(new TransactionDetail(el)); //insertion at front of array
        //myMap.set(el.stockCode, arr);
        myMap.set(el.stockId, arr);
      }
    });

    this.state.transMap = myMap;
    this.state.transMap.forEach(this.calcTransactionDetails);
    this.setupTransactionDetailList();
    this.calcTransactionSummary();
    this.calculatePortfolio();
    //this.state.transMap = Array.from(myMap).sort();

    console.log("Transaction Summary: ", this.state.transactionSummary);
    console.log(this.state.transactionList);
    console.log(this.state.transMap);
    console.log(this.state.portfolio);
    console.log("transactionDetailsList: ", this.state.transactionDetailsList);
  }

  setupTransactionDetailList() {
    //convert the transMap into a single array containin only TransactionDetail objects sorted by date
    let transactionDetailsList = [];
    this.state.transMap.forEach(function (val, key, map) {
      //val contains an array of Transaction Detail objects
      transactionDetailsList = transactionDetailsList.concat(val);
    });
    //sort by date
    transactionDetailsList.sort((a, b) => b.date.getTime() - a.date.getTime());
    //set transaction number
    let num = transactionDetailsList.length;
    transactionDetailsList.forEach(function (val) {
      val.transNumber = num;
      num--;
    });
    this.state.transactionDetailsList = transactionDetailsList;
    this.state.filteredTransactionDetailsList = transactionDetailsList;
  }

  filterTransactionDetailList(filterData) {
    const filteredList = this.state.transactionDetailsList.filter(function (
      el
    ) {
      let result = true;
      if (filterData.startDate !== null) {
        result = result && el.date >= filterData.startDate;
      }
      if (filterData.endDate !== null) {
        result = result && el.date <= filterData.endDate;
      }
      if (filterData.stockCode !== "") {
        result = result && el.transactionData.stockCode == filterData.stockCode;
      }
      return result;
    });
    console.log("Filtered list = ", filteredList);
    this.state.filteredTransactionDetailsList = filteredList;
  }

  calcTransactionDetails(val, key, map) {
    let cummulative = {
      shareCount: 0,
      buyCount: 0,
      sellCount: 0,
      aveBuyPrice: 0.0,
    };

    //for calculating fifoSales data.  Buys => push element to the end, Sells => remove from beginning
    let fifoQueue = [];

    val.forEach(function (transDetail) {
      transDetail.date = new Date(transDetail.transactionData.transDate);
      const shares = transDetail.transactionData.numShares;
      const dollarValue = shares * transDetail.transactionData.price;
      const brokerage = transDetail.transactionData.brokerage;
      if (transDetail.transactionData.transType === 0) {
        //buy
        cummulative.aveBuyPrice =
          (cummulative.aveBuyPrice * cummulative.shareCount +
            dollarValue +
            brokerage) /
          (cummulative.shareCount + shares);

        cummulative.shareCount += shares;
        cummulative.buyCount++;

        fifoQueue.push(
          new FifoElement(
            shares,
            transDetail.transactionData.price, //purchasePrice
            transDetail.transactionData.transDate //purchaseDate
          )
        );
      } else {
        //sell
        cummulative.shareCount -= shares;
        cummulative.sellCount++;
        transDetail.profitLoss =
          shares *
            (transDetail.transactionData.price - cummulative.aveBuyPrice) -
          brokerage;

        //update fifo queue
        let sharesRemaining = shares;
        //debugger;
        while (sharesRemaining > 0) {
          let shareParcel =
            fifoQueue[0].shareCount >= sharesRemaining
              ? sharesRemaining
              : fifoQueue[0].shareCount;
          let fifoSale = new FifoElement(
            shareParcel,
            fifoQueue[0].purchasePrice,
            fifoQueue[0].purchaseDate
          );
          fifoSale.calculateDaysHeld(transDetail.transactionData.transDate);
          fifoSale.calculateProfitLoss(transDetail.transactionData.price);
          transDetail.fifoSales.push(fifoSale);
          if (fifoQueue[0].shareCount >= sharesRemaining) {
            //debugger;
            fifoQueue[0].shareCount -= sharesRemaining;
            sharesRemaining = 0;
          } else {
            sharesRemaining -= fifoQueue[0].shareCount;
            fifoQueue[0].shareCount = 0;
            fifoQueue.splice(0, 1); //delete front of queue
          }
        }
      }
      transDetail.buyCount = cummulative.buyCount;
      transDetail.sellCount = cummulative.sellCount;
      transDetail.shareCount = cummulative.shareCount;
      transDetail.aveBuyPrice = cummulative.aveBuyPrice;
      transDetail.dollarValue = dollarValue;
    });
  }

  calcTransactionSummary() {
    const transactionSummary = new TransactionSummary();
    let totDaysHeld = 0;
    let totSellParcels = 0;

    this.state.transactionDetailsList.forEach(function (transDetail) {
      const shares = transDetail.transactionData.numShares;
      const dollarValue = shares * transDetail.transactionData.price;
      const brokerage = transDetail.transactionData.brokerage;
      transactionSummary.totBrokerage += brokerage;
      transactionSummary.totTransactions++;
      if (transDetail.transactionData.transType === 0) {
        //buy
        transactionSummary.buyCount++;
        transactionSummary.totBuyAmount += dollarValue;
      } else {
        //sell
        transactionSummary.sellCount++;
        transactionSummary.totSellAmount += dollarValue;
        transactionSummary.profitLoss += transDetail.profitLoss;
        transDetail.fifoSales.forEach(function (el) {
          totSellParcels++;
          totDaysHeld += el.daysHeld;
        });
      }
    });
    transactionSummary.aveBuyAmount =
      transactionSummary.totBuyAmount / transactionSummary.buyCount;
    transactionSummary.aveSellAmount =
      transactionSummary.totSellAmount / transactionSummary.sellCount;
    transactionSummary.aveHoldingTime = totDaysHeld / totSellParcels;

    this.state.transactionSummary = transactionSummary;
  }

  calculatePortfolio() {
    let portfolio = [];
    this.state.transMap.forEach(function (val, key, map) {
      //key = stock code, val = array of TransactionDetail objects.
      //want the last element in the array to get current portfolio
      const lastTrans = val[val.length - 1];
      if (lastTrans.shareCount > 0) {
        //const entry = new PortfolioEntry("ABB", "Aussie", 200, 2.88);
        const entry = new PortfolioEntry(
          lastTrans.transactionData.stockCode,
          "",
          lastTrans.shareCount,
          lastTrans.aveBuyPrice
        );
        portfolio.push(entry);
      }
    });

    portfolio.sort((a, b) => a.stockCode.localeCompare(b.stockCode));
    this.state.portfolio = portfolio;
    // console.log("portfolio:", this.state.portfolio);
  }

  async read() {
    try {
      this.state.transactionList = await getJSON(`${API_URL}transactions/read`);
      return this.state.transactionList;
    } catch (err) {
      throw err;
    }
  }

  async readSingle(id) {
    try {
      const data = await getJSON(`${API_URL}transactions/read_single/${id}`);
      return data;
    } catch (err) {
      throw err;
    }
  }

  async create(data) {
    try {
      const response = await sendJSON(`${API_URL}transactions/create`, data);
      return response;
    } catch (err) {
      throw err;
    }
  }

  async update(data, id) {
    try {
      const response = await updateJSON(
        `${API_URL}transactions/update/${id}`,
        data
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  async delete(id) {
    try {
      const response = await deleteJSON(`${API_URL}transactions/delete/${id}`);
      return response;
    } catch (err) {
      throw err;
    }
  }
}

export default new TransactionModel();
