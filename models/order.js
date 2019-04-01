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
    Order.hasMany(models.BatchOrder, { foreignKey: 'order_id' });
  };
  return Order;
};
