import rbac from '../rbac';
import { Batch, Order, Product, Supplier } from '../../models';
import { mapProduct } from '../helpers/product';

import { UnauthorisedError } from '../errors';

export async function getProducts(sc) {
  if (await rbac.can(sc.roles, 'products:get:active')) {
    const records = await Batch.findAll({
      include: [
        {
          model: Product,
          include: [Supplier],
        },
        Order,
      ],
    });
    return records.map(mapProduct);
  } else {
    throw new UnauthorisedError();
  }
}
