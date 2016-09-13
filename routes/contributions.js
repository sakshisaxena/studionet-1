var express = require('express');
var router = express.Router();
var auth = require('./auth');
var apiCall = require('./apicall');
var db = require('seraph')({
	server: process.env.SERVER_URL || 'http://localhost:7474/', // 'http://studionetdb.design-automation.net'
	user: process.env.DB_USER,
	pass: process.env.DB_PASS
});

// route: /api/contributions
router.route('/')
	// get all contributions
	.get(function(req, res){
		res.send('placeholder response');
	})

	// create a new contribution linked to the current user
	.post(auth.ensureAuthenticated, function(req, res){


		var query = [
			'CREATE (c:contribution {title: {contributionTitleParam}, body: {contributionBodyParam}, ref: {contributionRefParam}, lastUpdated:{lastUpdatedParam}, editted: {edittedParam}, labels: {contributionLabelParam}, contributionTypes: {contributionTypesParam}}) WITH c',
			'MATCH (u:user) WHERE id(u)=' + req.user.id,
			'CREATE (u)-[r:CREATED]->(c)'
		];

		// if not linked to anything, put -1
		// reference type: REPLYTO, 
		if (parseInt(req.body.ref) !== -1){
			query.push('MATCH (c1:contribution) where id(c1)={contributionRefParam}')
			query.push('CREATE (c)-[r1:{refTypeParam}]->(c1)')
		}

		query = query.join('\n');

		var params = {
			contributionTitleParam: req.body.title,
			contributionBodyParam: req.body.body,
			contributionRefParam: req.body.ref, 
			lastUpdatedParam: Date.now(),
			refTypeParam: req.body.refType,
			edittedParam: false,
			contributionLabelParam: req.body.labels, //tags
			contributionTypesParam: req.body.contributionTypes
		};

		db.query(query, params, function(error, result){
			if (error)
				console.log('Error creating new post for user : ' + req.user.nusOpenId);
			else
				res.send(result[0]);
		});

	});


// route: /api/contributions/:contributionId
router.route('/:contributionId')
	.get(auth.ensureAuthenticated, function(req, res){

		var query = [
			'MATCH (c:contribution) WHERE ID(c)=' + req.params.contributionId,
			'RETURN c'
		].join('\n');

		db.query(query, function(error, result){
			if (error)
				console.log('Error fetching contribution of id: ' + req.params.contributionId);
			else
				res.send(result[0]);
		});

	});


router.route('/:contributionId/connections');

router.route('/:contributionId/connections/:connectionId');



module.exports = router;