const { models } = require('../../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

module.exports = {
    list: (page = 0, itemsPerPage = 6) => models.seat_class.findAndCountAll({
        raw: true,
        offset: itemsPerPage * page,
        limit: itemsPerPage,
        order: [
            ['id', 'DESC']
        ]
    }),
    search: (keyword, page = 0, itemsPerPage = 6) => models.seat_class.findAndCountAll({
        where: {
            [Op.or]: [{
                name: {
                    [Op.like]: `%${keyword}%`
                }
            }]
        },
        offset: itemsPerPage * page,
        limit: itemsPerPage,
    }),
    addSeatClass: async(seatClassName) => {
        const checkName = await models.seat_class.findOne({ where: { name: seatClassName }, raw: true })
        if (checkName) {
            throw new Error('Seat class name is already taken!');
        }
        return await models.seat_class.create({
            name: seatClassName,
        });
    },
    findSeatClassById: id => models.seat_class.findByPk(id),
    updateSeatClass: async(id, seatClassName) => {
        const checkName = await models.seat_class.findOne({
            where: {
                name: seatClassName,
                id: {
                    [Op.not]: id
                }
            },
            raw: true
        })
        if (checkName) {
            throw new Error('Seat class name is already taken!');
        }
        return models.seat_class.update({
            name: seatClassName,
        }, {
            where: {
                id: id,
            },
        });
    },
}