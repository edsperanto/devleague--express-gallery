const chai = require('chai');
const mocha = require('mocha');
const express = require('express');
const should = chai.should();
const server = require('../server');
const app = express();
const supertest = require('supertest');
const agent = supertest.agent(server);
const PASS = process.env.PASS;

describe('Pages', () => {

	describe('GET homepage', () => {
		it('should load', done => {
			agent.get('/')
				.expect('Content-Type', /html/)
				.expect(200)
				.end((err, res) => {
					if(err) done(err);
					done();
				});
		});
	});

	describe('GET login page', () => {
		it('should load', done => {
			agent.get('/login')
				.expect('Content-Type', /html/)
				.expect(200)
				.end((err, res) => {
					if(err) done(err);
					done();
				});
		});
	});

	describe('POST login page', () => {
		it('should redirect to /login if failed', done => {
			agent.post('/login')
				.set('Content-Type', 'application/json')
				.send({"username": "fakeuser", "password": "fakepass"})
				.expect(302)
				.end((err, res) => {
					if(err) done(err);
					res.res.headers.location.should.equal('/login');
					res.redirect.should.be.true;
					done();
				});
		});
		it('should redirect to /success if failed', done => {
			agent.post('/login')
				.set('Content-Type', 'application/json')
				.send({"username": "Edward", "password": PASS})
				.expect(302)
				.end((err, res) => {
					if(err) done(err);
					console.log(res.text);
					res.res.headers.location.should.equal('/success');
					res.redirect.should.be.true;
					done();
				});
		});
	});

});
