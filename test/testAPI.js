const chai = require('chai');
const mocha = require('mocha');
const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;
const server = require('../server');
const supertest = require('supertest');
const agent = supertest.agent(server);

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

describe('Login', () => {
});
