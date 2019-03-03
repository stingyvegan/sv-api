'use strict';
module.exports = (sequelize, DataTypes) => {
  const Batch = sequelize.define(
    'Batch',
    {
      batchId: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      productId: DataTypes.UUID,
    },
    {
      freezeTableName: true,
      tableName: 'batch',
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
  Batch.associate = function(models) {
    Batch.belongsTo(models.Product, { foreignKey: 'product_id' });
    Batch.hasMany(models.Order, { foreignKey: 'batch_id' });
  };
  return Batch;
};
