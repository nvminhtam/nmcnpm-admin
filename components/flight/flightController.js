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
            //var { extendFlightCount, departureAirport, arrivalAirport, departureTime, arrivalTime, plane } = req.body;
            //console.log("BODY", req.body);
            //console.log("a", extendFlightCount);
            const departureAirportList = await flightService.airportList();
            const arrivalAirportList = await flightService.airportList();
            var planeList = await flightService.planeList();
            // var currentDepartureAirport = null;
            // if (extendFlightCount) {
            //     var extendFlightList = new Array();
            //     for (let i = 0; i < extendFlightCount; i++) {
            //         extendFlightList[i] = {
            //             departureAirport: departureAirport[i],
            //             arrivalAirport: arrivalAirport[i],
            //             departureTime: departureTime[i],
            //             arrivalTime: arrivalTime[i],
            //             plane: plane[i]
            //         };
            //         planeList = await flightService.removePlaneOutOfList(planeList, plane[i]);
            //     }
            //     currentDepartureAirport = extendFlightCount[extendFlightCount - 1].arrivalAirport;
            // } else {
            //     extendFlightCount = 0;
            // }
            const seatClassList = await flightService.seatClassList();
            const extendFlightCount = 0;
            const seatClassCount = 0;
            const currentDepartureAirport = null;
            const extendFlightList = new Array();
            // console.log("a", planeList);
            // console.log("b", extendFlightList);
            // console.log("c", currentDepartureAirport);
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
            //res.end();
            //res.render('flight/addFlight', { title: 'Add Flight', extendFlightCount, planeList, extendFlightList, currentDepartureAirport, departureAirportList, arrivalAirportList, seatClassList, scripts: ['flight.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    addSeatClass: async(req, res) => {
        try {
            var { seatClassCount, seatClass } = req.body;
            console.log("BODY", req.body);
            console.log("a", seatClassCount);
            var seatClassList = await flightService.seatClassList();
            console.log("b", seatClassList);
            for (let i = 0; i < seatClass.length; i++) {
                console.log("c", parseInt(seatClass[i].seatClassId));
                seatClassList = await flightService.removeSeatClassOutOfList(seatClassList, parseInt(seatClass[i].seatClassId));
            }
            console.log("d", seatClassList);
            res.status(200).send({ title: 'Add Flight', seatClassList, scripts: ['flight.js'] });
            //res.end();
            //res.render('flight/addFlight', { title: 'Add Flight', extendFlightCount, planeList, extendFlightList, currentDepartureAirport, departureAirportList, arrivalAirportList, seatClassList, scripts: ['flight.js'] });
        } catch (err) {
            console.log(err.message);
        }
    }
}