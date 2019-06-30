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

    await queryInterface.bulkInsert('supplier', [honestToGoodness], {});
    return queryInterface.bulkInsert('product', [nutritionalYeast], {});
  },

  down: (queryInterface, Sequelize) => {},
};
