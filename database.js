const {DatabaseSync} = require("node:sqlite");

const expenses = new DatabaseSync("expenses.db");

expenses.exec(
    `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY,
        amount INTEGER NOT NULL CHECK(amount > 0), 
        coefficient INTEGER NOT NULL CHECK(coefficient IN (1, -1)),
        created_at DATE DEFAULT CURRENT_TIMESTAMP,
        category_id INTEGER,
        FOREIGN KEY(category_id)
            REFERENCES categories(category_id)     
            
    )`
);

expenses.exec(
    `CREATE TABLE IF NOT EXISTS current_categories (
        category_id INTEGER NOT NULL,
        storage_id INTEGER NOT NULL, 
        limit_amount INTEGER NOT NULL, 
        PRIMARY KEY(storage_id, category_id), 
        FOREIGN KEY(category_id)
            REFERENCES categories(category_id),
        FOREIGN KEY(storage_id)
            REFERENCES review_months(storage_id)
    )`
);

expenses.exec(
    `
    CREATE TABLE IF NOT EXISTS categories(
        category_id INTEGER PRIMARY KEY, 
        limit_amount INTEGER NOT NULL    
    )
    `
)

expenses.exec(
    `
    CREATE TABLE IF NOT EXISTS review_months(
        storage_id INTEGER PRIMARY KEY,
        year INTEGER NOT NULL,
        month INTEGER NOT NULL,
        UNIQUE(year, month)
    )
    `
)

module.exports = expenses;