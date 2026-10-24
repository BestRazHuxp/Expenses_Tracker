const db = require("./database");
db.exec("PRAGMA foreign_keys = ON;");
// db.prepare(
//     `
//         INSERT INTO categories (category_id, limit_amount) VALUES (1, 100000)
//     `
// )

// db.prepare(
//     `
//         INSERT INTO review_months (storage_id, year, month) VALUES (1, 2026, 10)
//     `
// )

// db.prepare(
//     `
//         INSERT INTO current_categories (category_id, limit_amount, storage_id) VALUES (1, 100000, 1)
//     `
// )

db.prepare(
    `
        INSERT INTO transactions (id, amount, coefficient, category_id) VALUES (1, 60000, 1, 1)
    `
)

