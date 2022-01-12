const Sequelize = require('sequelize');
const initModels = require("./init-models");

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//     timezone: '+07:00'
// });

// const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     dialect: 'mysql',
//     timezone: '+07:00'
// });
const sequelize = new Sequelize("mysql://doadmin:07TZPIrkKqJrHQ0Q@db-mysql-sgp1-23535-do-user-9572625-0.b.db.ondigitalocean.com:25060/NMCNPM?ssl-mode=REQUIRED", {
    timezone: '+07:00'
});

module.exports = {
    sequelize,
    models: initModels(sequelize)
};