const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('airport', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    airport_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    province: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    symbol_code: {
      type: DataTypes.STRING(5),
      allowNull: false,
      unique: "symbol_code_UNIQUE"
    }
  }, {
    sequelize,
    tableName: 'airport',
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
        name: "idAirport_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "symbol_code_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "symbol_code" },
        ]
      },
    ]
  });
};
