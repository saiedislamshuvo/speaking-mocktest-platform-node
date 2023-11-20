const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { controllers: authCtrl } = require('../api/v1/auth');
const { controllers: userCtrl } = require('../api/v1/user');
const { controllers: organizationCtrl } = require('../api/v1/organization');
const { controllers: trainerCtrl } = require('../api/v1/trainer');
const { controllers: accountCtrl } = require('../api/v1/account');
const { controllers: mocktestCtrl } = require('../api/v1/mocktest');

// Auth routes
router
  .post('/api/v1/auth/login', authCtrl.login)
  .post('/api/v1/auth/register', authCtrl.register);

// Mocktest routes
router
  .route('/api/v1/mocktests')
  .get(mocktestCtrl.index)
  .post(authenticate, authorize(['admin', 'user']), mocktestCtrl.store);

router
  .route('/api/v1/mocktests/:id')
  .get(mocktestCtrl.findById)
  .patch(authenticate, authorize(['admin', 'user', 'trainer']), mocktestCtrl.update)
  .delete(authenticate, authorize(['admin']), mocktestCtrl.deleteById);

// Account routes
router
  .route('/api/v1/account/request-to-become-trainer')
  .get(authenticate, authorize(['user']), accountCtrl.requestToBecomeTrainer);

router
  .route('/api/v1/account/mocktests')
  .post(authenticate, authorize(['user']), accountCtrl.myMocktests);

// Organization routes
router
  .route('/api/v1/organizations')
  .get(organizationCtrl.index)
  .post(authenticate, authorize(['admin', 'user']), organizationCtrl.store);

router
  .route('/api/v1/organizations/:id')
  .get(organizationCtrl.findById)
  .put(authenticate, authorize(['admin', 'user']), organizationCtrl.update)
  .patch(authenticate, authorize(['admin', 'user']), organizationCtrl.patchById)
  .delete(authenticate, authorize(['admin']), organizationCtrl.deleteById);

router
  .route('/api/v1/organizations/:id/trianer')
  .get(authenticate, organizationCtrl.getTrainer)
  .post(authenticate, organizationCtrl.createTrainer)

// Trainer routes
router
  .route('/api/v1/trainers')
  .get(trainerCtrl.index)
  .post(authenticate, authorize(['admin']), trainerCtrl.store);

router
  .route('/api/v1/trainers/:id')
  .get(trainerCtrl.findById)
  .patch(authenticate, authorize(['admin']), trainerCtrl.update)
  .delete(authenticate, authorize(['admin']), trainerCtrl.deleteById);

// User routes
router
  .route('/api/v1/users')
  .get(authenticate, authorize(['admin']), userCtrl.index)
  .post(authenticate, authorize(['admin']), userCtrl.store);

router
  .route('/api/v1/users/:id')
  .get(userCtrl.findById)
  .put(authenticate, authorize(['admin']), userCtrl.update)
  .patch(authenticate,  authorize(['admin']), userCtrl.patchById)
  .delete(authenticate, authorize(['admin']), userCtrl.deleteById);

module.exports = router;
