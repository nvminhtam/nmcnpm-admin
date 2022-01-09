const billService = require('./billService');
const flightService = require('../flight/flightService');
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
            const id = req.params.billId;
            const bill = await billService.findBillById(id);
            const seatClass = await billService.findSeatClassById(bill.seat_class_id);
            const passengerList = await billService.findPassengerById(bill.id);
            var passengers = new Array();
            for (let i = 0; i < passengerList.length; i++) {
                passengers[i] = {
                    id: passengerList[i].id,
                    title: passengerList[i].title,
                    last_name: passengerList[i].last_name,
                    first_name: passengerList[i].first_name,
                    date_of_birth: passengerList[i].date_of_birth,
                    seat_class_name: seatClass.name,
                    price: bill.amount / passengerList.length,
                }
            }
            const extendFlightList = await flightService.findExtendFlightById(bill.flight_id);
            var extendFlight = new Array();
            for (let i = 0; i < extendFlightList.length; i++) {
                extendFlight[i] = {
                    id: extendFlightList[i].id,
                    plane: extendFlightList[i]['extend_flights.plane.aircraft_number'],
                    departure_airport: extendFlightList[i]['extend_flights.departure_airport.symbol_code'],
                    departure_airport_name: extendFlightList[i]['extend_flights.departure_airport.airport_name'],
                    departure_city: extendFlightList[i]['extend_flights.departure_airport.city'],
                    departure_time: extendFlightList[i]['extend_flights.departure_time'],
                    arrival_airport: extendFlightList[i]['extend_flights.arrival_airport.symbol_code'],
                    arrival_airport_name: extendFlightList[i]['extend_flights.arrival_airport.airport_name'],
                    arrival_city: extendFlightList[i]['extend_flights.arrival_airport.city'],
                    arrival_time: extendFlightList[i]['extend_flights.arrival_time'],
                }
            }
            res.render('bill/billDetail', { title: 'Bill Detail', bill, seatClass, passengers, extendFlight });
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
            const bills = await billService.search(status, search, page - 1);
            const maxPage = Math.floor((bills.count - 1) / 8) + 1;
            res.render('bill/bills', { title: 'Bills', bills: bills.rows, currentPage: page, maxPage, search, url, status });
        } catch (err) {
            console.log(err);
        }
    },
}