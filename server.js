// dependencies
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const {
  notFoundHandler,
  errorHandler,
} = require('./middlewares/common/errorHandlers');
const urlencoded = require('express');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth/authRoute');
const mongoose = require('mongoose');

// init app
const app = express();
dotenv.config();

// PORT
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(urlencoded({ extended: true })); // handle form data with parameters
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// settings
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// get index
app.get('/', (req, res) => {
  res.render('pages/index');
});

// auth routes
app.use(authRoute);

// not found handler
app.use(notFoundHandler);

// error handler
app.use(errorHandler);

// listening
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log('DB connection established');
      console.log(`Server listening at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
