const express = require('express');
const validate = require('express-validation');
const expressJwt = require('express-jwt');
const paramValidation = require('../../config/param-validation');
const authCtrl = require('../auth/auth.controller')
const todoCtrl = require('./todo.controller');
const config = require('../../config/config');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/users - Get list of users */
  .get(authCtrl.user.requireLogin,todoCtrl.list,
  )

  /** POST /api/users - Create new user */
  /*Requires login */
  .post(validate(paramValidation.createTodo),
    expressJwt({secret: config.jwtSecret}),
    todoCtrl.create);

router.route('/:todoId')
/** GET /todos/todoId - Get todo*/
  .get(todoCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(
    authCtrl.todo.hasAuthorization,
    authCtrl.user.requireLogin,
    todoCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(expressJwt({secret: config.jwtSecret}), todoCtrl.remove);

router.param('todoId', todoCtrl.load);

module.exports = router;
