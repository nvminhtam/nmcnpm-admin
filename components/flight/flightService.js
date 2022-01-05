const { models } = require('../../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const listConfig = {
    raw: true,
    attributes: [
        'id',
        'departure_airport_id',
        'arrival_airport_id',
        'departure_time',
        'arrival_time',
        'status',
        'empty_seat_count',
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
        },
        {
            model: models.flight_has_seat_class,
            as: 'flight_has_seat_classes',
            attributes: [
                'flight_id',
                'seat_class_id',
                'price',
                'seat_count'
            ],
            duplicating: false,
            required: true,
            required: [{
                model: models.seat_class,
                as: 'seat_class',
                attributes: [
                    'id',
                    'name',
                ],
                duplicating: false,
                required: true,
            }]
        }
    ],
    order: [
        ['id', 'ASC']
    ]
};

module.exports = {
    list: (page = 0, itemsPerPage = 5) => models.flight.findAndCountAll({
        ...listConfig,
        raw: true,
        offset: itemsPerPage * page,
        limit: itemsPerPage
    }),


}