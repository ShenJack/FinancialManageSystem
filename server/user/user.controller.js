const User = require('./user.model');
const APIError = require('../helpers/APIError')
const httpStatus = require('http-status');
const only = require('only')

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.findById(id)
    .then((user) => {
      if (user) {
        req.targetUser = user; // eslint-disable-line no-param-reassign
        return next();
      } else {
        return next(new APIError("No such user", httpStatus.NOT_FOUND))
      }
    })
    .catch(e => next(new APIError("No such user", httpStatus.NOT_FOUND)));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  let username = req.body.username
  User.findOne({username}).exec((error, user) => {
    if (error) {
      return next(new APIError('内部错误', httpStatus.INTERNAL_SERVER_ERROR, true))
    } else if (user) {
      var err = new APIError('用户已存在', httpStatus.BAD_REQUEST, false);
      return next(err);
    } else {
      const user = new User({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        role: req.body.role,
      });

      user.save()
        .then(savedUser => res.json(savedUser))
        .catch(e => next(e));
    }
  })


}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.targetUser ? req.targetUser : req.user;
  if (req.user.isAdmin()) {
    Object.entries(only(req.body, 'name password role')).forEach(item => {
      user[item[0]] = item[1]
    })
  } else {
    Object.entries(only(req.body, 'name password')).forEach(item => {
      user[item[0]] = item[1]
    })
  }

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const {limit = 50, skip = 0} = req.query;
  User.list({limit, skip})
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.targetUser || req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

module.exports = {load, get, create, update, list, remove};
