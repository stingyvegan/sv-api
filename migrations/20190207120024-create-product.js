'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING,
      },
      isDiscrete: {
        type: Sequelize.BOOLEAN,
      },
      unitSize: {
        type: Sequelize.SMALLINT,
      },
      unitName: {
        type: Sequelize.STRING,
      },
      requiredUnits: {
        type: Sequelize.SMALLINT,
      },
      totalCost: {
        type: Sequelize.INTEGER,
      },
      supplierId: {
        type: Sequelize.UUID,
        references: { model: 'Suppliers', key: 'id' },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Products');
  },
};
