import Sequelize from 'sequelize';

export default async function configureSequelize() {
  console.log(`Attempting to connect to ${process.env.MYSQL_HOST}`);
  const sequelize = new Sequelize(
    process.env.MYSQL_DB,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASS,
    {
      host: process.env.MYSQL_HOST,
      dialect: 'mysql',
    },
  );

  const connection = await sequelize.authenticate();
  console.log('Connection to my sql established successfully');

  const Supplier = sequelize.define('supplier', {
    name: Sequelize.STRING,
  });

  const Product = sequelize.define('product', {
    name: Sequelize.STRING,
    isDiscrete: Sequelize.BOOLEAN,
    unitSize: Sequelize.SMALLINT,
    unitName: Sequelize.STRING,
    requiredUnits: Sequelize.SMALLINT,
    totalCost: Sequelize.INTEGER,
  });

  const Batch = sequelize.define('batch', {});

  const Order = sequelize.define('order', {
    username: Sequelize.STRING,
    committed: Sequelize.SMALLINT,
  });

  Supplier.hasMany(Product);
  Product.belongsTo(Supplier);
  Product.hasMany(Batch);
  Batch.belongsTo(Product);
  Batch.hasMany(Order);
  Order.belongsTo(Batch);

  await Promise.all([
    Supplier.sync(),
    Product.sync(),
    Batch.sync(),
    Order.sync(),
  ]);

  // await Promise.all([
  //   Supplier.destroy({
  //     where: {},
  //   }),
  //   Product.destroy({
  //     where: {},
  //   }),
  //   Batch.destroy({
  //     where: {},
  //   }),
  //   Order.destroy({
  //     where: {},
  //   }),
  // ]);

  // const supplier = await Supplier.create({
  //   name: 'Vegan Perfection',
  // });
  // const supplier2 = await Supplier.create({
  //   name: 'Honest To Goodness',
  // });

  // const prod = await Product.create({
  //   name: 'Vego Bars',
  //   isDiscrete: true,
  //   unitSize: 1,
  //   unitName: 'bar',
  //   requiredUnits: 60,
  //   totalCost: 36000,
  // });
  // await supplier.setProducts([prod]);

  // const prod2 = await Product.create({
  //   name: 'Nutritional Yeast',
  //   isDiscrete: false,
  //   unitSize: 100,
  //   unitName: 'g',
  //   requiredUnits: 20,
  //   totalCost: 4500,
  // });
  // await supplier2.setProducts([prod2]);

  // const batch = await Batch.create({});
  // await prod.setBatches([batch]);
  // const batch2 = await Batch.create({});
  // await prod2.setBatches([batch2]);

  return {
    connection,
    entities: {
      Supplier,
      Product,
      Batch,
      Order,
    },
  };
}
