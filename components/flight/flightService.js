const { models } = require('../../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

module.exports = {
    list: (page = 0, itemsPerPage = 5) => models.flight.findAndCountAll({
        raw: true,
        offset: itemsPerPage * page,
        limit: itemsPerPage
    }),
}