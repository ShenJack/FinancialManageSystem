const Todo = require('./todo.model');

function load(req, res, next, id) {
  Todo.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

function get(req, res) {
  Todo.findById(req.params.todoId).then(todo =>{
    res.json(todo)
  })
}

function create(req, res, next) {
  const todo = new Todo({
    title: req.body.title,
    description: req.body.description
  });

  todo.save()
    .then(savedTodo => res.json(savedTodo))
    .catch(e => next(e));
}

function update(req, res, next) {
  const user = req.user;
  user.username = req.body.username;
  user.mobileNumber = req.body.mobileNumber;

  user.save()
    .then(savedTodo => res.json(savedTodo))
    .catch(e => next(e));
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Todo.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedTodo => res.json(deletedTodo))
    .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove };
