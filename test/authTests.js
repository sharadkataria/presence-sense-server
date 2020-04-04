const assert = require('assert');
const server = require('../app');
const chai = require('chai');
const request = require('supertest');
const should = chai.should();

describe('POST /login', function () {
  this.timeout(0);
  it('It should respond with a JSON containing access token.', function (done) {
    request(server)
      .post('/login')
      .send({ email: 'test@gmail.com', password: 'password' })
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.status.should.equal(200);
        res.body.should.be.a('object');
        res.body.should.have.property('access_token');
        done();
      });
  });

  it('It should respond with an Array containing password required error.', function (done) {
    request(server)
      .post('/login')
      .send({ email: 'test@gmail.com', password: '' })
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.status.should.equal(400);
        res.body.should.be.a('array');
        res.body[0].should.equal('Password is required');
        done();
      });
  });

  it('It should respond with an Array containing email required error.', function (done) {
    request(server)
      .post('/login')
      .send({ email: '', password: 'pasword' })
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.status.should.equal(400);
        res.body.should.be.a('array');
        res.body[0].should.equal('Invalid email provided');
        done();
      });
  });

  it('It should respond with an Array containing invalid details error.', function (done) {
    request(server)
      .post('/login')
      .send({ email: 'test@gmail.com', password: 'paswordd' })
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.status.should.equal(400);
        res.body.should.be.a('array');
        res.body[0].should.equal('Invalid details provided');
        done();
      });
  });

  it('It should respond with an Array containing email exists error.', function (done) {
    request(server)
      .post('/signup')
      .send({ email: 'test@gmail.com', password: 'paswordd', name: 'test' })
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.status.should.equal(400);
        res.body.should.be.a('array');
        res.body[0].should.equal('Email already exists.');
        done();
      });
  });
});
