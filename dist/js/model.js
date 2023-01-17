import { API_URL } from "./config.js";

export default class TransactionModel {
  constructor() {
    console.log("Transaction Model instantiated");
  }

  async read() {
    try {
      const data = await fetch(`${API_URL}transactions/read`);
      if (!data.ok) throw new Error("Problem fetching transaction data");

      const jsonData = await data.json();
      return jsonData;
    } catch (err) {
      console.error(`${err} 💥`);
      throw err;
    }
  }

  ///////////////////////////////////////
  // Building a Simple Promise
  lottery() {
    const lotteryPromise = new Promise(function (resolve, reject) {
      console.log("Lottery draw is happening 🔮");
      setTimeout(function () {
        if (Math.random() >= 0.5) {
          resolve("You WIN 💰");
        } else {
          reject(new Error("You lost your money 💩"));
        }
      }, 2000);
    });

    lotteryPromise
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }

  test() {
    console.log("Transaction test");
  }
}

// export default new TransactionModel();
