const express = require('express');
const router = express.Router();
const authService = require('./auth.service');
const authorize = require('../_helpers/authorize')

// Routes
router.get('/', signinPage);
router.post('/register', register);     // Create user
router.post('/verify', verify);     // Verify user
router.post('/sign_in', sign_in);       // Sign in user
router.post('/forgot_password', forgot_password);       //Send forgot password email
router.post('/reset_password', reset_password);       // Reset password

router.get('/listUsers', authorize('admin'), getAll); // admin only
router.get('/getuser', authorize(), getUser); 

module.exports = router;                

function signinPage(req, res) {
	res.render('signin');
}


function verify(req, res) {
    authService.verify(req.body)
		.then(msg => res.json({message:msg}) )
		.catch(err => res.status(400).json({message:err.message}) )
}


function register(req, res) {
	authService.register(req.body)
	.then(msg => res.json({message:msg}) )
	.catch(err => res.status(400).json({message:err.message}) )
}


function sign_in(req, res) {
    authService.sign_in(req.body)
		.then(msg => res.json({message:msg}) )
		.catch(err => res.status(400).json({message:err.message}));
}


function forgot_password(req, res) {
	authService.forgot_password(req.body)
	.then(msg => res.json({message:msg}) )
	.catch(err => res.status(400).json({message:err.message} ))
}


function reset_password(req, res) {
	authService.reset_password(req.body)
	.then(msg => res.json({message:msg}) )
	.catch(err => res.status(400).json({message:err.message} ))
}


function getAll(req, res, next) {
	authService.getAll()
			.then(users => res.json(users))
			.catch(err => next(err));
}


function getUser(req, res, next) {
	authService.getUser(req.user.sub)
		.then(user => res.json(user))
		.catch(err => next(err));
}