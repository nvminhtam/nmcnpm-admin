const airportService = require('./airportService');

module.exports = {
    list: async(req, res) => {
        try {
            //get request params and url
            const page = (!isNaN(req.query.page) && req.query.page > 0) ? Number(req.query.page) : 1;
            const url = req.url;

            //get airport list and page count
            const airports = await airportService.list(page - 1);
            const maxPage = Math.floor((airports.count - 1) / 6) + 1;
            res.render('airport/airports', { title: 'Airports', airports: airports.rows, currentPage: page, maxPage, url, scripts: ['airport.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    search: async(req, res) => {
        try {
            //get request params
            const page = (!isNaN(req.query.page) && req.query.page > 0) ? Number(req.query.page) : 1;
            const search = req.query.keyword;
            const url = req.url;

            //get airport and page count
            const airports = search ? await airportService.search(search, page - 1) : await airportService.list(page - 1);
            const maxPage = Math.floor((airports.count - 1) / 6) + 1;
            res.render('airport/airports', { title: 'Airports', airports: airports.rows, currentPage: page, maxPage, search, url, scripts: ['airport.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    addAirportPage: async(req, res) => {
        try {
            res.render('airport/addAirport', { title: 'Add Airport', scripts: ['airport.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    addAirportForm: async(req, res) => {
        try {
            const { airportName, symbolCode, province, city } = req.body;
            await airportService.addAirport(airportName, symbolCode, province, city);
            res.status(200).send({ message: "OK" });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
    updateAirportPage: async(req, res) => {
        try {
            const id = req.params.airportId;
            const airport = await airportService.findAirportById(id);
            res.render('airport/updateAirport', { title: 'Update Airport', airport, scripts: ['airport.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    updateAirportForm: async(req, res) => {
        try {
            const { id, airportName, symbolCode, province, city } = req.body;
            await airportService.updateAirport(id, airportName, symbolCode, province, city);
            res.status(200).send({ message: "OK" });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
}