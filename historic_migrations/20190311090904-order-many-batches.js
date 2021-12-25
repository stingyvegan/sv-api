'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
    const orders = await queryInterface.sequelize.query(
      'SELECT order_id, batch_id, committed, created_at, updated_at from "order";',
      { type: Sequelize.QueryTypes.SELECT },
    );
    if (orders.length > 0) {
      await queryInterface.bulkInsert(
        'batch_order',
        orders[0].map((o) => ({
          batch_id: o.batch_id,
          order_id: o.order_id,
          committed: o.committed,
          created_at: o.created_at,
          updated_at: o.updated_at,
        })),
      );
    }
    await queryInterface.removeColumn('order', 'batch_id');
    return queryInterface.removeColumn('order', 'committed');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('order', 'batch_id', {
      type: Sequelize.UUID,
      references: { model: 'batch', key: 'batch_id' },
    });
    await queryInterface.addColumn('order', 'committed', {
      type: Sequelize.SMALLINT,
      allowNull: false,
    });
    const links = await queryInterface.sequelize.query(
      'SELECT order_id, batch_id, committed FROM batch_order',
    );
    for (let i = 0; i < links[0].length; i++) {
      const link = links[0][i];
      const query = `UPDATE "order" SET batch_id = '${link.batch_id}', committed = ${link.committed} WHERE order_id = '${link.order_id}';`;
      await queryInterface.sequelize.query(query);
    }
    return queryInterface.dropTable('batch_order');
  },
};
