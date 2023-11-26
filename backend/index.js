const express = require('express');

const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');

const adminManagementRoutes = require('./routes/adminManagement');

const errorController = require('./controllers/error');

const app = express();

const ports = process.env.PORT || 3005;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*','Authorization');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS','Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, X-Custom-Header, Authorization'
  );
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use('/auth', authRoutes);

app.use('/admin', adminManagementRoutes);

app.use(errorController.get404);

app.use(errorController.get500);

app.listen(ports, () => console.log(`Listening on port ${ports}`));
