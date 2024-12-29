const express = require('express');
const dbConnect = require('./config/dbConnect');
const initRoutes = require('./routes/index');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3030;

app.use(express.json());
app.use(
  cors({
    origin: true,
    methods: ['POST', 'PUT', 'GET', 'DELETE'],
    credentials: true
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

dbConnect();
initRoutes(app);

app.listen(port, () => {
  console.log(`Server running successfully!`);
});
