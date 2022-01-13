var DataTypes = require("sequelize").DataTypes;
var _admin = require("./admin");
var _airport = require("./airport");
var _bill = require("./bill");
var _customer = require("./customer");
var _extend_flight = require("./extend_flight");
var _flight = require("./flight");
var _flight_has_seat_class = require("./flight_has_seat_class");
var _plane = require("./plane");
var _seat_class = require("./seat_class");
var _traveler_details = require("./traveler_details");

function initModels(sequelize) {
  var admin = _admin(sequelize, DataTypes);
  var airport = _airport(sequelize, DataTypes);
  var bill = _bill(sequelize, DataTypes);
  var customer = _customer(sequelize, DataTypes);
  var extend_flight = _extend_flight(sequelize, DataTypes);
  var flight = _flight(sequelize, DataTypes);
  var flight_has_seat_class = _flight_has_seat_class(sequelize, DataTypes);
  var plane = _plane(sequelize, DataTypes);
  var seat_class = _seat_class(sequelize, DataTypes);
  var traveler_details = _traveler_details(sequelize, DataTypes);

  flight.belongsToMany(seat_class, { as: 'seat_class_id_seat_classes', through: flight_has_seat_class, foreignKey: "flight_id", otherKey: "seat_class_id" });
  seat_class.belongsToMany(flight, { as: 'flight_id_flights', through: flight_has_seat_class, foreignKey: "seat_class_id", otherKey: "flight_id" });
  extend_flight.belongsTo(airport, { as: "departure_airport", foreignKey: "departure_airport_id"});
  airport.hasMany(extend_flight, { as: "extend_flights", foreignKey: "departure_airport_id"});
  extend_flight.belongsTo(airport, { as: "arrival_airport", foreignKey: "arrival_airport_id"});
  airport.hasMany(extend_flight, { as: "arrival_airport_extend_flights", foreignKey: "arrival_airport_id"});
  traveler_details.belongsTo(bill, { as: "bill", foreignKey: "bill_id"});
  bill.hasMany(traveler_details, { as: "traveler_details", foreignKey: "bill_id"});
  bill.belongsTo(customer, { as: "customer", foreignKey: "customer_id"});
  customer.hasMany(bill, { as: "bills", foreignKey: "customer_id"});
  extend_flight.belongsTo(flight, { as: "flight", foreignKey: "flight_id"});
  flight.hasMany(extend_flight, { as: "extend_flights", foreignKey: "flight_id"});
  flight_has_seat_class.belongsTo(flight, { as: "flight", foreignKey: "flight_id"});
  flight.hasMany(flight_has_seat_class, { as: "flight_has_seat_classes", foreignKey: "flight_id"});
  bill.belongsTo(flight_has_seat_class, { as: "flight", foreignKey: "flight_id"});
  flight_has_seat_class.hasMany(bill, { as: "bills", foreignKey: "flight_id"});
  bill.belongsTo(flight_has_seat_class, { as: "seat_class", foreignKey: "seat_class_id"});
  flight_has_seat_class.hasMany(bill, { as: "seat_class_bills", foreignKey: "seat_class_id"});
  extend_flight.belongsTo(plane, { as: "plane", foreignKey: "plane_id"});
  plane.hasMany(extend_flight, { as: "extend_flights", foreignKey: "plane_id"});
  flight_has_seat_class.belongsTo(seat_class, { as: "seat_class", foreignKey: "seat_class_id"});
  seat_class.hasMany(flight_has_seat_class, { as: "flight_has_seat_classes", foreignKey: "seat_class_id"});

  return {
    admin,
    airport,
    bill,
    customer,
    extend_flight,
    flight,
    flight_has_seat_class,
    plane,
    seat_class,
    traveler_details,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
