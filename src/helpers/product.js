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
