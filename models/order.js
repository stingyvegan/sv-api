'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      username: DataTypes.STRING,
      committed: DataTypes.SMALLINT,
      batchId: DataTypes.UUID,
    },
    {},
  );
  Order.associate = function(models) {
    Order.belongsTo(models.Batch);
  };
  return Order;
};
