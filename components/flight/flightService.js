const { models } = require('../../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const extendFlightListConfig = {
    raw: true,
    attributes: [
        'id',
        'departure_airport_id',
        'arrival_airport_id',
        'departure_time',
        'arrival_time',
        'status',
        'total_seat_count',
        'booked_seat_count',

    ],
    required: true,
    include: [{
        model: models.extend_flight,
        as: 'extend_flights',
        attributes: [
            'id',
            'flight_id',
            'plane_id',
            'departure_airport_id',
            'arrival_airport_id',
            'departure_time',
            'arrival_time',
        ],
        duplicating: false,
        required: true,
        include: [{
                model: models.airport,
                as: 'departure_airport',
                attributes: [
                    'id',
                    'airport_name',
                    'symbol_code',
                    'province',
                    'city',
                ],
                duplicating: false,
                required: true,
            },
            {
                model: models.airport,
                as: 'arrival_airport',
                attributes: [
                    'id',
                    'airport_name',
                    'symbol_code',
                    'province',
                    'city',
                ],
                duplicating: false,
                required: true,
            },
            {
                model: models.plane,
                as: 'plane',
                attributes: [
                    'id',
                    'airline_name',
                    'aircraft_number',
                ],
                duplicating: false,
                required: true,
            }
        ]
    }, ],
    order: [
        ['id', 'ASC']
    ]
};
const seatClassListConfig = {
    raw: true,
    attributes: [],
    required: true,
    include: [{
        model: models.flight_has_seat_class,
        as: 'flight_has_seat_classes',
        attributes: [
            'seat_class_id',
            'price',
            'total_seat_count',
            'booked_seat_count',
        ],
        required: true,
        include: [{
            model: models.seat_class,
            as: 'seat_class',
            attributes: [
                'name',
            ],
            required: true,
        }]
    }],
    order: [
        ['id', 'ASC']
    ]
}
module.exports = {
    countFlight: (page = 0, itemsPerPage = 5) => models.flight.findAndCountAll({
        raw: true,
        offset: itemsPerPage * page,
        limit: itemsPerPage
    }),
    flightList: (page = 0, itemsPerPage = 5) => models.flight.findAll({
        raw: true,
        offset: itemsPerPage * page,
        limit: itemsPerPage,
        order: [
            ['id', 'DESC']
        ]
    }),
    findFlightById: (flightId) => models.flight.findOne({
        raw: true,
        where: {
            id: flightId
        }
    }),
    findAirportById: (id) => models.airport.findOne({
        raw: true,
        where: {
            id: id
        }
    }),
    findExtendFlightById: (id) => models.flight.findAll({
        ...extendFlightListConfig,
        raw: true,
        where: {
            id: id
        }
    }),
    findSeatClassById: (id) => models.flight.findAll({
        ...seatClassListConfig,
        raw: true,
        where: {
            id: id
        }
    }),
    seatClassList: () => models.seat_class.findAll({
        raw: true,
    }),
    airportList: () => models.airport.findAll({
        raw: true,
    }),
    planeList: () => models.plane.findAll({
        raw: true,
    }),
    removeSeatClassOutOfList: (seatClassList, seatClassId) => {
        const index = seatClassList.map(function(e) { console.log(e.id); return e.id; }).indexOf(seatClassId);
        if (index > -1) {
            seatClassList.splice(index, 1);
        }
        return seatClassList;
    },
    addFlight: (flightData) => models.flight.create({
        departure_airport_id: flightData.departure_airport_id,
        arrival_airport_id: flightData.arrival_airport_id,
        departure_time: flightData.departure_time,
        arrival_time: flightData.arrival_time,
        status: flightData.status,
        total_seat_count: flightData.total_seat_count,
        booked_seat_count: flightData.booked_seat_count,
    }),
    addExtendFlight: async(flightId, extendFlight) => {
        for (let i = 0; i < extendFlight.length; i++) {
            await models.extend_flight.create({
                flight_id: flightId,
                plane_id: extendFlight[i].plane,
                departure_airport_id: extendFlight[i].departureAirport,
                arrival_airport_id: extendFlight[i].arrivalAirport,
                departure_time: new Date(extendFlight[i].departureTime),
                arrival_time: new Date(extendFlight[i].arrivalTime),
            })
        }
    },
    addFlightHasSeatClass: async(flightId, seatClass) => {
        for (let i = 0; i < seatClass.length; i++) {
            await models.flight_has_seat_class.create({
                flight_id: flightId,
                seat_class_id: seatClass[i].seatClassId,
                price: seatClass[i].price,
                total_seat_count: seatClass[i].totalCount,
                booked_seat_count: 0
            })
        }
    },
    updateStatus: (id, status) => models.flight.update({
        status: status
    }, {
        where: {
            id: id
        }
    })
}