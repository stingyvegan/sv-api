'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      isDiscrete: DataTypes.BOOLEAN,
      unitSize: DataTypes.SMALLINT,
      unitName: DataTypes.STRING,
      requiredUnits: DataTypes.SMALLINT,
      totalCost: DataTypes.INTEGER,
      supplierId: DataTypes.UUID,
    },
    {},
  );
  Product.associate = function(models) {
    Product.belongsTo(models.Supplier);
    Product.hasMany(models.Batch);
  };
  return Product;
};
