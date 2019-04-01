'use strict';
module.exports = (sequelize, DataTypes) => {
  const BatchOrder = sequelize.define(
    'BatchOrder',
    {
      batchId: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      committed: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      tableName: 'batch_order',
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
  BatchOrder.associate = function(models) {
    BatchOrder.belongsTo(models.Batch, { foreignKey: 'batch_id' });
    BatchOrder.belongsTo(models.Order, { foreignKey: 'order_id' });
  };
  return BatchOrder;
};
