import { mapProduct } from '../products/products.mapping';

/**
 * Map an order record from sequelize to a record to be sent to the client.
 * Must have batch, product and supplier included.
 * @param {*} record The order record to be mapped.
 */
export const mapOrder = record => {
  const result = {
    product: mapProduct(record.Batch),
    username: record.username,
    batchId: record.batchId,
    orderId: record.orderId,
    committed: record.committed,
  };
  return result;
};
