'use strict';
module.exports = (sequelize, DataTypes) => {
  const Batch = sequelize.define(
    'Batch',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      productId: DataTypes.UUID,
    },
    {},
  );
  Batch.associate = function(models) {
    Batch.belongsTo(models.Product);
    Batch.hasMany(models.Order);
  };
  return Batch;
};
