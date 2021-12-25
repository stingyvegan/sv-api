'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('batch', {
      batch_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      product_id: {
        type: Sequelize.UUID,
        references: { model: 'product', key: 'product_id' },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('batch');
  },
};
