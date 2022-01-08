const billService = require('./billService');

module.exports = {
    list: async(req, res) => {
        //get url and params
        const page = (!isNaN(req.query.page) && req.query.page > 0) ? Number(req.query.page) : 1;
        const url = req.url;

        const bills = await billService.list(page - 1);
        const maxPage = Math.floor((bills.count - 1) / 8) + 1;
        res.render('bill/bills', { title: 'Bills', bills: bills.rows, currentPage: page, maxPage, url, scripts: ['bill.js'] });
    },
    detail: async(req, res) => {
        try {
            const id = req.params.orderId;

            const order = await billService.findOrderById(id);
            const orderDetails = await billService.findOrderDetailsById(id);
            const sumOrder = await billService.sumOrder(id);
            res.render('order/invoice', { title: 'Invoice', order, orderDetails, sumOrder, scripts: ['order.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    search: async(req, res) => {
        try {
            //get request params
            const page = (!isNaN(req.query.page) && req.query.page > 0) ? Number(req.query.page) : 1;
            const search = req.query.keyword ? req.query.keyword : '';
            const status = req.query.status === 'all' ? '' : req.query.status;
            const url = req.url;

            //get order list and page count
            const orders = await billService.search(status, search, page - 1);
            const maxPage = Math.floor((orders.count - 1) / 8) + 1;

            res.render('order/orders', { title: 'Orders', orders: orders.rows, currentPage: page, maxPage, search, url, status, scripts: ['order.js'] });
        } catch (err) {
            console.log(err);
        }
    },
}