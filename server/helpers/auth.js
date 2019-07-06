const config = require('../../config/config')
const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User')
const APIError = require('./APIError')
const httpStatus = require('http-status')
exports.jwt = {
  jwtValidator:async function(req, res, next) {
    // req.header
    if(!req.headers.authorization ||
      req.headers.authorization.split(' ')[0]!=='Bearer'){
      req.isAuthenticated = false
      next()
    }else {
      let token = req.headers.authorization.split(' ')[1]
      jwt.verify(token, config.jwtSecret, (err,decoded)=>{
        if(err){
          req.isAuthenticated = false
          next(new APIError('Invalid Token',httpStatus.UNAUTHORIZED))
        }else {
          User.findById(decoded._id).exec()
            .then(user=>{
              req.user = user
              req.isAuthenticated = true
              return next()
            })
            .catch(err=>{
              req.isAuthenticated = false
              return next(new APIError('Invalid Token',httpStatus.UNAUTHORIZED))
            })
        }
      });
    }
  },
}
