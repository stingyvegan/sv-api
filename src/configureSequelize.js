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
      logging: false,
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
