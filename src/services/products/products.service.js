import rbac from '../../rbac';
import {
  Batch, BatchOrder, Product, Supplier,
} from '../../../models';
import mapProduct from './products.mapping';

import errors from '../../errors';

const productIncludes = [
  {
    model: Batch,
    include: [BatchOrder],
  },
  Supplier,
];

export async function getProduct(sc, productId) {
  if (await rbac.can(sc.roles, 'products:get:active')) {
    const record = await Product.findOne({
      where: { productId },
      include: productIncludes,
    });
    return mapProduct(record);
  }
  throw new errors.UnauthorisedError();
}

export async function getProducts(sc, filters = {}) {
  const { includeInactive = false } = filters;

  const where = {
    ...(!includeInactive && { enabled: true }),
  };

  if (await rbac.can(sc.roles, 'products:get:active')) {
    const records = await Product.findAll({
      include: productIncludes,
      where,
    });
    return records.map((r) => mapProduct(r));
  }
  throw new errors.UnauthorisedError();
}
