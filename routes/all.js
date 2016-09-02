var express = require('express');
var router = express.Router();
var auth = require('./auth');
var apiCall = require('./apiCall');
var db = require('seraph')({
	user: process.env.DB_USER,
	pass: process.env.DB_PASS
});

// route: /api/all
router.route('/')

	// return whole graph
	.get(auth.ensureAuthenticated, auth.ensureSuperAdmin, function(req, res){
		
		/*
		var query = [
									'MATCH (u:user) WHERE ID(u)=87',
									'MATCH (u)-[*1..2]-(a)',
									'RETURN u as user, collect(a) as things'
								].join('\n');
		*/

		var query = [
									'MATCH (u:user) WHERE ID(u)=' + req.user.id,
									'MATCH p=(u)-[*1..2]-()',
									'RETURN p'
								].join('\n');


		
		apiCall(query, function(data){
			var nodes = [], links = [];
			
			data.forEach(function(row){
				// for each graph

				row.graph.nodes.forEach(function(n) {
	        if (idIndex(nodes, n.id) == null)
	            nodes.push({
	                id: n.id,
	                label: n.labels[0],
	                title: setTitle(n),
	                reflexive: false
	            });
    		});
		    links = links.concat(row.graph.relationships.map(function(r) {
		        return {
		            source: idIndex(nodes, r.startNode),
		            target: idIndex(nodes, r.endNode),
		            left: false,
		            right: true,
		            type: r.type
		        };
		    }));
			});

			res.send({nodes: nodes, links: links})


		});
		

		/*
		db.query(query, function(error, result){
			if (error)
				console.log('Error for /api/all');
			else{
				res.send(result);

				var nodes = [], links = [];

				// transform data into d3 friendly json
				
				var i = 0;
				result.forEach(function(curr){
					user = curr[0];
					things = curr[1];

					nodes.append({openId: user.nusOpenId, name: user.name, label: "user"});
					
				})
				

				
			}
		});
		*/

	});

function idIndex(a, id){
	for (var i =0; i<a.length; i++)
		if (a[i].id == id) 
			return a[i];
	return null;
};

function setTitle(n) {
    if (n.labels[0] === "contribution" || n.labels[0]==='post') {
        return n.properties.title;
    } else {
        return n.properties.name;
    }
};

module.exports = router;