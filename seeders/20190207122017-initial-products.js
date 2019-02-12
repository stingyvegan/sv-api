'use strict';
const uuid = require('uuid/v4');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const veganPerfection = {
      name: 'Vegan Perfection',
      id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const honestToGoodness = {
      name: 'Vegan Perfection',
      id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const vegoBars = {
      name: 'Vego Bars',
      id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDiscrete: true,
      unitSize: 1,
      unitName: 'bar',
      requiredUnits: 60,
      totalCost: 36000,
      supplierId: veganPerfection.id,
    };
    const nutritionalYeast = {
      name: 'Nutritional Yeast',
      id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDiscrete: false,
      unitSize: 100,
      unitName: 'g',
      requiredUnits: 20,
      totalCost: 4500,
      supplierId: honestToGoodness.id,
    };

    const vegoBarsBatch = {
      id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      productId: vegoBars.id,
    };
    const nutritionalYeastBatch = {
      id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      productId: nutritionalYeast.id,
    };

    await queryInterface.bulkInsert(
      'Suppliers',
      [veganPerfection, honestToGoodness],
      {},
    );
    await queryInterface.bulkInsert(
      'Products',
      [vegoBars, nutritionalYeast],
      {},
    );
    return await queryInterface.bulkInsert(
      'Batches',
      [vegoBarsBatch, nutritionalYeastBatch],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {},
};
