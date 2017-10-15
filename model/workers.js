import {get} from '../db';
import {ObjectID} from 'mongodb';


export let workers = {

	getAll : function(cb) {
		get().collection('workers').find().toArray(function(err, docs) {
			cb(err, docs);	
		})},

	findById : function(id, cb) {
		get().collection('workers').findOne({_id: ObjectID(id)}, function(err, doc) {
			cb(err, doc);
		})},

	create : function(worker, cb) {
		get().collection('workers').save(worker, function(err, result) {
			cb(err, result);
		})},

	update : function(id, newWorker, cb) {
		get().collection('workers').updateOne({_id : ObjectID(id)},newWorker,
		function(err, result) {
			cb(err, result);
		})},

	delete : function(id, cb) {
		get().collection('workers').deleteOne(
		{
			_id : ObjectID(id)
		},
		function(err, result) {
			cb(err, result);
		})}
}