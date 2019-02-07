INSERT INTO suppliers (name, createdAt, updatedAt) VALUES ('Vegan Perfection', NOW(), NOW());
INSERT INTO products (name, isDiscrete, unitSize, unitName, requiredUnits, totalCost, supplierid, createdAt, updatedAt) VALUES ('Vego Bars', true, 1, 'bar', 60, 36000, LAST_INSERT_ID(), NOW(), NOW());
INSERT INTO batches (createdAt, updatedAt, productId) VALUES (NOW(), NOW(), LAST_INSERT_ID());

INSERT INTO suppliers (name, createdAt, updatedAt) VALUES ('Honest To Goodness', NOW(), NOW());
INSERT INTO products (name, isDiscrete, unitSize, unitName, requiredUnits, totalCost, supplierid, createdAt, updatedAt) VALUES ('Nutritional Yeast', true, 100, 'g', 20, 4500, LAST_INSERT_ID(), NOW(), NOW());
INSERT INTO batches (createdAt, updatedAt, productId) VALUES (NOW(), NOW(), LAST_INSERT_ID());
