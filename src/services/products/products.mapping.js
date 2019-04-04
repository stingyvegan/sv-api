function sumCommitted(batchOrders) {
  return batchOrders.reduce((acc, bo) => {
    return acc + bo.committed;
  }, 0);
}

/**
 * Map a batch record from sequelize to a record to be sent to the client.
 * Must have Product and Orders included.
 * @param {*} record The Batch record to be mapped.
 */
export function mapProduct(record) {
  const currentBatch = record.Batches.find(batch => {
    return sumCommitted(batch.BatchOrders) < record.requiredUnits;
  });

  const totalCommitted = currentBatch
    ? sumCommitted(currentBatch.BatchOrders)
    : 0;

  return {
    name: record.name,
    productId: record.productId,
    isDiscrete: record.isDiscrete,
    unitSize: record.unitSize,
    unitName: record.unitName,
    requiredUnits: record.requiredUnits,
    totalCost: record.totalCost,
    enabled: record.enabled,
    supplierId: record.Supplier.supplierId,
    supplierName: record.Supplier.name,
    totalCommitted,
    currentBatch: (currentBatch || { batchId: null }).batchId,
  };
}
