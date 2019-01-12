import dotenv from 'dotenv';
import express from 'express';

import addMiddlewares from './addMiddlewares';
import addAuthenticatedRoute from './addAuthenticatedRoute';
import configureRabbitMQ from './configureRabbitMQ';
import mockStore from './mock_store';

dotenv.config();
const port = process.env.PORT;
const app = express();

addMiddlewares(app);
const authenticatedRoute = addAuthenticatedRoute(app);

configureRabbitMQ().then(function(mq) {
  authenticatedRoute.get('/orders', (req, res) => {
    res.send(mockStore.getOrders(res.locals.user.username));
  });

  authenticatedRoute.get('/products', (req, res) => {
    res.send(mockStore.getProducts());
  });

  authenticatedRoute.put('/orders', (req, res) => {
    mockStore.addOrder(req.body);
    const updatedProduct = mockStore
      .getProducts()
      .filter(p => p.batchId === req.body.batchId)[0];
    mq.publish('product_updates', '', {
      batchId: updatedProduct.batchId,
      updatedCommitted: updatedProduct.totalCommitted,
    });
    res.status(200);
    res.send();
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
});
