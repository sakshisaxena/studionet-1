var express = require('express');
var router = express.Router();
var auth = require('./auth');
var db = require('seraph')({
	user: process.env.DB_USER,
	pass: process.env.DB_PASS
});


// might change routes to use a better middleware

// route: /api/modules/
router.route('/')

	// return all modules
	.get(auth.ensureAuthenticated, function(req, res){
		
		var query = [
			'MATCH (m:module)',
			'RETURN m'
		].join('\n');

		db.query(query, function(error, result){
			if (error)
				console.log('Error retrieving all modules: ', error);
			else
				res.send(result);
		});

	})

	// add a new module
	.post(auth.ensureAuthenticated, auth.ensureSuperAdmin, function(req, res){
		res.send('Adding a module');
	});

// route: /api/modules/:id
router.route('/:id')

	// returns a particular module
	.get(auth.ensureAuthenticated, function(req, res){
		
		var query = [
			'MATCH (m:module)',
			'WHERE ID(m)=' + req.params.id,
			'RETURN m'
		].join('\n');

		db.query(query, function(error, result){
			if (error)
				console.log('Error retreiving module of id ' + req.params.id + ' : ', error);
			else
				res.send(result);
		});

	})

	// updates an existing module
	.put(auth.ensureAuthenticated, auth.ensureSuperAdmin, function(req, res){
		res.send('Updating a module');
	})

	// deletes an existing module
	.delete(auth.ensureAuthenticated, auth.ensureSuperAdmin, function(req, res){
		res.send('Deleting a module');
	});


module.exports = router;
