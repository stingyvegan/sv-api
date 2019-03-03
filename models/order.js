'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      orderId: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      username: DataTypes.STRING,
      committed: DataTypes.SMALLINT,
      batchId: DataTypes.UUID,
    },
    {
      freezeTableName: true,
      tableName: 'order',
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
  Order.associate = function(models) {
    Order.belongsTo(models.Batch, { foreignKey: 'batch_id' });
  };
  return Order;
};
