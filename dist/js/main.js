import TransactionModel from "./model.js";

const transactionModel = new TransactionModel();
transactionModel.test();

const init = function () {
  // const data = transactionModel.read();
  var _data;
  transactionModel
    .read()
    .then(function (data) {
      _data = data;
    })
    .catch(function (err) {
      console.error(`2 ${err} 💥`);
    })
    .finally(function () {
      console.log("finally... transaction data: ", _data);
    });
};

console.log("1");
init();
console.log("2");

transactionModel.lottery();
