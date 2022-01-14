const { models } = require('../../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

module.exports = {
    list: (page = 0, itemsPerPage = 6) => models.plane.findAndCountAll({
        raw: true,
        offset: itemsPerPage * page,
        limit: itemsPerPage,
        order: [
            ['id', 'DESC']
        ]
    }),
    search: (keyword, page = 0, itemsPerPage = 6) => models.plane.findAndCountAll({
        where: {
            [Op.or]: [{
                    aircraft_number: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    airline_name: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        },
        offset: itemsPerPage * page,
        limit: itemsPerPage,
    }),
    addPlane: async(aircraftNumber, airlineName) => {
        const checkAircraftNumber = await models.plane.findOne({ where: { aircraft_number: aircraftNumber }, raw: true })
        if (checkAircraftNumber) {
            throw new Error('Aircraft number is already taken!');
        }
        return await models.plane.create({
            aircraft_number: aircraftNumber,
            airline_name: airlineName
        });
    },
    findPlaneById: id => models.plane.findByPk(id),
    updatePlane: async(id, aircraftNumber, airlineName) => {
        const checkAircraftNumber = await models.plane.findOne({
            where: {
                aircraft_number: aircraftNumber,
                id: {
                    [Op.not]: id
                }
            },
            raw: true
        })
        if (checkAircraftNumber) {
            throw new Error('Aircraft number is already taken!');
        }
        return models.plane.update({
            aircraft_number: aircraftNumber,
            airline_name: airlineName
        }, {
            where: {
                id: id,
            },
        });
    },
}