const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      name:Joi.string().required(),
      password: Joi.string().required(),
      role: Joi.string().required(),
    }
  },

  createConsume: {
    body: {
      type:Joi.string().required(),
      amount:Joi.string().required(),
    }
  },

  createTodo: {
    body: {
      title: Joi.string().required(),
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      password: Joi.string().required(),
      name:Joi.string()
    },
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required(),
      verifyId: Joi.string().required(),
      code: Joi.string().required(),
    }
  }
};
