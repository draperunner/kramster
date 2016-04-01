/**
 * Created by mats on 3/31/16.
 */

var supertest = require('supertest');
var should = require('should');
var mocha = require('mocha');

var server = supertest.agent('http://localhost:8000/api');

var expectJsonStatus200 = function (url, done) {
  server
    .get(url)
    .expect('Content-type', /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      res.status.should.equal(200);
      done();
    });
};

var expect404 = function (url, done) {
  server
    .get(url)
    .expect(404)
    .end(function (err, res) {
      if (err) return done(err);
      res.status.should.equal(404);
      done();
    });
};

describe('All exams', function () {

  it('should return all exams', function (done) {
    expectJsonStatus200('/exams', done);
  });

});

describe('Exams for single school', function () {
  it('ntnu', function (done) {
    expectJsonStatus200('/exams/ntnu', done);
  });

  it('NTNU', function (done) {
    expectJsonStatus200('/exams/NTNU', done);
  });

  it('Norges Teknisk-Naturvitenskaplige Universitet (NTNU)', function (done) {
    expectJsonStatus200('/exams/Norges Teknisk-Naturvitenskaplige Universitet (NTNU)', done);
  });

  it('nhh', function (done) {
    expectJsonStatus200('/exams/nhh', done);
  });

  it('NHH', function (done) {
    expectJsonStatus200('/exams/NHH', done);
  });

  it('Norges Handelshøyskole (NHH)', function (done) {
    expectJsonStatus200('/exams/Norges Handelshøyskole (NHH)', done);
  });

  it('Foobar University', function (done) {
    expect404('/exams/Foobar University', done);
  });

  it('NTNU?limit=1', function (done) {
    server
      .get('/exams/NTNU?limit=1')
      .expect('Content-type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        res.status.should.equal(200);
        res.body.length.should.be.exactly(1);
        done();
      });
  });

});
