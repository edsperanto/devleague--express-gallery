const chai = require('chai');
const mocha = require('mocha');
const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;
const server = require('../server');
const supertest = require('supertest');
const agent = supertest.agent(server);
const PASS = process.env.PASS;

describe('Sanity check', () => {
	it('passes test', () => {
		true.should.be.true;
		expect(true).to.be.true;
		assert.equal(true, true);
		false.should.be.false;
		expect(false).to.be.false;
		assert.equal(false, false);
	});
});

describe('Pages', () => {

	describe('homepage', () => {
		it('should load', () => {
			agent.get('/')
				.expect('Content-Type', /html/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					done();
				});
		});
	});

	describe('login page', () => {
		it('should load', () => {
			agent.get('/login')
				.expect('Content-Type', /html/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					done();
				});
		});
	});
});

/*
describe('Login', () => {
	describe('with incorrect username/password', () => {
		it('should redirect to /login', done => {
			agent.post('/login')
				.type('json')
				.send('{"username": "fakeuser", "password": "pass"}')
				.expect('Content-Type', /html/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					done();
				});
		});
	});
});
*/
