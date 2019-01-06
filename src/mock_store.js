const products = [
  {
    name: 'Vego Bars',
    batchId: 'batch1',
    productId: 'product1',
    isDiscrete: true,
    unitSize: 1,
    unitName: 'bar',
    requiredUnits: '60',
    totalCost: '36000',
    supplierId: 'supplier1',
    supplierName: 'Vegan Perfection',
  },
  {
    name: 'Nutritional Yeast',
    batchId: 'batch2',
    productId: 'product2',
    isDiscrete: false,
    unitSize: 100,
    unitName: 'g',
    requiredUnits: '20',
    totalCost: '4500',
    supplierId: 'supplier2',
    supplierName: 'Honest To Goodness',
  },
];
const orders = [];

const getProducts = () => {
  const filteredProducts = products;
  const calculatedProducts = filteredProducts.map(product => {
    const relevantOrders = orders.filter(order => {
      return order.batchId === product.batchId;
    });
    const totalCommitted = relevantOrders.reduce((acc, order) => {
      return acc + order.committed;
    }, 0);
    return {
      ...product,
      totalCommitted,
    };
  });
  return calculatedProducts;
};

const getOrders = username => {
  const filteredOrders = orders.filter(o => {
    return o.username === username;
  });
  return filteredOrders;
};

const addOrder = order => {
  orders.push(order);
};

export default {
  addOrder,
  getOrders,
  getProducts,
};
