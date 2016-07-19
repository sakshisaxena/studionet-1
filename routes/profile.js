var express = require('express');
var router = express.Router();
var auth = require('./auth');
var db = require('seraph')({
  user: process.env.DB_USER,
  pass: process.env.DB_PASS
});

router.get('/', auth.ensureAuthenticated, function(req, res){
  // update last logged in
  var query = [
    'MATCH (u:user)',
    'WHERE ID(u)=' + req.user.id,
    'WITH u',
    'SET u.lastLoggedIn = {loginDateParam}',
    'RETURN u'
  ].join('\n');

  var params = {
    loginDateParam: Date.now()
  };
  console.log(query);

  db.query(query, params, function(error, result){
    if (error)
      console.log('Error updating login date for user: ' + req.user.nusOpenId + ', ' + error);
    else
      // send back the profile with new login date
      res.send(result[0]);
  });

  // send back the profile
  // res.send(req.user);
});

module.exports = router;