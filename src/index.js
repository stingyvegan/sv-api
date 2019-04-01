import dotenv from 'dotenv';
import express from 'express';

import { addMiddlewares, addErrorHandlers } from './middlewares';
import addAuthenticatedRoute from './addAuthenticatedRoute';
import mq from './rabbitmq';
import configureSequelize from './configureSequelize';

import {
  addOrder,
  getMyOrders,
  getActiveOrders,
} from './services/orders/orders.service';
import { getProduct, getProducts } from './services/products/products.service';

dotenv.config();
const port = process.env.PORT;
const app = express();

addMiddlewares(app);
const authenticatedRoute = addAuthenticatedRoute(app);
addErrorHandlers(app);

Promise.all([mq.configureRabbitMQ(), configureSequelize()])
  .then(() => {
    authenticatedRoute.get('/orders/my', (req, res, next) => {
      getMyOrders(res.locals.sc)
        .then(orders => {
          res.send(orders);
        })
        .catch(err => next(err));
    });

    authenticatedRoute.get('/orders', (req, res, next) => {
      getActiveOrders(res.locals.sc)
        .then(orders => {
          res.send(orders);
        })
        .catch(err => next(err));
    });

    authenticatedRoute.get('/products', (req, res, next) => {
      getProducts(res.locals.sc)
        .then(products => {
          res.send(products);
        })
        .catch(err => next(err));
    });

    authenticatedRoute.get('/products/:productId', (req, res, next) => {
      const { productId } = req.params;
      getProduct(res.locals.sc, productId)
        .then(product => {
          res.send(product);
        })
        .catch(err => next(err));
    });

    authenticatedRoute.put('/orders', (req, res, next) => {
      addOrder(res.locals.sc, req.body)
        .then(createdOrder => {
          res.status(200);
          res.send(createdOrder);
        })
        .catch(err => next(err));
    });

    authenticatedRoute.ws('/ws', function(ws, req) {
      let queues = [];
      ws.on('close', () => {
        queues.forEach(q => {
          mq.cancelListen(q);
        });
      });

      mq.listen('product_updates', '', function(message) {
        ws.send(
          JSON.stringify({
            type: 'PRODUCT_CHANGED',
            product: message,
          }),
        );
      })
        .then(function(q) {
          queues.push(q);
        })
        .catch(e => {
          // TODO some sort of error handling here.
          console.error(e);
        });
    });

    app.listen(port, () => {
      console.log(`Stingy Vegan listening on port ${port}`); // eslint-disable-line no-console
    });
  })
  .catch(e => {
    console.error(e);
  });
