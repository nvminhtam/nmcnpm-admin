const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bill', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customer',
        key: 'id'
      }
    },
    last_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(45),
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
    num_of_travelers: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    amount: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    flight_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    seat_class_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'bill',
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
        name: "idBill_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_Bill_Customer1_idx",
        using: "BTREE",
        fields: [
          { name: "customer_id" },
        ]
      },
      {
        name: "fk_bill_flight_has_seat_class1_idx",
        using: "BTREE",
        fields: [
          { name: "flight_id" },
          { name: "seat_class_id" },
        ]
      },
    ]
  });
};
