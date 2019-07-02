const Todo = require('./todo.model');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const APIError = require('../helpers/APIError')
const httpStatus = require("http-status");

/*Load todo to Req*/
function load(req, res, next, id) {
  Todo.findById(id)
    .then((todo) => {
      if (todo) {
        req.todo = todo; // eslint-disable-line no-param-reassign
        return next();
      } else {
        next(new APIError('Todo 不存在', httpStatus.NOT_FOUND)
        )
      }
    }).catch((err)=>{
    next(new APIError('Todo 不存在', httpStatus.NOT_FOUND));
  })
}

function get(req, res, next) {
  Todo.get(req.params.todoId).then(todo => {
    return res.json(todo)
  }).catch(err => {
    next(err)
  })
}

async function create(req, res, next) {
  const todo = new Todo({
    title: req.body.title,
    description: req.body.description,
  });
  todo.user = await User.findById(req.user.id);

  todo.save()
    .then(savedTodo => res.json(savedTodo))
    .catch(e => next(e));
}

function update(req, res, next) {
  const todo = req.todo;
  todo.title = req.body.title;
  todo.description = req.body.description;

  todo.save()
    .then(savedTodo => res.json(savedTodo))
    .catch(e => next(e));
}

function list(req, res, next) {
  const {limit = 50, skip = 0} = req.query;
  Todo.list({limit, skip})
    .then(users => res.json(users))
    .catch(e => next(e));
}

function remove(req, res, next) {
  const todo = req.todo;
  todo.remove()
    .then(deletedTodo => res.json(deletedTodo))
    .catch(e => next(e));
}

module.exports = {load, get, create, update, list, remove};
