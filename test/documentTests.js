const assert = require('assert');
const server = require('../app');
const chai = require('chai');
const request = require('supertest');
const should = chai.should();

describe('GET /documents', function () {
  this.timeout(0);

  it('It should respond with unauthorized 401 error', function (done) {
    request(server)
      .get('/documents')
      .end(function (err, res) {
        if (err) return done(err);
        res.status.should.equal(401);
        done();
      });
  });

  it('It should respond with a Array containing document objects', function (done) {
    request(server)
      .get('/documents')
      .set(
        'Authorization',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTg1Njc2NzIxfQ.3Vw46tnSa_SoVG0oBDimLQsPmNxBLp8f1ZdgB6Z65EA'
      )
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.status.should.equal(200);
        res.body.should.be.a('array');
        res.body.forEach((document) => {
          document.should.be.a('object');
        });
        done();
      });
  });

  it('It should respond with an object containing document details', function (done) {
    request(server)
      .get('/documents/10911a26-dc4e-4519-8c56-7e845b5d2058')
      .set(
        'Authorization',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTg1Njc2NzIxfQ.3Vw46tnSa_SoVG0oBDimLQsPmNxBLp8f1ZdgB6Z65EA'
      )
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.status.should.equal(200);
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('POST /documents', function () {
  this.timeout(0);

  it('It should respond with name required error', function (done) {
    request(server)
      .post('/documents')
      .set(
        'Authorization',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTg1Njc2NzIxfQ.3Vw46tnSa_SoVG0oBDimLQsPmNxBLp8f1ZdgB6Z65EA'
      )
      .end(function (err, res) {
        if (err) return done(err);
        res.status.should.equal(400);
        res.body.should.be.a('array');
        res.body[0].should.equal('Name is required.');
        done();
      });
  });

  it('It should respond with an object containing document details', function (done) {
    request(server)
      .post('/documents')
      .set(
        'Authorization',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTg1Njc2NzIxfQ.3Vw46tnSa_SoVG0oBDimLQsPmNxBLp8f1ZdgB6Z65EA'
      )
      .expect('Content-Type', /json/)
      .send({ name: 'Test Document Name' })
      .end(function (err, res) {
        if (err) return done(err);
        res.status.should.equal(200);
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('PUT /documents', function () {
  this.timeout(0);

  it('It should respond with updated document details.', function (done) {
    request(server)
      .put('/documents')
      .set(
        'Authorization',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTg1Njc2NzIxfQ.3Vw46tnSa_SoVG0oBDimLQsPmNxBLp8f1ZdgB6Z65EA'
      )
      .send({
        documentID: '10911a26-dc4e-4519-8c56-7e845b5d2058',
        publicChecked: false,
        emails: ['test1@gmail.com'],
      })
      .end(function (err, res) {
        if (err) return done(err);
        res.status.should.equal(200);
        res.body.should.be.a('object');
        res.body.should.have.property('public', false);
        res.body.should.have.property('shared');
        res.body.shared.should.be.a('array');
        res.body.shared[0].should.have.property('email');
        done();
      });
  });

  it('It should respond with updated document details.', function (done) {
    request(server)
      .put('/documents')
      .set(
        'Authorization',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTg1Njc2NzIxfQ.3Vw46tnSa_SoVG0oBDimLQsPmNxBLp8f1ZdgB6Z65EA'
      )
      .send({
        documentID: '10911a26-dc4e-4519-8c56-7e845b5d2058',
        publicChecked: true,
        emails: ['test1@gmail.com'],
      })
      .end(function (err, res) {
        if (err) return done(err);
        res.status.should.equal(200);
        res.body.should.be.a('object');
        res.body.should.have.property('public', true);
        done();
      });
  });
});
