'use strict';
const uuid = require('uuid/v4');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const honestToGoodness = {
      name: 'Honest To Goodness',
      supplier_id: uuid(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const nutritionalYeast = {
      name: 'Nutritional Yeast',
      product_id: uuid(),
      created_at: new Date(),
      updated_at: new Date(),
      is_discrete: false,
      unit_size: 100,
      unit_name: 'g',
      required_units: 5,
      total_cost: 1331,
      supplier_id: honestToGoodness.supplier_id,
    };

    const nutritionalYeastBatch = {
      batch_id: uuid(),
      created_at: new Date(),
      updated_at: new Date(),
      product_id: nutritionalYeast.product_id,
    };

    await queryInterface.bulkInsert('supplier', [honestToGoodness], {});
    await queryInterface.bulkInsert('product', [nutritionalYeast], {});
    return await queryInterface.bulkInsert(
      'batch',
      [nutritionalYeastBatch],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {},
};
