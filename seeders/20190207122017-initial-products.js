'use strict';
const uuid = require('uuid/v4');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const honestToGoodness = {
      name: 'Honest To Goodness',
      supplier_id: uuid(),
      created_at: now,
      updated_at: now,
    };
    const veganPerfection = {
      name: 'Vegan Perfection',
      supplier_id: uuid(),
      created_at: now,
      updated_at: now,
    };

    const nutritionalYeast = {
      name: 'Nutritional Yeast',
      product_id: uuid(),
      created_at: now,
      updated_at: now,
      is_discrete: false,
      unit_size: 100,
      unit_name: 'g',
      required_units: 5,
      total_cost: 1331,
      supplier_id: honestToGoodness.supplier_id,
    };
    const beyondBurger = {
      name: 'The Beyond Burger',
      product_id: uuid(),
      created_at: now,
      updated_at: now,
      is_discrete: true,
      unit_size: 1,
      unit_name: 'burger',
      required_units: 42,
      total_cost: 17100,
      supplier_id: veganPerfection.supplier_id,
    };
    const vegoBar = {
      name: '150g Vego Hazelnut Choc Bar',
      product_id: uuid(),
      created_at: now,
      updated_at: now,
      is_discrete: true,
      unit_size: 1,
      unit_name: 'bar',
      required_units: 30,
      total_cost: 13530,
      supplier_id: veganPerfection.supplier_id,
    };

    await queryInterface.bulkInsert('supplier', [honestToGoodness, veganPerfection], {});
    return queryInterface.bulkInsert('product', [nutritionalYeast, beyondBurger, vegoBar], {});
  },

  down: (queryInterface, Sequelize) => {},
};
