const { notFound, handleError } = require('../middlewares/handleError');

const authRouter = require('./auth');
const accountRouter = require('./account');
const pinRouter = require('./pin');

const initRoutes = (app) => {
  app.use('/api/auth', authRouter);
  app.use('/api/account', accountRouter);
  app.use('/api/pin', pinRouter);

  app.use(notFound);
  app.use(handleError);
};

module.exports = initRoutes;
