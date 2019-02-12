import dotenv from 'dotenv';
import express from 'express';

import addMiddlewares from './addMiddlewares';
import addAuthenticatedRoute from './addAuthenticatedRoute';
import configureRabbitMQ from './configureRabbitMQ';
import configureSequelize from './configureSequelize';

import { Supplier, Product, Batch, Order } from '../models';

dotenv.config();
const port = process.env.PORT;
const app = express();

addMiddlewares(app);
const authenticatedRoute = addAuthenticatedRoute(app);

Promise.all([configureRabbitMQ(), configureSequelize()])
  .then(([mq, sqlConnection]) => {
    const mapProduct = record => {
      return {
        name: record.Product.name,
        batchId: record.id,
        productId: record.Product.id,
        isDiscrete: record.Product.isDiscrete,
        unitSize: record.Product.unitSize,
        unitName: record.Product.unitName,
        requiredUnits: record.Product.requiredUnits,
        totalCost: record.Product.totalCost,
        supplierId: record.Product.Supplier.id,
        supplierName: record.Product.Supplier.name,
        totalCommitted: record.Orders.reduce((sum, order) => {
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
          id: newOrder.orderId,
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

    authenticatedRoute.ws('/ws', function(ws, req) {
      let queues = [];
      ws.on('close', () => {
        queues.forEach(q => {
          mq.cancelListen(q);
        });
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
          queues.push(q);
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
