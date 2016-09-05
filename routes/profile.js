var express = require('express');
var router = express.Router();
var auth = require('./auth');
var apiCall = require('./apiCall');
var db = require('seraph')({
<<<<<<< Updated upstream
=======
  server: process.env.SERVER_URL || 'http://localhost:7474/', // 'http://studionetdb.design-automation.net'
>>>>>>> Stashed changes
  user: process.env.DB_USER,
  pass: process.env.DB_PASS
});

// route: /api/profile
// get information about the current user
router.get('/', auth.ensureAuthenticated, function(req, res){
  var query = [
    'MATCH (u:user)',
    'WHERE ID(u)=' + req.user.id,
    'WITH u',
    'MATCH (m)-[r:MEMBER]->(u)',
    'RETURN {' +
              'id: id(u),' + 
              'year: u.year,' +
              'nusOpenId: u.nusOpenId,' +
              'canEdit: u.canEdit,' +
              'name: u.name,' +
              'lastLoggedIn: u.lastLoggedIn,' +
              'avatar: u.avatar,' + 
              'superAdmin: u.superAdmin,' +
              'modules: COLLECT({id: id(m), code: m.code, name: m.name, contributionTypes: m.contributionTypes, role: r.role})' +
    '}'
  ].join('\n');

  var params = {
    loginDateParam: Date.now()
  };

  db.query(query, params, function(error, result){
    if (error)
      console.log('Error getting user profile: ' + req.user.nusOpenId + ', ' + error);
    else
      // send back the profile with new login date
      res.send(result[0]);
  });
});

// edit the current user's information
router.put('/', auth.ensureAuthenticated, function(req, res){

  var query = [
    'MATCH (u:user) WHERE ID(u)=' + req.user.id,
    'WITH u',
    'SET u.name={nameParam}, u.nusOpenId={nusOpenIdParam}, u.canEdit={canEditParam}, u.year={yearParam}',
    'RETURN u'
  ].join('\n');

  var params = {
      nameParam: req.body.name,
      nusOpenIdParam: req.body.nusOpenId,
      canEditParam: req.body.canEdit,
      yearParam: req.body.year,
    };

    db.query(query, params, function(error, result){
      if (error)
        console.log('Error creating new user: ', error);
      else
        res.send(result[0]);
    });
});

// route: /api/profile/graph
// get the profile of the current user in graph form
router.get('/graph', auth.ensureAuthenticated, function(req, res){
  var query = "MATCH path=(u:user)-[*0..1]-(p) WHERE id(u)=" + req.user.id +"\nRETURN path";
  apiCall(query, function(data){
    res.send(data);
  })

});

// route: /api/profile/user
// get just the user data for this account
router.get('/user', auth.ensureAuthenticated, function(req, res){
  // update last logged in
  var query = [
    'MATCH (u:user)',
    'WHERE ID(u)=' + req.user.id,
    'WITH u',
    // 'SET u.lastLoggedIn = {loginDateParam}',
    'RETURN u'
  ].join('\n');

  var params = {
    loginDateParam: Date.now()
  };

  db.query(query, params, function(error, result){
    if (error)
      console.log('Error getting user profile: ' + req.user.nusOpenId + ', ' + error);
    else
      // send back the profile with new login date
      res.send(result[0]);
  });

  // send back the profile
  // res.send(req.user);
});


// route: /api/profile/modules
// get just the modules that this user is in
router.get('/modules', auth.ensureAuthenticated, function(req, res){
  
  var query = [
    'MATCH (u:user)',
    'WHERE ID(u)=' + req.user.id,
    'WITH u',
    'MATCH (m)-[r:MEMBER]->(u)',
    'RETURN {id: id(m), code: m.code, name: m.name, contributionTypes: m.contributionTypes, role: r.role}'
  ].join('\n');

  db.query(query, function(error, result){
    if (error)
      console.log('Error getting current user\'s module');
    else
      res.send(result);
  });

});

module.exports = router;