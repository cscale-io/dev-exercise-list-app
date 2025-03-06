INSERT INTO "Category" ("id", "name", "description", "createdAt", "updatedAt") VALUES
(gen_random_uuid(), 'Vegetable', 'Fresh and organic vegetables', NOW(), NOW()),
(gen_random_uuid(), 'Fruit', 'Sweet and nutritious fruits', NOW(), NOW()),
(gen_random_uuid(), 'Dairy', 'Milk-based products and alternatives', NOW(), NOW()),
(gen_random_uuid(), 'Meat', 'Various types of fresh and processed meat', NOW(), NOW()),
(gen_random_uuid(), 'Grain', 'Whole grains, bread, and cereals', NOW(), NOW());