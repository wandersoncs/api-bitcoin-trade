const request = require('request-promise-native');

URL_BASE = 'https://api.bitcointrade.com.br/v1/';

class BitcoinTrade {

	constructor(apiToken) {
		this.headers = {
			'Authorization': `ApiToken ${apiToken}`
		}
	}

	getWalletBalance() {
		let url = `${URL_BASE}wallets/balance`;
		return new Promise((resolve, reject) => {
			request.get(url, { headers: this.headers, json: true }).then(res => {
				resolve(res.data);
			}).catch(err => {
				reject(err.error);
			});
		});
	}

	getTicketSummary() {
		let url = `${URL_BASE}public/BTC/ticker`;
		return new Promise((resolve, reject) => {
			request.get(url, { json: true }).then(res => {
				resolve(res.data);
			}).catch(err => {
				reject(err.error);
			});
		});
	}

	getSummary() {
		let url = `${URL_BASE}market/summary?currency=BTC`;
		return new Promise((resolve, reject) => {
			request.get(url, { headers: this.headers, json: true }).then(res => {
				resolve(res.data[0]);
			}).catch(err => {
				reject(err.error);
			});
		});
	}

	getBookOrders() {
		let url = `${URL_BASE}market?currency=BTC`;
		return new Promise((resolve, reject) => {
			request.get(url, { headers: this.headers, json: true }).then(res => {
				let orders = res.data;
				orders.buying.forEach(order => {
					let price = order.unit_price * order.amount;
					order.price = price;
				});
				orders.selling.forEach(order => {
					let price = order.unit_price * order.amount;
					order.price = price;
				});
				resolve(orders);
			}).catch(err => {
				reject(err.error);
			});
		});
	}

	getUserOrders(orderType) {
		let status = 'status=waiting';
		let currency = 'currency=BTC';
		let page_size = 'page_size=1000';
		let current_page = 'current_page=1';
		let url = `${URL_BASE}market/user_orders/list?${status}&${currency}&${page_size}&${current_page}`;
		return new Promise((resolve, reject) => {
			request.get(url, { headers: this.headers, json: true }).then(res => {
				resolve(res.data);
			}).catch(err => {
				reject(err.error);
			});
		});
	}

	createOrderToSell(amount, unit_price) {
		return this.createOrder(amount, unit_price, 'sell');
	}

	createOrderToBuy(amount, unit_price) {
		return this.createOrder(amount, unit_price, 'buy');
	}

	createOrder(amount, unit_price, type) {
		let url = `${URL_BASE}market/create_order`;
		let body = {
			currency: 'BTC',
			amount: amount,
			type: type,
			subtype: 'limited',
			unit_price: unit_price
		};
		return new Promise((resolve, reject) => {
			request.post(url, { headers: this.headers, body: body, json: true }).then(res => {
				resolve(res.data);
			}).catch(err => {
				reject(err.error);
			});
		});
	}

	cancelOrder(id) {
		let url = `${URL_BASE}market/user_orders/`;
		return new Promise((resolve, reject) => {
			request.delete(url, { headers: this.headers, body: { id }, json: true }).then(res => {
				resolve(res);
			}).catch(err => {
				reject(err.error);
			});
		});
	}

	getTrades() {
		let page_size = 'page_size=1000';
		let current_page = 'current_page=1';
		let url = `${URL_BASE}public/BTC/trades?${page_size}&${current_page}`;
		return new Promise((resolve, reject) => {
			request.get(url, { json: true }).then(res => {
				resolve(res.data);
			}).catch(err => {
				reject(err.error);
			});
		});
	}
}

module.exports = BitcoinTrade;