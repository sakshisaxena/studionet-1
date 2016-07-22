var express = require('express');
var router = express.Router();
var multer = require('multer');
var mkdirp = require('mkdirp');
var glob = require('glob');
var path = require('path');
var fs = require('fs');
var db = require('seraph')({
	user: process.env.DB_USER,
	pass: process.env.DB_PASS
});
var auth = require('./auth');

var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		var dest = './uploads/' + req.body.username;

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
		var dest = './uploads/' + req.user.nusOpenId;

		var toDelete = glob.sync('./uploads/'+ req.user.nusOpenId+ '/' + req.user.nusOpenId + '_avatar.*');
		toDelete.forEach(function(item, index, array){
			fs.unlink(item, function(err){
				if (err) throw err;
			})
		});

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
		cb(null, req.user.nusOpenId+'_avatar'+file.originalname.slice(file.originalname.lastIndexOf('.')));
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
		avatarParam: '/uploads/avatar/' + req.user.nusOpenId
	};
	
	db.query(query, params, function(error ,result){
		if (error)
			console.log(error);
		else
			res.send(result);
	})

});


router.get('/avatar/:nusOpenId', auth.ensureAuthenticated, function(req, res){
	var avatar = glob.sync('./uploads/' + req.params.nusOpenId + '/' + req.params.nusOpenId + '_avatar.*');
	res.sendFile(path.resolve(__dirname + '/../') +'/' + avatar[0]);

	//res.sendFile('./uploads/'+ req.params.nusOpenId + '/' + req.params.nusOpenId + '_avatar')
});

module.exports = router;
