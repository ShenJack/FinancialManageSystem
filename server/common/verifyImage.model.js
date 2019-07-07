const mongoose = require('mongoose')
const timeout = 600 * 1000
const VerifyImage =  new mongoose.Schema({
  code:{
    type:String,
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
})

module.exports = mongoose.model('VerifyImage', VerifyImage);
