import rbac from '../../rbac';
import { Batch, Order, Product, Supplier } from '../../../models';
import { mapProduct } from '../products/products.mapping';
import { mapOrder } from './orders.mapping';
import mq from '../../rabbitmq';

import { UnauthorisedError } from '../../errors';

export async function addOrder(sc, newOrder) {
  rbac.can(sc.roles, 'products:get:active').then(p => {
    if (p) {
    } else {
      res.sendStatus(403);
    }
  });
  const [batch, order] = await Promise.all([
    Batch.findByPk(newOrder.batchId),
    Order.create(newOrder),
  ]);
  await batch.addOrder(order);
  const createdOrder = await Order.findByPk(newOrder.orderId, {
    include: [
      {
        model: Batch,
        include: [
          {
            model: Product,
            include: [Supplier],
          },
          Order,
        ],
      },
    ],
  });
  const mapped = mapOrder(createdOrder);

  await mq.publish('product_updates', '', {
    batchId: mapped.batchId,
    updatedCommitted: mapped.product.totalCommitted,
  });

  return mapped;
}

export async function getMyOrders(sc) {
  if (await rbac.can(sc.roles, 'orders:get:my')) {
    const orders = await Order.findAll({
      where: {
        username: sc.username,
      },
      include: [
        {
          model: Batch,
          include: [
            {
              model: Product,
              include: [Supplier],
            },
            Order,
          ],
        },
      ],
    });
    return orders.map(mapOrder);
  } else {
    throw new UnauthorisedError();
  }
}

export async function getActiveOrders(sc) {
  if (await rbac.can(sc.roles, 'orders:get:active')) {
    const orders = await Order.findAll({
      include: [
        {
          model: Batch,
          include: [
            {
              model: Product,
              include: [Supplier],
            },
            Order,
          ],
        },
      ],
    });
    return orders.map(mapOrder);
  } else {
    throw new UnauthorisedError();
  }
}
