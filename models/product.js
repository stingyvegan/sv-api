'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      productId: {
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
    {
      freezeTableName: true,
      tableName: 'product',
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
  Product.associate = function(models) {
    Product.belongsTo(models.Supplier, { foreignKey: 'supplier_id' });
    Product.hasMany(models.Batch, { foreignKey: 'product_id' });
  };
  return Product;
};
