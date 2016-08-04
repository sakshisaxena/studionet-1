var express = require('express');
var router = express.Router();
var auth = require('./auth');
var apiCall = require('./apiCall');

// route: /api/all
router.route('/')

	// return whole graph
	.get(auth.ensureAuthenticated, auth.ensureSuperAdmin, function(req, res){
		
		var query = "MATCH all=()-[]->() RETURN all";

		apiCall(query, function(data){
			res.send(data);
		});

	});

module.exports = router;