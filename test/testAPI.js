const chai = require('chai');
const mocha = require('mocha');
const express = require('express');
const cheerio = require('cheerio');
const should = chai.should();
const server = require('../server');
const app = express();
const supertest = require('supertest');
const agent = supertest.agent(server);
const PASS = process.env.PASS;

describe('Pages', () => {

	describe('GET homepage', () => {
		let cookie;
		it('should load', done => {
			agent.get('/')
				.expect('Content-Type', /html/)
				.expect(200)
				.end((err, res) => {
					if(err) done(err);
					cookie = res.res.headers['set-cookie'];
					done();
				});
		});
		it('should set cookie', done => {
			agent.get('/')
				.expect('Content-Type', /html/)
				.expect(200)
				.end((err, res) => {
					if(err) done(err);
					cookie.should.be.an('array');
					done();
				});
		});
		it('should log in as anonymous', done => {
			agent.get('/')
				.expect('Content-Type', /html/)
				.expect(200)
				.end((err, res) => {
					if(err) done(err);
					let $ = cheerio.load(res.text);
					let profile = $('#profile').text();
					profile.should.deep.equal('anonymous');
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

	describe('GET new user page', () => {
		it('should load', done => {
			agent.get('/user/new')
				.expect(200)
				.end((err, res) => {
					if(err) done(err);
					done();
				});
		});
	});

});

describe('APIs', () => {

	describe('POST login page', () => {
		let redirect;
		it('should redirect to /login if failed', done => {
			agent.post('/login')
				.set('Content-Type', 'application/json')
				.send({"username": "fakeuser", "password": "fakepass"})
				.expect(302)
				.end((err, res) => {
					if(err) done(err);
					redirect = res.res.headers.location;
					redirect.should.equal('/login');
					res.redirect.should.be.true;
					done();
				});
		});
		it('should redirect to /success if succeeded', done => {
			agent.post('/login')
				.set('Content-Type', 'application/json')
				.send({"username": "Edward", "password": PASS})
				.expect(302)
				.end((err, res) => {
					if(err) done(err);
					redirect = res.res.headers.location;
					redirect.should.deep.equal('/success');
					res.redirect.should.be.true;
					done();
				});
		});
		it('should log in as Edward', done => {
			agent.get(redirect)
				.expect(302)
				.then(res => {
					redirect = res.res.headers.location;
					return agent.get(redirect)
						.expect('Content-Type', /html/)
						.expect(200);
				})
				.then(res => {
					let $ = cheerio.load(res.text);
					let profile = $('#profile').text();
					profile.should.deep.equal('Edward');
					done();
				});
		});
					console.log(redirect);
	});

	describe('GET logout page', () => {
		let redirect;
		it('should logout', done => {
			agent.get('/logout')
				.expect(302)
				.then(res => {
					redirect = res.res.headers.location;
					return agent.get(redirect)
						.expect('Content-Type', /html/)
						.expect(200);
				})
				.then(res => {
					let $ = cheerio.load(res.text);
					let profile = $('#profile').text();
					profile.should.deep.equal('anonymous');
					done();
				});
		});
	});

});

describe('Non-existent pages', () => {

	let redirect;

	describe('GET nonexistent page', () => {
		it('should redirect to 404', done => {
			agent.get('/pagethatdoesnotexist')
				.expect(302)
				.then(res => {
					redirect = res.res.headers.location;
					agent.get(redirect)
						.expect('Content-Type', /html/)
						.expect(404);
					done();
				});
		});
	});

	describe('PUT nonexistent page', () => {
		it('should redirect to 404', done => {
			agent.put('/pagethatdoesnotexist')
				.expect(302)
				.then(res => {
					redirect = res.res.headers.location;
					agent.get(redirect)
						.expect('Content-Type', /html/)
						.expect(404)
					done();
				});
		});
	});

	describe('DELETE nonexistent page', () => {
		it('should redirect to 404', done => {
			agent.delete('/pagethatdoesnotexist')
				.expect(302)
				.then(res => {
					redirect = res.res.headers.location;
					agent.get(redirect)
						.expect('Content-Type', /html/)
						.expect(404);
					done();
				});
		});
	});

})
