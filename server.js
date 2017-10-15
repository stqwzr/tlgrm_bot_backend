import express  from 'express';
import bodyParser from 'body-parser';
import {MongoClient, ObjectID} from 'mongodb';
import {connect, get} from './db';
import {router} from './router/api';
import {mongoUrl as MONGOURL} from './config/config.json';
import TelegramBot from 'node-telegram-bot-api';
import {token as TOKEN, PORT, ngrokURL} from './config/config.json';
import {parseTime, totalRecycle, dateStringFormat} from './services/mainServices';

export const bot = new TelegramBot(TOKEN, {polling : true});

let app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(router);

//если бота вызывать в группе отправляет сообщение в личку чтобы не засорять )
bot.onText(/\/start/, msg=>{
	const {from: {id, first_name, last_name, username}} = msg;
	get().collection("workers").findOne({id : id,  endTime : {"$exists": false}}, function(err, worker) {
		if(err){
			bot.sendMessage(id , "Упс ошибка в сервере");
		} else if(!worker || worker.isStart === false){
			let startTime = new Date();
			let worker = {
				"id" : id,
				"first_name" : first_name,
				"last_name" : last_name,
				"username" : username,
				"startTime" : dateStringFormat(startTime),
				"isStart" : true,
				"month" : startTime.getMonth()+1,
				"day" : startTime.getDate()
			}
			get().collection('workers').save(worker);
			bot.sendMessage(id,'Время началы переработки ' + dateStringFormat(startTime));
		} else if (worker.isStart === true){
			bot.sendMessage(id,'Сначала закройте предыдущую переработку');
		}
	})
})

bot.onText(/[\/end][\/end@\w]+ (.+)/, (msg, [source, match])=>{
	console.log(msg, match);
	const {from: {id, first_name, last_name, username}} = msg;
	get().collection("workers").findOne({id : id, endTime : {"$exists": false}}, function(err, worker) {
		if (err) {
			bot.sendMessage(id , "Упс ошибка в сервере");
		} if(!worker || worker.isStart === false){
			bot.sendMessage(id,'Сначала начните переработку');
		} else if(worker.isStart === true){
			let mongoId = worker._id;
			let endTime = new Date();
			get().collection('workers').update({_id : mongoId}, {$set: {isStart : false, endTime : dateStringFormat(endTime), description : match}});
			bot.sendMessage(id,'Время окончания переработки ' + dateStringFormat(endTime));
		}		
	})
})

bot.onText(/[\/custom][\/custom@\w]+ ([0-3][0-9]-[0-1][0-2]-[\d][\d][\d][\d]) ([0-2]\d:[0-5]\d) ([0-2]\d:[0-5]\d) ([а-яА-я -.]+)$/, (msg, [source, date, start, end, description])=>{
	const {from: {id, first_name, last_name, username}} = msg;
	let worker = {
		"id" : id,
		"first_name" : first_name,
		"last_name" : last_name,
		"username" : username,
		"startTime" : start,
		"isStart" : false,
		"month" : Number(date.split('-')[1]),
		"day" : date.split('-')[0],
		"endTime" : end,
		"description" : description
	}
	get().collection('workers').save(worker, function(err, doc) {
		if(err){
			bot.sendMessage(id,'Ошибка в базе данных');
		} 
		bot.sendMessage(id,'Данные получены');
	});
})

bot.onText(/\/current/, (msg)=>{
	const {from: {id, first_name, last_name, username}} = msg;
	bot.sendMessage(id, "Обрабатываю возможно займет время...");
	let currentMonth = new Date().getMonth()+1
	get().collection('workers').find({id : id, month : currentMonth}).toArray(function(err, docs) {
			docs.forEach(doc =>{
				bot.sendMessage(id, doc.day + " день текущего месяца с "+ doc.startTime + " по " + doc.endTime);
			})
		})
})

bot.onText(/\/prev/, (msg)=>{
	const {from: {id, first_name, last_name, username}, text} = msg;
	bot.sendMessage(id, "Обрабатываю возможно займет время...");
	let prevMonth = new Date().getMonth()
	get().collection('workers').find({id : id, month : prevMonth}).toArray(function(err, docs) {
			docs.forEach(doc =>{
				if(typeof(doc.startTime) !== "string"){
					doc.day = doc.startTime.getDay()
					doc.startTime = dateStringFormat(doc.startTime);
					doc.endTime = dateStringFormat(doc.endTime);
				} else {
					doc.day = doc.day.split('-')[0];
				};
				bot.sendMessage(id, doc.day + " день текущего месяца с "+ doc.startTime + " по " + doc.endTime);
			})
		})
})

connect(MONGOURL, function(err) {
	if(err){
		return console.log(err);
	}
	app.listen(PORT, function() {
		console.log('server started '+PORT)
	})
});