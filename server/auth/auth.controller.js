const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');
// sample user, used for authentication
const mongoose = require('mongoose');
const User = mongoose.model('User');

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
  let username = req.body.username
  User.findOne({username}).exec((error, user) => {
    if (error) {
      return next(new APIError('内部错误', httpStatus.INTERNAL_SERVER_ERROR, true))
    } else if (!user) {
      var err = new APIError('用户不存在', httpStatus["401"], true);
      return next(err);
    } else {
      if (user.authenticate(req.body.password)) {
        const token = jwt.sign({
          username: user.username
        }, config.jwtSecret);
        return res.json({
          token,
          username: user.username
        });
      } else {
        const err = new APIError('用户名密码错误', httpStatus.UNAUTHORIZED, true);
        return next(err)
      }
    }
  })
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

module.exports = {login, getRandomNumber};
