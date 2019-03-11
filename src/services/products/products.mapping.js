/**
 * Map a batch record from sequelize to a record to be sent to the client.
 * Must have Product and Orders included.
 * @param {*} record The Batch record to be mapped.
 */
export const mapProduct = record => {
  return {
    name: record.Product.name,
    batchId: record.batchId,
    productId: record.Product.productId,
    isDiscrete: record.Product.isDiscrete,
    unitSize: record.Product.unitSize,
    unitName: record.Product.unitName,
    requiredUnits: record.Product.requiredUnits,
    totalCost: record.Product.totalCost,
    supplierId: record.Product.Supplier.supplierId,
    supplierName: record.Product.Supplier.name,
    totalCommitted: record.Orders.reduce((sum, order) => {
      return (sum += order.committed);
    }, 0),
  };
};
