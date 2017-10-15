import {MongoClient} from 'mongodb';

let	state = {
		db : null
	};

let	connect = function(url, done) {
		if(state.db){
			return done()
		}

		MongoClient.connect(url, function(err, db) {
			if(err){
				return done(err)
			}
			state.db = db;
			done();
		})
	};

let	get = function() {
		return state.db
	}	

export {connect, get};