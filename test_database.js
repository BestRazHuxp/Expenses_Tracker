const db = require("./database");

db.prepare(
    `
        INSERT INTO transactions (category_id, amount, coefficient) VALUES (1, 1000, 1)
    `
).run();



