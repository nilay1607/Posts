const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const morgon = require('morgan');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),
{flags: 'a'}
)

app.use(helmet());
app.use(compression());
app.use(morgon('combined',{ stream:accessLogStream }));

app.use(bodyParser.json()); 

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@nilay-cluster-xc52h.mongodb.net/messages?retryWrites=true&w=majority`,
    {useNewUrlParser: true}
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => {
    console.log(err);
  });