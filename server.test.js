const { test } = require('node:test');
const assert = require('node:assert/strict');
const { DatabaseSync } = require('node:sqlite');

test('GET APIs with isolated SQLite data', async () => {
    const db = new DatabaseSync(':memory:');
    db.exec(`
        CREATE TABLE transactions(id INTEGER, amount INTEGER, coefficient INTEGER, created_at TEXT, category_id INTEGER);
        CREATE TABLE categories(category_id INTEGER, limit_amount INTEGER);
        CREATE TABLE review_months(storage_id INTEGER, year INTEGER, month INTEGER);
        CREATE TABLE current_categories(category_id INTEGER, storage_id INTEGER, limit_amount INTEGER);
        INSERT INTO categories VALUES(1,1000),(2,0),(3,100);
        INSERT INTO review_months VALUES(1,2026,10);
        INSERT INTO current_categories VALUES(1,1,1000),(2,1,0);
        INSERT INTO transactions VALUES
        (1,600,-1,'2026-10-23 18:00:00',1),
        (2,200,1,'2026-10-24 01:00:00',1),
        (3,100,-1,'2026-10-23 16:59:59',1),
        (4,300,-1,'2026-09-30 18:00:00',2);
    `);
    require.cache[require.resolve('./database')] = { exports: db };
    const originalNow = Date.now;
    Date.now = () => Date.parse('2026-10-24T05:00:00Z');
    const server = require('./server').listen(0);
    await new Promise(resolve => server.once('listening', resolve));
    async function get(route, status = 200) {
        const response = await fetch(`http://localhost:${server.address().port}${route}`);
        assert.equal(response.status, status);
        return response.json();
    }
    try {
        assert.equal((await get('/api/transactions')).transactions.length, 4);
        assert.deepEqual((await get('/api/transactions?period=day&category_id=1')).transactions.map(t => t.id), [2,1]);
        const week = await get('/api/transactions?period=week');
        assert.equal(week.filters.start_date, '2026-10-19');
        assert.equal(week.filters.end_date, '2026-10-25');
        assert.equal(week.transactions.length, 3);
        const stats = await get('/api/statistics?period=month&category_id=1');
        assert.equal(stats.total_expense, 700);
        assert.equal(stats.day_count, 24);
        assert.equal(stats.average_daily_expense, 29.17);
        assert.equal((await get('/api/statistics?category_id=99')).day_count, 0);
        const performance = await get('/api/performance?year=2026&month=10');
        assert.equal(performance.categories[0].usage_percent, 70);
        assert.equal(performance.categories[0].remaining_amount, 300);
        assert.equal(performance.categories[1].total_expense, 300);
        assert.equal(performance.categories[1].usage_percent, null);
        assert.equal(performance.categories[2].limit_amount, null);
        assert.equal((await get('/api/categories')).categories.length, 3);
        for (const route of ['/api/transactions?period=year', '/api/transactions?period=day&period=week', '/api/transactions?category_id=1%20OR%201=1', '/api/performance?month=13', '/api/transactions?date=2026-10-24'])
            await get(route, 400);
        await get('/api/missing', 404);
    } finally {
        await new Promise(resolve => server.close(resolve));
        Date.now = originalNow;
        db.close();
    }
});
