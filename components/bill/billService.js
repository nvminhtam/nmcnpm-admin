const { models } = require('../../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const listConfig = {
    raw: true,
    attributes: [
        'id',
        'status',
        'total',
        'created_at'
    ],
    include: [{
        model: models.receiver_address,
        as: 'receiver_address',
        required: true
    }, ]
}

module.exports = {
    list: (page = 0, itemsPerPage = 8) => models.bill.findAndCountAll({
        offset: itemsPerPage * page,
        limit: itemsPerPage,
        order: [
            ['id', 'DESC']
        ]
    }),
    search: (status, keyword, page = 0, itemsPerPage = 8) => models.bill.findAndCountAll({
        where: {
            status: {
                [Op.like]: `%${status}%`
            },
            [Op.or]: [{
                amount: {
                    [Op.like]: `%${keyword}%`
                }
            }, {
                last_name: {
                    [Op.like]: `%${keyword}%`
                }
            }, {
                first_name: {
                    [Op.like]: `%${keyword}%`
                }
            }, {
                email: {
                    [Op.like]: `%${keyword}%`
                }
            }, {
                telephone: {
                    [Op.like]: `%${keyword}%`
                }
            }, ]
        },
        offset: itemsPerPage * page,
        limit: itemsPerPage
    }),
    findBillById: id => models.bill.findByPk(id, {
        raw: true,
    }),
    findSeatClassById: (id) => models.seat_class.findOne({
        raw: true,
        where: {
            id: id
        }
    }),
    findPassengerById: (id) => models.traveler_details.findAll({
        raw: true,
        where: {
            bill_id: id
        }
    }),
    // findOrderDetailsById: id => models.order_details.findAll({
    //     raw: true,
    //     attributes: [
    //         [sequelize.fn('sum', sequelize.col('quantity')), 'product_amount'],
    //         [sequelize.fn('sum', sequelize.col('order_details.price')), 'product_price']
    //     ],
    //     where: {
    //         order_id: id
    //     },
    //     include: [{
    //         model: models.product,
    //         as: 'product',
    //         required: true,
    //         attributes: ['name']
    //     }],
    //     group: ['product_id']
    // }),
    // sumOrder: id => models.order_details.findOne({
    //     raw: true,
    //     attributes: [
    //         [sequelize.fn('sum', sequelize.col('order_details.price')), 'total']
    //     ],
    //     where: {
    //         order_id: id
    //     }
    // }),

}