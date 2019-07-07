const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const consumeCtrl = require('./consume.controller');
const userAuthCtrl = require('../auth/auth.controller').user;


const express = require('express')

const router = express.Router()

router.route('/')
/** GET /api/users - Get list of users */
  .get(consumeCtrl.list)

  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createConsume), consumeCtrl.create);

router.route('/:consumeId')
/** GET /api/users/:userId - Get user */
  .get(consumeCtrl.get)

  .put(userAuthCtrl.requireLogin, consumeCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(userAuthCtrl.requireLogin, consumeCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('consumeId', consumeCtrl.load);

module.exports = router
