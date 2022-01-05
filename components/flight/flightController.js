const flightService = require('./flightService');

module.exports = {
    list: async(req, res) => {
        try {
            //get request params and url
            const page = (!isNaN(req.query.page) && req.query.page > 0) ? Number(req.query.page) : 1;
            const url = req.url;

            //get flight list and page count
            const flightList = await flightService.flightList(page - 1);
            const maxPage = Math.floor((flightList.count - 1) / 5) + 1;
            var flights = new Array();
            for (let i = 0; i < flightList.length; i++) {
                const departureAirport = await flightService.airportList(flightList[i].departure_airport_id);
                const arrivalAirport = await flightService.airportList(flightList[i].arrival_airport_id);
                flights[i] = {
                    id: flightList[i].id,
                    departure_airport: departureAirport[0].symbol_code,
                    arrival_airport: arrivalAirport[0].symbol_code,
                    departure_time: flightList[i].departure_time,
                    arrival_time: flightList[i].arrival_time,
                    status: flightList[i].status,
                }
            }
            console.log(flights);
            res.render('flight/flights', { title: 'Flights', flights, currentPage: page, maxPage, url });
        } catch (err) {
            console.log(err.message);
        }
    },
}