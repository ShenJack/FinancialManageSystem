const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index');

chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});
let token = ""
let Authorization;


describe('## Todo APIs', () => {
  let todo = {
    title: 'test todo',
    description: 'todo description'
  };

  let user = {
    username: 'user01',
    password: 'asdasd',
  }

  before(function (done) {
    request(app)
      .post('/todo/auth/login')
      .send(user)
      .then((res) => {
        token = res.body.token
        Authorization = 'Bearer ' + token;
        done()
      })
  })

  describe('# POST /todos', () => {
    it('should create a new todo', (done) => {
      request(app)
        .post('/todo/todos')
        .send(todo)
        .set('Authorization', Authorization)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.title).to.equal(todo.title);
          expect(res.body.description).to.equal(todo.description);
          todo = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /todo/todos/:todoId', () => {
    it('should get todo details', (done) => {
      request(app)
        .get(`/todo/todos/${todo._id}`)
        .set('Authorization', Authorization)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.title).to.equal(todo.title);
          expect(res.body.description).to.equal(todo.description);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when user does not exists', (done) => {
      request(app)
        .get('/todo/todos/5d1b011112e13d6d1517db')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /todo/todos/:todoId', () => {
    it('should update todo details', (done) => {
      todo.title = 'KK';
      request(app)
        .put(`/todo/todos/${todo._id}`)
        .send(todo)
        .set('Authorization', Authorization)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.title).to.equal('KK');
          expect(res.body.description).to.equal(todo.description);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /todo/todos/', () => {
    it('should get all todos', (done) => {
      request(app)
        .get('/todo/todos')
        .set('Authorization', Authorization)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all users (with limit and skip)', (done) => {
      request(app)
        .get('/todo/todos')
        .set('Authorization', Authorization)
        .query({limit: 10, skip: 1})
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /todo/todos/', () => {
    it('should delete todo', (done) => {
      request(app)
        .delete(`/todo/todos/${todo._id}`)
        .set('Authorization', Authorization)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.title).to.equal('KK');
          expect(res.body.description).to.equal(todo.description);
          done();
        })
        .catch(done);
    });
  });
})
