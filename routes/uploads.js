var express = require('express');
var router = express.Router();
var multer = require('multer');
var mkdirp = require('mkdirp');
var fs = require('fs');
var db = require('seraph')({
	user: process.env.DB_USER,
	pass: process.env.DB_PASS
});
var auth = require('./auth');

var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		var dest = './public/uploads/' + req.body.username;
		mkdirp(dest, function(err){
			if (err)
				console.log(err);
			else{
				console.log('created', dest);
				cb(null, dest);
			}
		});
	},
	filename: function(req, file, cb){
		cb(null, file.originalname);
	}
});

var avatarStorage = multer.diskStorage({
	destination: function(req, file, cb) {
		var dest = './public/uploads/' + req.user.nusOpenId;
		mkdirp(dest, function(err){
			if (err)
				console.log(err);
			else{
				console.log('created', dest);
				cb(null, dest);
			}
		});
	},
	filename: function(req, file, cb){
		var dest = './public/uploads/' + req.user.nusOpenId;
		var fileName = req.user.nusOpenId+'_avatar'+file.originalname.slice(file.originalname.lastIndexOf('.'));
		fs.exists(dest+req.user.nusOpenId+'_avatar.*', function(exists){
			if (exists)
				fs.unlink(dest+req.user.nusOpenId+'_avatar.*');
		})
		cb(null, fileName);
	}
});


router.post('/', auth.ensureAuthenticated, multer({
		storage: storage
}).single('file'), function(req, res, next) {
  console.log(req.body);
  console.log(req.file);
  res.send('success');
});

router.post('/avatar', auth.ensureAuthenticated, multer({
	storage: avatarStorage
}).single('file'), function(req, res, next){
	// update avatar for user
	
	var query = [
		'MATCH (u:user) WHERE ID(u)=' + req.user.id,
		'WITH u',
		'SET u.avatar={avatarParam}',
		'RETURN u'
	].join('\n');

	var params = {
		avatarParam: req.user.nusOpenId + '_avatar' + req.file.originalname.slice(req.file.originalname.lastIndexOf('.'))
	};
	
	db.query(query, params, function(error ,result){
		if (error)
			console.log(error);
		else
			res.send(result);
	})

});

module.exports = router;
