'use strict';
module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define(
    'Supplier',
    {
      supplierId: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      tableName: 'supplier',
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
  Supplier.associate = function(models) {
    Supplier.hasMany(models.Product, { foreignKey: 'supplier_id' });
  };
  return Supplier;
};
