import { API_URL } from "../config.js";
import { getJSON, sendJSON } from "../helpers.js";

class StockModel {
  state = {
    stockList: [],
    sectorList: [],
    registryList: [],
  };

  async read() {
    try {
      const data = await getJSON(`${API_URL}stocks/read`);
      this.state.stockList = data;
      return data;
    } catch (err) {
      throw err;
    }
  }

  async readSectors() {
    try {
      const data = await getJSON(`${API_URL}sectors/read`);
      this.state.sectorList = data;
      return data;
    } catch (err) {
      throw err;
    }
  }

  async readRegistries() {
    try {
      const data = await getJSON(`${API_URL}registries/read`);
      this.state.registryList = data;
      return data;
    } catch (err) {
      throw err;
    }
  }

  async create(data) {
    try {
      const response = await sendJSON(`${API_URL}stocks/create`, data);
      return response;
    } catch (err) {
      throw err;
    }
  }

  getStockCodeList() {
    let stockCodeList = [];
    this.state.stockList.forEach((el) => stockCodeList.push(el.stockCode));
    return stockCodeList;
  }

  getStockIDFromCode(code) {
    const stock = this.state.stockList.find((el) => el.stockCode === code);
    return stock === undefined ? -1 : stock.id;
  }
}

export default new StockModel();
