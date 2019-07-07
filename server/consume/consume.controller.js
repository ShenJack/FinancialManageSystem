const Consume = require('./consume.model');
const APIError = require('../helpers/APIError')
const httpStatus = require('http-status');
const only = require('only')

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  Consume.findById(id)
    .then((consume) => {
      if (consume) {
        req.consume = consume; // eslint-disable-line no-param-reassign
        return next();
      } else {
        return next(new APIError("Not found", httpStatus.NOT_FOUND))
      }
    })
    .catch(e => next(new APIError("Not found", httpStatus.NOT_FOUND)));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.consume);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  const consume = new Consume({
    type: req.body.type,
    time: req.body.time,
    amount: req.body.amount,
    description: req.body.description,
    source: req.body.source,
    account: req.body.account,
  });

  consume.save()
    .then(consume => res.json(consume))
    .catch(e => next(e));


}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  const consume = req.consume;
  Object.entries(only(req.body,
    "type time amount description source account"
  )).forEach(item => {
    consume[item[0]] = item[1]
  })

  consume.save()
    .then(consume => res.json(consume))
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
  let queryObject = {}
  let dateQuery = {}
  if (req.query.startTime || req.query.endTime) {
    req.query.startTime &&
    (dateQuery.$gte = new Date(req.query.startTime))
    req.query.endTime &&
    (dateQuery.$lt = new Date(req.query.endTime))
  }
  if (dateQuery) {
    queryObject.time = dateQuery
  }

  if (req.query.type) {
    queryObject.type = req.query.type
  }
  Consume.find(queryObject)
    .sort({time: -1})
    .skip(+skip)
    .limit(+limit)
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const Consume = req.consume;
  Consume.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

module.exports = {load, get, create, update, list, remove};
