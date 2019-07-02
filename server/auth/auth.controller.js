const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');
// sample user, used for authentication
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.todo = {
  hasAuthorization:function(req, res, next) {
    if (req.todo.user._id !== req.user._id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/articles/' + req.article.id);
    }
    next();
  }
}

exports.user = {
  login:function(req, res, next) {
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
            id: user._id
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
}
