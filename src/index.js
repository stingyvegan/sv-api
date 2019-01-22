import dotenv from 'dotenv';
import express from 'express';

import addMiddlewares from './addMiddlewares';
import addAuthenticatedRoute from './addAuthenticatedRoute';
import configureRabbitMQ from './configureRabbitMQ';
import configureSequelize from './configureSequelize';
import mockStore from './mock_store';

dotenv.config();
const port = process.env.PORT;
const app = express();

addMiddlewares(app);
const authenticatedRoute = addAuthenticatedRoute(app);

Promise.all([configureRabbitMQ(), configureSequelize()])
  .then(([mq, sql]) => {
    const { entities, connection } = sql;
    const { Supplier, Product, Batch, Order } = entities;

    const mapProduct = record => {
      return {
        name: record.product.name,
        batchId: record.id,
        productId: record.product.id,
        isDiscrete: record.product.isDiscrete,
        unitSize: record.product.unitSize,
        unitName: record.product.unitName,
        requiredUnits: record.product.requiredUnits,
        totalCost: record.product.totalCost,
        supplierId: record.product.supplier.id,
        supplierName: record.product.supplier.name,
        totalCommitted: record.orders.reduce((sum, order) => {
          return (sum += order.committed);
        }, 0),
      };
    };

    authenticatedRoute.get('/orders', (req, res) => {
      Order.findAll({
        where: {
          username: res.locals.user.username,
        },
      }).then(result => {
        res.send(result);
      });
    });

    authenticatedRoute.get('/products', (req, res) => {
      Batch.findAll({
        include: [
          {
            model: Product,
            include: [Supplier],
          },
          Order,
        ],
      }).then(records => {
        const mapped = records.map(mapProduct);
        res.send(mapped);
      });
    });

    async function addOrder(newOrder) {
      const [batch, order] = await Promise.all([
        Batch.findByPk(newOrder.batchId),
        Order.create({
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

    authenticatedRoute.put('/orders', (req, res) => {
      addOrder(req.body).then(() => {
        res.status(200);
        res.send();
      });
    });

    authenticatedRoute.ws('/productChanges', function(ws, req) {
      let queue;
      ws.on('close', () => {
        mq.cancelListen(queue, 'product_updates');
      });

      try {
        mq.listen('product_updates', '', function(message) {
          ws.send(
            JSON.stringify({
              type: 'PRODUCT_CHANGED',
              batchId: message.batchId,
              updatedCommitted: message.updatedCommitted,
            }),
          );
        }).then(function(q) {
          queue = q;
        });
      } catch (e) {
        console.error(e);
      }
    });

    app.listen(port, () => {
      console.log(`Stingy Vegan listening on port ${port}`); // eslint-disable-line no-console
    });
  })
  .catch(e => {
    console.error(e);
  });
