import rbac from '../../rbac';
import { Batch, BatchOrder, Product, Supplier } from '../../../models';
import { mapProduct } from './products.mapping';

import { UnauthorisedError } from '../../errors';

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
  } else {
    throw new UnauthorisedError();
  }
}

export async function getProducts(sc) {
  if (await rbac.can(sc.roles, 'products:get:active')) {
    const records = await Product.findAll({
      include: productIncludes,
    });
    return records.map(r => mapProduct(r));
  } else {
    throw new UnauthorisedError();
  }
}
