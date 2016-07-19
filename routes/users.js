var express = require('express');
var router = express.Router();
var auth = require('./auth');
var db = require('seraph')({
	user: process.env.DB_USER,
	pass: process.env.DB_PASS
});

router.route('/')

	// return all users
	.get(auth.ensureAuthenticated, function(req, res){
		
		var query = [
			'MATCH (u:user)',
			'RETURN u'
		].join('\n');

		db.query(query, function(error, result){
			if (error)
				console.log('Error retrieving all users: ', error);
			else
				res.send(result);
		});

	})

	// add a new user
	.post(auth.ensureAuthenticated, auth.ensureSuperAdmin, function(req, res){
		
		var query = [
			'CREATE (u:user {name: {nameParam}, nusOpenId: {nusOpenIdParam}, canEdit: {canEditParam}, year: {yearParam}, lastLoggedIn: {lastLoggedInParam}, superAdmin: {superAdminParam}})',
			'RETURN u'
		].join('\n');

		var params = {
			nameParam: req.body.name,
			nusOpenIdParam: req.body.nusOpenId,
			canEditParam: req.body.canEdit,
			yearParam: req.body.year,
			lastLoggedInParam: Date.now(),
			superAdminParam: false
		};

		db.query(query, params, function(error, result){
			if (error)
				console.log('Error creating new user: ', error);
			else
				res.send(result[0]);
		});

	});

router.route('/:id')

	// return a user
	.get(auth.ensureAuthenticated, function(req, res){
		res.send('Placeholder');
	})

	// update a user
	.put(auth.ensureAuthenticated, auth.ensureSuperAdmin, function(req, res){

	})

	// delete a user
	.delete(auth.ensureAuthenticated, auth.ensureSuperAdmin, function(req, res){

	});


module.exports = router;
