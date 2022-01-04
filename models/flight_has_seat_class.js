const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('flight_has_seat_class', {
    flight_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'flight',
        key: 'id'
      }
    },
    seat_class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'seat_class',
        key: 'id'
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    seat_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'flight_has_seat_class',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "flight_id" },
          { name: "seat_class_id" },
        ]
      },
      {
        name: "fk_flight_has_seat_class_seat_class1_idx",
        using: "BTREE",
        fields: [
          { name: "seat_class_id" },
        ]
      },
      {
        name: "fk_flight_has_seat_class_flight1_idx",
        using: "BTREE",
        fields: [
          { name: "flight_id" },
        ]
      },
    ]
  });
};
