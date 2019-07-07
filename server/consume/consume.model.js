const mongoose = require('mongoose')
const Consume = mongoose.Schema({
  type:{
    type:String,
  },
  time:{
    type:Date,
    default:Date.now
  },
  amount:{
    type:Number,
  },
  description:{
    type:String,
  },
  source:{
    type:String,
  },
  account:{
    type:String,
  },
})

Consume.statics = {

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({skip = 0, limit = 50} = {}) {
    return this.find()
      .sort({time: -1})
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

module.exports = mongoose.model("Consume",Consume)
