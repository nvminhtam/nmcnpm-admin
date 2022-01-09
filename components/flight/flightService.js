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
        'price'
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
    flightList: (page = 0, itemsPerPage = 5) => models.flight.findAll({
        raw: true,
        offset: itemsPerPage * page,
        limit: itemsPerPage
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
}