// api để GET transactions
const PORT = 3001
const {URLSearchParams} = require("node:url");
const db = require("./database.js");
const fs = require("node:fs");
const express = require("express");
const { boundedChannel } = require("node:diagnostics_channel");

const app = express();
app.get("/api/categories" , (req, res) => 
{    const categories = db.prepare(
        `
            SELECT current_categories.category_id as category_id, 
            categories.name as name FROM 
            current_categories LEFT JOIN categories ON current_categories.category_id = categories.category_id
        `
    ).all()
    res.status(200);
    res.json(categories); 
})
app.get("/SelectLoader.js", (req, res) => {
    res.sendFile("SelectLoader.js", { root: __dirname });
});

const display = () => {
    app.get("/" ,async (req, res) => {
        res.status(200);
        fs.createReadStream("index.html").pipe(res);
    });
    
}
const getTimeRange = (period) => {
    const now = new Date();
    let start, end;

    switch (period) {
        case "day":
            start = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );

            end = new Date(start);
            end.setDate(end.getDate() + 1);
            break;

        case "week":
            start = new Date(now);
            const diff = (now.getDay() + 6) % 7;

            start.setDate(now.getDate() - diff);
            start.setHours(0, 0, 0, 0);

            end = new Date(start);
            end.setDate(end.getDate() + 7);
            break;

        case "month":
            start = new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );

            end = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                1
            );
            break;

        case "year":
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date(now.getFullYear() + 1, 0, 1);
            break;

        default:
            throw new Error("Invalid period");
    }

    return { start, end };
}
const convertSQliteDate = (date) => {
    return date.toISOString().slice(0, 19).replace("T", " ");
}
app.get('/api/transactions' , (req, res) => {
    const {period} =  req.query;
    const range = getTimeRange(period);
    res.status(200);
    console.log("PERIOD:", req.query.period);

console.log("START:", convertSQliteDate(range.start));
console.log("END:", convertSQliteDate(range.end));

console.log("DATABASE:", db.prepare(`
    SELECT id, created_at
    FROM transactions
`).all());
    const action = db.prepare(
        'SELECT * from transactions WHERE created_at >= (?) AND created_at < (?)'
    ).all(convertSQliteDate(range.start) , convertSQliteDate(range.end));
    console.log(action);
    res.end(JSON.stringify(action));

});
app.post("/api/transactions" , (req, res) => {
    let body = "";
    req.on("data" , (chunk) => {
        body += chunk.toString();
    });
    req.on("end" , () => {
        console.log(body);
        params = new URLSearchParams(body);
        const category_id = params.get("category");
        const created_at = params.get("date").toString();
        const amount = params.get("amount");
        const coefficient = params.get("coefficient");
        const note = params.get("note");
        let query; 
        if(created_at != ""){
            final_date = new Date(created_at)
            .toString()
            .slice(0, 19)
            .replace("T" , " ");
            query = db.prepare(
                `
                INSERT INTO transactions (category_id, amount, created_at, coefficient, note)
                VALUES 
                `
            );
        }
        else {
            
        }
        res.end("hello");
    })
});
display();
app.listen(PORT ,() => {console.log(`Running at http://localhost:${PORT}`)});