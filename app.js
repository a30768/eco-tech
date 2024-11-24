const express = require('express');
const { Pool } = require('pg');
const client = require('prom-client');

// Configuração básica do Prometheus
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const app = express();
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'users_management',
  password: 'password',
  port: 5432,
});

// Endpoints
app.get('/customers', async (req, res) => {
  const result = await pool.query('SELECT * FROM customer');
  res.json(result.rows);
});

app.get('/employees', async (req, res) => {
  const result = await pool.query('SELECT * FROM employee');
  res.json(result.rows);
});

app.get('/requests', async (req, res) => {
  const result = await pool.query('SELECT * FROM request');
  res.json(result.rows);
});

app.get('/quotes', async (req, res) => {
  const result = await pool.query('SELECT * FROM quote');
  res.json(result.rows);
});

app.get('/orders', async (req, res) => {
  const result = await pool.query('SELECT * FROM sales_order');
  res.json(result.rows);
});


app.post('/customers', async (req, res) => {
  const { name, email } = req.body;
  const result = await pool.query(
    'INSERT INTO customer (name, email) VALUES ($1, $2) RETURNING *',
    [name, email]
  );
  res.json(result.rows[0]);
});

app.post('/employees', async (req, res) => {
  const { name, department } = req.body;
  const result = await pool.query(
    'INSERT INTO employee (name, department) VALUES ($1, $2) RETURNING *',
    [name, department]
  );
  res.json(result.rows[0]);
});

app.post('/requests', async (req, res) => {
  const { customer_id, description } = req.body;
  const result = await pool.query(
    'INSERT INTO request (customer_id, description) VALUES ($1, $2) RETURNING *',
    [customer_id, description]
  );
  res.json(result.rows[0]);
});

app.post('/quotes', async (req, res) => {
  const { request_id, total_amount } = req.body;
  const result = await pool.query(
    'INSERT INTO quote (request_id, total_amount) VALUES ($1, $2) RETURNING *',
    [request_id, total_amount]
  );
  res.json(result.rows[0]);
});

app.post('/orders', async (req, res) => {
  const { customer_id, order_date, total_amount } = req.body;
  const result = await pool.query(
    'INSERT INTO sales_order (customer_id, order_date, total_amount) VALUES ($1, $2, $3) RETURNING *',
    [customer_id, order_date, total_amount]
  );
  res.json(result.rows[0]);
});


app.put('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await pool.query(
    'UPDATE sales_order SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  res.json(result.rows[0]);
});


app.delete('/orders/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM sales_order WHERE id = $1', [id]);
  res.sendStatus(204);
});


// Health Check
app.get('/health', (req, res) => res.status(200).send('OK'));

// Expondo métricas
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(3001, () => console.log('Users Management service is running'));
app.listen(3002, () => console.log('Request for Proposal service is running'));
app.listen(3003, () => console.log('Sales Orders Management service is running'));

