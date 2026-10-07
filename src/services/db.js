import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('pos_inventory.db');

export function initDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL
    );
  `);

  const countRow = db.getFirstSync(
    'SELECT COUNT(*) as count FROM products;'
  );

  if (countRow.count === 0) {
    db.runSync(
      `INSERT INTO products
        (name, category, price, stock)
       VALUES
        (?, ?, ?, ?),
        (?, ?, ?, ?),
        (?, ?, ?, ?);`,
      [
        'Gourmet Angus Burger',
        'Burgers',
        345,
        10,

        'Classic Neapolitan Pizza',
        'Pizza',
        420,
        10,

        'Premium Sushi Set',
        'Sushi',
        580,
        10
      ]
    );
  }
}

export function getProducts(search = '') {
  if (search.trim() === '') {
    return db.getAllSync(
      'SELECT * FROM products ORDER BY id DESC;'
    );
  }

  return db.getAllSync(
    `SELECT * FROM products
     WHERE name LIKE ?
     ORDER BY name ASC;`,
    [`%${search}%`]
  );
}

export function addProduct(name, category, price, stock) {
  db.runSync(
    `INSERT INTO products
      (name, category, price, stock)
     VALUES (?, ?, ?, ?);`,
    [
      name,
      category,
      Number(price),
      Number(stock)
    ]
  );
}

export function deleteProduct(id) {
  db.runSync(
    'DELETE FROM products WHERE id = ?;',
    [id]
  );
}