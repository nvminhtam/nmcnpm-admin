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
                const departureAirport = await flightService.findAirportById(flightList[i].departure_airport_id);
                const arrivalAirport = await flightService.findAirportById(flightList[i].arrival_airport_id);
                flights[i] = {
                    id: flightList[i].id,
                    departure_airport: departureAirport.symbol_code,
                    arrival_airport: arrivalAirport.symbol_code,
                    departure_time: flightList[i].departure_time,
                    arrival_time: flightList[i].arrival_time,
                    status: flightList[i].status,
                }
            }
            res.render('flight/flights', { title: 'Flights', flights, currentPage: page, maxPage, url, scripts: ['flight.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    detail: async(req, res) => {
        try {
            const flightId = req.params.flightId;
            const flight = await flightService.findFlightById(flightId);
            const departureAirport = await flightService.findAirportById(flight.departure_airport_id);
            const arrivalAirport = await flightService.findAirportById(flight.arrival_airport_id);
            const extendFlightList = await flightService.findExtendFlightById(flightId);
            var transit;
            if (extendFlightList.length == 1) {
                transit = 'Direct';
            }
            if (extendFlightList.length == 2) {
                transit = '1 transit';
            }
            if (extendFlightList.length > 2) {
                transit = extendFlightList.length - 1 + ' transits';
            }
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
            const seatClassList = await flightService.findSeatClassById(flightId);
            var seatClass = new Array();
            for (let i = 0; i < seatClassList.length; i++) {
                seatClass[i] = {
                    name: seatClassList[i]['flight_has_seat_classes.seat_class.name'],
                    price: seatClassList[i]['flight_has_seat_classes.price'],
                    totalSeatCount: seatClassList[i]['flight_has_seat_classes.total_seat_count'],
                    bookedSeatCount: seatClassList[i]['flight_has_seat_classes.booked_seat_count'],
                }
            }
            console.log(seatClass);
            res.render('flight/flightDetail', { title: 'Flight Detail', flight, departureAirport, arrivalAirport, extendFlight, transit, seatClass, scripts: ['flight.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    addFlightPage: async(req, res) => {
        try {
            const seatClassList = await flightService.seatClassList();
            const airportList = await flightService.airportList();
            const planeList = await flightService.planeList();
            const datepickerStyle = 1;
            res.render('flight/addFlight', { title: 'Add Flight', datepickerStyle, planeList, airportList, seatClassList, scripts: ['flight.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
}