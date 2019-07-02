const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const getTags = tags => tags.join(',');
const setTags = tags => tags.split(',').slice(0, 10); // max tags

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {type: mongoose.Schema.ObjectId, ref: 'User'},
  done: {
    type: Boolean,
    default: false
  },
  tags: {type: [], get: getTags, set: setTags},

});


/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
TodoSchema.method({});

/**
 * Statics
 */
TodoSchema.statics = {
  get(id) {
    return this.findById(id)
      .populate('user','username')
      .exec()
      .then((todo) => {
        return todo;
      }).catch(err => {
        const err404 = new APIError('No such todo exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err404);
      });
  },

  list({skip = 0, limit = 50} = {}) {
    return this.find()
      .populate('user', 'username')
      .sort({createdAt: -1})
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

module.exports = mongoose.model('Todo', TodoSchema);
