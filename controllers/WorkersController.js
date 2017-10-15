import {workers} from '../model/workers';

export let workersController = {
	getAll : function(req, res) {
	workers.getAll(function(err, docs) {
		if(err){
			console.log(err);
			return res.sendStatus(500);
		}
		res.send(docs);
	})},


	findById : function(req, res) {
	workers.findById(req.params.id, function(err, docs) {
		if(err){
			console.log(err);
			return res.sendStatus(500);
		}
		res.send(docs);
	})},


	create : function(req, res) {
		console.log(req.body);
		let worker = req.body;
		workers.create(worker, function(err, result) {
			if(err){
				console.log(err);
				return res.sendStatus(500);
			}
			res.send(result);
		})},

	update : function(req, res) {
		let newWorker = {
			"id" : req.params.id,
			"login" : req.body.login,
			"from_date" : req.body.from_date,
			"to_date" : req.body.to_date,
			"month": req.body.month
		}
		workers.update(req.params.id, newWorker, function(err, result) {
			if(err){
				console.log(err);
				return res.sendStatus(500);
			}
			res.send(result);
		})},

	delete : function(req, res) {
		workers.delete(req.params.id, function(err, result) {
			if(err){
				console.log(err);
				return res.sendStatus(500);
			}
			console.log(result)
			res.send(result);	
		})}
}