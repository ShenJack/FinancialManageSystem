const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');
const mongoose = require('mongoose');
const VerifyImage = require('../common/verifyImage.model')
const User = mongoose.model('User');
const svgCaptcha = require('svg-captcha');

exports.todo = {
  hasAuthorization: function (req, res, next) {
    if (req.todo.user && req.todo.user._id !== req.user._id) {
      var err = new APIError('权限不足', httpStatus["403"], true);
      return next(err)
    }
    next();
  }
};

exports.user = {
  login: function (req, res, next) {
    // Ideally you'll fetch this from the db
    // Idea here was to show how jwt works with simplicity
    VerifyImage.findById(req.body.verifyId).exec((error,image)=>{
      if(image){
        if(image.code !== req.body.code){
          let err = new APIError('验证码错误', httpStatus.UNAUTHORIZED, true);
          return next(err);
        }else {
          /*验证通过*/
          image.remove().then(res=>{
            let username = req.body.username
            User.findOne({ username }).exec((error, user) => {
              if (error) {
                return next(new APIError('内部错误', httpStatus.INTERNAL_SERVER_ERROR, true))
              } else if (!user) {
                var err = new APIError('用户不存在', httpStatus.UNAUTHORIZED, true);
                return next(err);
              } else {
                if (user.authenticate(req.body.password)) {
                  const token = jwt.sign({
                    _id: user._id
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
          })
        }
      }else {
        let err = new APIError('验证码错误', httpStatus.UNAUTHORIZED, true);
        return next(err);
      }
    })


  },


  getVerifyCodeImage: function (req, res,next) {
    let option = {
      size: 4,  //验证码长度
      width: 200,
      height: 150,
      background: "#f4f3f2",//干扰线条数
      fontSize: 64,
      ignoreChars: '0o1i',   //验证码字符中排除'0o1i'
      color: true // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    };
    let code = svgCaptcha.create(option);
    const verifyImage = new VerifyImage({
      code:code.text.toLowerCase()
    })
    verifyImage.save().then(result=>{
      res.send({
        id:result._id,
        img:code.data
      })
    })
  },

  /**
   * This is a protected route. Will return random number only if jwt token is provided in header.
   * @param req
   * @param res
   * @returns {*}
   */

  getRandomNumber: function (req, res) {
    // req.user is assigned by jwt middleware if valid token is provided
    return res.json({
      user: req.user,
      num: Math.random() * 100
    });
  },

  requireLogin(req, res, next) {
    if (!req.isAuthenticated) {
      return next(new APIError('Need Token', httpStatus.FORBIDDEN))
    } else {
      return next()
    }
  }
};
