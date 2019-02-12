'use strict';
module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define(
    'Supplier',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: DataTypes.STRING,
    },
    {},
  );
  Supplier.associate = function(models) {
    Supplier.hasMany(models.Product);
  };
  return Supplier;
};
