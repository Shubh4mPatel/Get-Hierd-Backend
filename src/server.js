const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');
const GlobalErrorHandler = require('./middleware/globalErrorHandler');
const AppError = require('./utils/errorHandler');
const Authentication = require('./services/authentication');


const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  const AuthenticationMiddleware = new Authentication();
  AuthenticationMiddleware.authenticate(req, res, next);
})
// Routes
app.use('api/v1',routes)
app.all('*name', (req, res, next) => {
  const error = new AppError('This route is not defined!', 404);
  next(error);
});


app.use( GlobalErrorHandler.handle);
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});