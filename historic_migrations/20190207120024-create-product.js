'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('product', {
      product_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING,
      },
      is_discrete: {
        type: Sequelize.BOOLEAN,
      },
      unit_size: {
        type: Sequelize.SMALLINT,
      },
      unit_name: {
        type: Sequelize.STRING,
      },
      required_units: {
        type: Sequelize.SMALLINT,
      },
      total_cost: {
        type: Sequelize.INTEGER,
      },
      supplier_id: {
        type: Sequelize.UUID,
        references: { model: 'supplier', key: 'supplier_id' },
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
    return queryInterface.dropTable('product');
  },
};
