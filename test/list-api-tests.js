/**
 * Created by mats on 4/14/16.
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

describe('List API', function () {
  it('schools', function (done) {
    expectJsonStatus200('/list/schools', done);
  });

  it('courses/ntnu', function (done) {
    expectJsonStatus200('/list/courses/ntnu', done);
  });

  it('courses/NTNU', function (done) {
    expectJsonStatus200('/list/courses/NTNU', done);
  });

  it('courses/Norges Teknisk-Naturvitenskaplige Universitet (NTNU)', function (done) {
    expectJsonStatus200('/list/courses/Norges Teknisk-Naturvitenskaplige Universitet (NTNU)', done);
  });

  it('courses/nhh', function (done) {
    expectJsonStatus200('/list/courses/nhh', done);
  });

  it('courses/NHH', function (done) {
    expectJsonStatus200('/list/courses/NHH', done);
  });

  it('courses/Norges Handelshøyskole (NHH)', function (done) {
    expectJsonStatus200('/list/courses/Norges Handelshøyskole (NHH)', done);
  });

  it('courses/Foobar University', function (done) {
    expect404('/list/courses/Foobar University', done);
  });

  it('exams/ntnu/tdt4136', function (done) {
    expectJsonStatus200('/list/exams/ntnu/tdt4136', done);
  });

});
