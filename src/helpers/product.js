export const mapProduct = record => {
  return {
    name: record.Product.name,
    batchId: record.id,
    productId: record.Product.id,
    isDiscrete: record.Product.isDiscrete,
    unitSize: record.Product.unitSize,
    unitName: record.Product.unitName,
    requiredUnits: record.Product.requiredUnits,
    totalCost: record.Product.totalCost,
    supplierId: record.Product.Supplier.id,
    supplierName: record.Product.Supplier.name,
    totalCommitted: record.Orders.reduce((sum, order) => {
      return (sum += order.committed);
    }, 0),
  };
};
