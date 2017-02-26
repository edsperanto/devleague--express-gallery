const express = require('express');
const sequelize = require('sequelize');
const router = express.Router();
const gen = require('../helper/gen');
const db = require('../models');
const isAuthenticated = require('../helper/isAuthenticated');
const { Photo } = db;

router.get('/new', isAuthenticated, (req, res) => {
	gen.details("1", Photo)
		.then(data => {
			data.details.creating = true;
			return data;
		})
		.then(data => res.render('detail', data));
});

router.get('/:id', (req, res) => {
	gen.details(req.params.id, Photo)
		.then(data => {
			data.details.viewing = true;
			return data;
		})
		.then(data => res.render('detail', data))
		.catch(errorMsg => {
			res.render('404', {errorMsg});
		});
});

router.get('/:id/edit', isAuthenticated, (req, res) => {
	gen.details(req.params.id, Photo)
		.then(data => {
			data.details.editing = true;
			return data;
		})
		.then(data => res.render('detail', data))
		.catch(errorMsg => {
			res.render('404', {errorMsg});
		});
});

router.post('/', isAuthenticated, (req, res) => {
	var {author, link, description} = req.body;
	Photo.create({author, link, description})
		.then(photo => Photo.findOne({where: {author, link, description}}))
		.then(({id}) => res.redirect(`/gallery/${id}`))
		.catch(errorMsg => {
			res.render('404', {errorMsg});
		});
});

router.put('/:id', isAuthenticated, (req, res) => {
	var {author, link, description} = req.body;
	Photo.update(
		{author, link, description},
		{where: {id: req.params.id}}
	)
		.then(_ => res.redirect(`/gallery/${req.params.id}`));
});

router.delete('/:id', isAuthenticated, (req, res) => {
	Photo.destroy({where: {id: req.params.id}})
		.then(_ => {
			res.redirect('/');
		});
})

module.exports = router;
