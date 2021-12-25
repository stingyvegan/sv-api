'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('supplier', {
      supplier_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING,
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
    await queryInterface.createTable('product', {
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
      enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
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
    await queryInterface.createTable('batch', {
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
    await queryInterface.createTable('order', {
      order_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      username: {
        type: Sequelize.STRING,
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
    await queryInterface.createTable('batch_order', {
      batch_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        references: { model: 'batch', key: 'batch_id' },
      },
      order_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        references: { model: 'order', key: 'order_id' },
      },
      committed: {
        type: Sequelize.SMALLINT,
        allowNull: false,
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('supplier');
    await queryInterface.dropTable('product');
    await queryInterface.dropTable('batch');
    await queryInterface.dropTable('order');
    return queryInterface.dropTable('batch_order');
  },
};
