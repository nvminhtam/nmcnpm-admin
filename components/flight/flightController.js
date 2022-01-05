const flightService = require('./flightService');

module.exports = {
    list: async(req, res) => {
        try {
            //get request params and url
            const page = (!isNaN(req.query.page) && req.query.page > 0) ? Number(req.query.page) : 1;
            const url = req.url;

            //get flight list and page count
            const flights = await flightService.list(page - 1);
            console.log(flights);
            const maxPage = Math.floor((flights.count - 1) / 5) + 1;
            res.render('flight/flights', { title: 'Flights', flights: flights.rows, currentPage: page, maxPage, url });
        } catch (err) {
            console.log(err.message);
        }
    },
}