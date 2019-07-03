import rbac from '../../rbac';
import {
  BatchOrder, Batch, Order, sequelize,
} from '../../../models';
import mapOrder from './orders.mapping';
import mq from '../../rabbitmq';

import * as productService from '../products/products.service';

import errors from '../../errors';

const orderInclude = [
  {
    model: BatchOrder,
    include: [
      {
        model: Batch,
        include: [BatchOrder],
      },
    ],
  },
];

export async function addOrder(sc, newOrder) {
  if (await rbac.can(sc.roles, 'orders:order:my')) {
    await sequelize.transaction(async (t) => {
      // Add the order and any new batches
      const orderPromise = Order.create(
        {
          orderId: newOrder.orderId,
          username: newOrder.username,
        },
        { transaction: t },
      );
      const batchPromises = newOrder.batchOrders
        .filter(bo => bo.existingCommitted === 0)
        .map(bo => Batch.create(
          {
            batchId: bo.batchId,
            productId: newOrder.productId,
          },
          { transaction: t },
        ));
      await Promise.all([orderPromise, ...batchPromises]);

      // Add the batchOrder records
      return Promise.all(
        newOrder.batchOrders.map(bo => BatchOrder.create(
          {
            batchId: bo.batchId,
            orderId: newOrder.orderId,
            committed: bo.committed,
          },
          { transaction: t },
        )),
      );
    });

    // Get the updated product and publish the change message
    const product = await productService.getProduct(sc, newOrder.productId);
    await mq.publish('product_updates', '', product);

    // Get the updated order and return
    const createdOrder = await Order.findByPk(newOrder.orderId, {
      include: orderInclude,
    });
    const mapped = mapOrder(createdOrder);
    return mapped;
  }
  throw new errors.UnauthorisedError();
}

export async function getMyOrders(sc) {
  if (await rbac.can(sc.roles, 'orders:get:my')) {
    const orders = await Order.findAll({
      where: {
        username: sc.username,
      },
      include: orderInclude,
      order: [['created_at', 'DESC']],
    });
    return orders.map(mapOrder);
  }
  throw new errors.UnauthorisedError();
}

export async function getActiveOrders(sc) {
  if (await rbac.can(sc.roles, 'orders:get:active')) {
    const orders = await Order.findAll({
      include: orderInclude,
      order: [['created_at', 'DESC']],
    });
    return orders.map(mapOrder);
  }
  throw new errors.UnauthorisedError();
}
