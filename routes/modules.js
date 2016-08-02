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
			'MATCH (m:module) WITH m',
			'MATCH (m)-[r:MEMBER]->(u:user)',
			'RETURN {' +
								'code: m.code, name: m.name, contributionTypes: m.contributionTypes, id: id(m),' + 
								'users: collect({id: id(u), role: r.role })}'
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

		var query = [
			'CREATE (m:module {name: {nameParam}, code: {codeParam}, contributionTypes: {typesParam}})',
			'RETURN m'
		].join('\n');

		var params = {
			nameParam: req.body.name,
			codeParam: req.body.code,
			typesParam: req.body.contributionTypes
		};

		db.query(query, params, function(error, result){
			if (error)
				console.log('Error adding module to the database: ', error);
			else
				// return the first item because query always returns an array but REST API expects a single object
				res.send(result[0]);
		});

	});

// route: /api/modules/:id
router.route('/:id')

	// returns a particular module
	.get(auth.ensureAuthenticated, function(req, res){
		
		var query = [
			'MATCH (m:module) WHERE ID(m)=' + req.params.id,
			'WITH m',
			'MATCH (m)-[r:MEMBER]->(u:user)',
			'RETURN {' +
								'code: m.code, name: m.name, contributionTypes: m.contributionTypes, id: id(m),' + 
								'users: collect({id: id(u), role: r.role })}'
		].join('\n');

		db.query(query, function(error, result){
			if (error)
				console.log('Error retreiving module of id ' + req.params.id + ' : ', error);
			else
				// return the first item because query always returns an array but REST API expects a single object
				res.send(result[0]);
		});

	})

	// updates an existing module
	.put(auth.ensureAuthenticated, auth.ensureSuperAdmin, function(req, res){
		var query = [
			'MATCH (m:module)',
			'WHERE ID(m)=' + req.params.id,
			'WITH m',
			'SET m.name={nameParam}, m.code={codeParam}, m.contributionTypes={typesParam}',
			'RETURN m'
		].join('\n');

		/*
		if (req.body.name)
			query.push('SET m.name={nameParam}');
		if (req.body.code)
			query.push('SET m.code={codeParam}');
		if (req.body.contributionTypes)
			query.push('SET m.contributionTypes={typesParam}');

		query.push('RETURN m');
		query.join('\n');
		*/

		var params = {
			nameParam: req.body.name,
			codeParam: req.body.code,
			typesParam: req.body.contributionTypes
		};

		db.query(query, params, function(error, result){
			if (error)
				console.log('Error updating module of id ' + req.params.id + ' : ', error);
			else
				// return the first item because query always returns an array but REST API expects a single object
 				res.send(result[0]);
		});

	})

	// deletes an existing module
	.delete(auth.ensureAuthenticated, auth.ensureSuperAdmin, function(req, res){
		var query = [
			'MATCH (m:module)',
			'WHERE ID(m)=' + req.params.id,
			'DELETE m'
		].join('\n');

		db.query(query, function(error, result){
			if (error)
				console.log('Error deleting module of id ' + req.params.id + ' : ', error);
			else
				// return the first item because query always returns an array but REST API expects a single object
				res.send(result[0]);
		})
	});



router.route('/:id/users')
	
	// get all users for this module (all roles)
	.get(auth.ensureAuthenticated, function(req, res){
		var query = [
			'MATCH (m:module)',
			'WHERE ID(m)=' + req.params.id,
			'WITH m',
			'MATCH (m)-[r:MEMBER]->(u)',
			'RETURN u'
		].join('\n');

		db.query(query, function(error, result){
			if (error)
				console.log('Error getting all users of module id: ' + req.params.id + ',' + error);
			else
				res.send(result);
		});
	})

module.exports = router;