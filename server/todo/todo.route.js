const express = require('express');
const validate = require('express-validation');
const expressJwt = require('express-jwt');
const paramValidation = require('../../config/param-validation');

const todoCtrl = require('./todo.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/users - Get list of users */
  .get(todoCtrl.list)

  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createTodo), todoCtrl.create);

router.route('/:todoId')
/** GET /api/users/:userId - Get user */
  .get(todoCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(validate(paramValidation.updateUser), todoCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(todoCtrl.remove);

module.exports = router;
