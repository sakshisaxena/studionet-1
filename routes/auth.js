// This module exports a bunch of auth middleware functions

//   Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
module.exports.ensureAuthenticated = function(req, res, next) {
	
  if (req.isAuthenticated()) { 
  	return next(); 
  }
  res.redirect('/denied');
  

};

// Super Admin authentication middleware
module.exports.ensureSuperAdmin = function(req, res, next){
	
  if (req.user.superAdmin){
    return next();
  }
  res.redirect('/denied');

}