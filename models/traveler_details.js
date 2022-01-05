const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('traveler_details', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bill_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bill',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    telephone: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    citizen_id: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    flight_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'flight_has_seat_class',
        key: 'flight_id'
      }
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'flight_has_seat_class',
        key: 'seat_class_id'
      }
    }
  }, {
    sequelize,
    tableName: 'traveler_details',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "idTravelerDetails_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_Traveler_Details_Bill1_idx",
        using: "BTREE",
        fields: [
          { name: "bill_id" },
        ]
      },
      {
        name: "fk_traveler_details_flight_has_seat_class1_idx",
        using: "BTREE",
        fields: [
          { name: "flight_id" },
          { name: "class_id" },
        ]
      },
    ]
  });
};
