const flightService = require('./flightService');

module.exports = {
    list: async(req, res) => {
        try {
            //get request params and url
            const page = (!isNaN(req.query.page) && req.query.page > 0) ? Number(req.query.page) : 1;
            const url = req.url;
            const flightCount = await flightService.countFlight(page - 1);
            //get flight list and page count
            const flightList = await flightService.flightList(page - 1);
            const maxPage = Math.floor((flightCount.count - 1) / 5) + 1;
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
            const departureAirportList = await flightService.airportList();
            const arrivalAirportList = await flightService.airportList();
            var planeList = await flightService.planeList();
            const seatClassList = await flightService.seatClassList();
            const extendFlightCount = 0;
            const seatClassCount = 0;
            const currentDepartureAirport = null;
            const extendFlightList = new Array();
            res.render('flight/addFlight', { title: 'Add Flight', extendFlightCount, seatClassCount, planeList, extendFlightList, currentDepartureAirport, departureAirportList, arrivalAirportList, seatClassList, scripts: ['flight.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    addExtendFlight: async(req, res) => {
        try {
            var { extendFlightCount, extendFlight } = req.body;
            const arrivalAirportList = await flightService.airportList();
            var planeList = await flightService.planeList();
            const currentDepartureAirport = await flightService.findAirportById(extendFlight[extendFlightCount].arrivalAirport);
            res.status(200).send({ title: 'Add Flight', planeList, currentDepartureAirport, arrivalAirportList, scripts: ['flight.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    addSeatClass: async(req, res) => {
        try {
            var { seatClassCount, seatClass } = req.body;
            var seatClassList = await flightService.seatClassList();
            for (let i = 0; i < seatClass.length; i++) {
                seatClassList = await flightService.removeSeatClassOutOfList(seatClassList, seatClass[i].seatClassId);
            }
            res.status(200).send({ title: 'Add Flight', seatClassList, scripts: ['flight.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    addFlightForm: async(req, res) => {
        try {
            const { extendFlight, seatClass } = req.body;
            console.log(req.body);
            var totalSeatCount = 0;
            for (let i = 0; i < seatClass.length; i++) {
                totalSeatCount += seatClass[i].totalCount;
            }
            const flightData = {
                departure_airport_id: extendFlight[0].departureAirport,
                arrival_airport_id: extendFlight[extendFlight.length - 1].arrivalAirport,
                departure_time: extendFlight[0].departureTime,
                arrival_time: extendFlight[extendFlight.length - 1].arrivalTime,
                status: "On Time",
                total_seat_count: totalSeatCount,
                booked_seat_count: 0,
            }
            const flight = await flightService.addFlight(flightData);
            //console.log(flight);
            await flightService.addExtendFlight(flight.id, extendFlight);
            await flightService.addFlightHasSeatClass(flight.id, seatClass);
            res.status(200).send({ message: "OK" });
        } catch (err) {
            console.log(err.message);
        }
    }
}