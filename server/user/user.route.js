const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const userCtrl = require('./user.controller');
const userAuthCtrl = require('../auth/auth.controller').user;

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/users - Get list of users */
  .get(userCtrl.list)

  .put(userAuthCtrl.requireLogin, userCtrl.update)

  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId')
/** GET /api/users/:userId - Get user */
  .get(userCtrl.get)

  .put(userAuthCtrl.requireLogin, userAuthCtrl.requireAdmin, userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(userAuthCtrl.requireLogin, userAuthCtrl.requireAdmin, userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

module.exports = router;
