const { models } = require('../../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

module.exports = {
    list: (page = 0, itemsPerPage = 6) => models.airport.findAndCountAll({
        raw: true,
        offset: itemsPerPage * page,
        limit: itemsPerPage
    }),
    search: (keyword, page = 0, itemsPerPage = 6) => models.airport.findAndCountAll({
        where: {
            [Op.or]: [{
                airport_name: {
                    [Op.like]: `%${keyword}%`
                }
            }, {
                province: {
                    [Op.like]: `%${keyword}%`
                }
            }, {
                city: {
                    [Op.like]: `%${keyword}%`
                }
            }, {
                symbol_code: {
                    [Op.like]: `%${keyword}%`
                }
            }, ]
        },
        offset: itemsPerPage * page,
        limit: itemsPerPage,
    }),
    addAirport: async(airportName, symbolCode, province, city) => {
        const checkSymbolCode = await models.airport.findOne({ where: { symbol_code: symbolCode }, raw: true })
        if (checkSymbolCode) {
            throw new Error('Symbol code is already taken!');
        }
        return await models.airport.create({
            airport_name: airportName,
            symbol_code: symbolCode,
            province: province,
            city: city,
        });
    },
    findAirportById: id => models.airport.findByPk(id),
    updateAirport: async(id, airportName, symbolCode, province, city) => {
        const checkSymbolCode = await models.airport.findOne({
            where: {
                symbol_code: symbolCode,
                id: {
                    [Op.not]: id
                }
            },
            raw: true
        })
        if (checkSymbolCode) {
            throw new Error('Symbol code is already taken!');
        }
        return models.airport.update({
            airport_name: airportName,
            symbol_code: symbolCode,
            province: province,
            city: city,
        }, {
            where: {
                id: id,
            },
        });
    },
}