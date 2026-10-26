// api để GET transactions
const PORT = 3001
const view_path = "/api/transactions/"
const db = require("./database.js");
const fs = require("node:fs");
const express = require("express");
const app = express();

const getVNTime = () => {
    const now = new Date();

    return now;
}
console.log(getVNTime());
app.get('/api/transactions' , (req, res) => {
    console.log("hello");
    const {period} =  req.query;
    console.log(period);
    res.status(200);
    res.end(`get ${period}`);
});
app.get("/" , (req, res) => {
    
    res.status(200);
    fs.createReadStream("index.html").pipe(res);
});
app.listen(PORT ,() => {console.log(`Running at http://localhost:${PORT}`)});