import rbac from '../rbac';
import { Batch, Order, Product, Supplier } from '../../models';
import { mapProduct } from '../helpers/product';
import mq from '../rabbitmq';

import { UnauthorisedError } from '../errors';

export async function addOrder(sc, newOrder) {
  rbac.can(sc.roles, 'products:get:active').then(p => {
    if (p) {
    } else {
      res.sendStatus(403);
    }
  });
  const [batch, order] = await Promise.all([
    Batch.findByPk(newOrder.batchId),
    Order.create({
      id: newOrder.id,
      username: newOrder.username,
      committed: newOrder.committed,
    }),
  ]);
  await batch.addOrder(order);
  const updatedProduct = await Batch.findByPk(newOrder.batchId, {
    include: [
      {
        model: Product,
        include: [Supplier],
      },
      Order,
    ],
  });
  const mapped = mapProduct(updatedProduct);

  await mq.publish('product_updates', '', {
    batchId: mapped.batchId,
    updatedCommitted: mapped.totalCommitted,
  });
}

export async function getMyOrders(sc) {
  if (await rbac.can(sc.roles, 'orders:get:my')) {
    const orders = await Order.findAll({
      where: {
        username: sc.username,
      },
    });
    return orders;
  } else {
    throw new UnauthorisedError();
  }
}

export async function getActiveOrders(sc) {
  if (await rbac.can(sc.roles, 'orders:get:active')) {
    const orders = await Order.findAll({});
    return orders;
  } else {
    throw new UnauthorisedError();
  }
}
