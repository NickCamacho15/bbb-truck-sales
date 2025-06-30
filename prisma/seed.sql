-- Create initial admin user
-- Password is 'admin123' hashed with bcrypt
INSERT INTO users (id, username, email, password, role, created_at, updated_at)
VALUES (
  'admin-user-id',
  'admin',
  'admin@bbbtrucksales.com',
  '$2a$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm',
  'ADMIN',
  NOW(),
  NOW()
) ON CONFLICT (username) DO NOTHING;

-- Insert sample trucks
INSERT INTO trucks (id, title, price, year, make, model, trim, mileage, fuel_type, transmission, drivetrain, color, vin, stock_number, description, status, featured, created_at, updated_at)
VALUES 
(
  'truck-1',
  '2022 Ford F-150 XLT',
  42999,
  2022,
  'Ford',
  'F-150',
  'XLT',
  15420,
  'Gasoline',
  'Automatic',
  '4WD',
  'Oxford White',
  '1FTEW1EP5NKD12345',
  'F22-0123',
  'This 2022 Ford F-150 XLT is in excellent condition with low mileage. It features the powerful 3.5L EcoBoost V6 engine, 4x4 drivetrain, and comes loaded with features.',
  'AVAILABLE',
  true,
  NOW(),
  NOW()
),
(
  'truck-2',
  '2021 Ford F-250 Super Duty Lariat',
  56799,
  2021,
  'Ford',
  'F-250',
  'Lariat',
  22150,
  'Diesel',
  'Automatic',
  '4WD',
  'Agate Black',
  '1FT7W2BT5MED12345',
  'F21-0456',
  'This 2021 Ford F-250 Super Duty Lariat is a powerful work truck with the legendary Power Stroke diesel engine.',
  'AVAILABLE',
  true,
  NOW(),
  NOW()
) ON CONFLICT (vin) DO NOTHING;
