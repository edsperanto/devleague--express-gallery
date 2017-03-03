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

describe('Main pages', () => {

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

describe('User management', () => {

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

});

describe('Restricted page redirect after login for', () => {

	let redirect;

	beforeEach(done => {
		agent.get('/logout').then(res => done());
	});
	
	it('GET /gallery/new', done => {
		agent.get('/gallery/new')
			.then(res => {
				redirect = res.res.headers.location;
				return agent.post(redirect)
					.set('Content-Type', 'application/json')
					.send({"username": "Edward", "password": PASS});
			})
			.then(res => res.res.headers.location)
			.then(redirect => agent.get(redirect))
			.then(res => {
				redirect = res.res.headers.location;
				redirect.should.deep.equal('/gallery/new');
				return agent.get(redirect);
			})
			.then(res => {
				let $ = cheerio.load(res.text);
				let profile = $('#profile').text();
				done();
			});
	});

	it('GET /gallery/:id/edit', done => {
		agent.get('/gallery/1/edit')
			.then(res => {
				redirect = res.res.headers.location;
				return agent.post(redirect)
					.set('Content-Type', 'application/json')
					.send({"username": "Edward", "password": PASS});
			})
			.then(res => res.res.headers.location)
			.then(redirect => agent.get(redirect))
			.then(res => {
				redirect = res.res.headers.location;
				redirect.should.deep.equal('/gallery/1/edit');
				return agent.get(redirect);
			})
			.then(res => {
				let $ = cheerio.load(res.text);
				let profile = $('#profile').text();
				done();
			});
	});

});

describe('Gallery pages', () => {

	describe('GET new photo page', () => {
		it('should load', done => {
			agent.get('/gallery/new')
				.expect(200)
				.end(res => done());
		});
	});

});
