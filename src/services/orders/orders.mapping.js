const mapBatch = record => {
  return {
    batchId: record.batchId,
    productId: record.productId,
    totalCommitted: record.BatchOrders.reduce((acc, bo) => {
      return acc + bo.committed;
    }, 0),
  };
};

const mapBatchOrder = record => {
  const result = {
    committed: record.committed,
    batch: mapBatch(record.Batch),
  };
  return result;
};

/**
 * Map an order record from sequelize to a record to be sent to the client.
 * Must have batch, product and supplier included.
 * @param {*} record The order record to be mapped.
 */
export const mapOrder = record => {
  const result = {
    username: record.username,
    orderId: record.orderId,
    orderDate: record.created_at,
    batchOrders: record.BatchOrders.map(mapBatchOrder),
  };
  return result;
};
