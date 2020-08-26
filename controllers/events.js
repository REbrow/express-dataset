var db = require('../database/db');

var getAllEvents = (req, res, next) => {
	(async function(){
		records = await getResults();
		res.status(200).send(records);
	})()
};

var getResults = () => {
	var data = [];
	return new Promise((resolve,reject)=>{ db.all(`SELECT e.id, e.type, e.created_at, e.actorid, a.login, a.avatar_url,
		e.repoid, r.name, r.url
		FROM events e 
		LEFT JOIN actors a on a.id = e.actorid
		LEFT JOIN repos r on r.id = e.repoid
		ORDER BY e.id desc;`, [], (err, rows)=>{
		if(err){
			throw err;
		}
		rows.forEach((row) =>{
			data.push( {id: row.id, type: row.type, created_at: row.created_at,
				actor: {id: row.actorid, login: row.login, avatar_url: row.avatar_url},
				repo: {id: row.repoid, name: row.name, url: row.url}	
			});
		})
		resolve(data);
		})
	});
}

var addEvent = (req, res, next) => {
	let body = req.body;
	let actor = body.actor;
	let repo = body.repo;

	db.get(`SELECT * FROM events WHERE id = ?`, [body.id], (err, row)=>{
		if(err) {
			res.status(400).send(err.message);
		}
		if(row === null || row === undefined) {
			db.run(`INSERT INTO actors (id, login, avatar_url) VALUES (?, ?, ?) `, 
				[actor.id, actor.login, actor.avatar_url], (err)=>{
				if(err){
					return console.log(err.message);
				}
			})
			db.run(`INSERT INTO repos (id, name, url) VALUES (?, ?, ?) `,
				[repo.id, repo.name, repo.url], (err)=>{
				if(err){
					return console.log(err.message);
				}
			})
			db.run(`INSERT INTO events (id, type, actorid, repoid, created_at) VALUES (?, ?, ?, ?, ?) `,
				[body.id, body.type, actor.id, repo.id, body.created_at], (err)=>{
				if(err){
					return console.log(err.message);
				}
			})
			res.status(201).send();
		}	
		else
		{
			res.status(400).send();
			
		}
	})
};

var getByActor = (req, res) => {
	let actorid  = req.params.id;

	db.get(`SELECT * FROM actors WHERE id = ?`, [actorid], (err, row)=>{
		if(err) {
			res.status(400).send(err.message);
		}
		if(row === null || row === undefined) {
			res.status(404).send();
		}	
		else{
			db.all(`SELECT * FROM events where actorid = ? ;`, [actorid], (err, row)=>{
				if(err){
					throw err;
				}
				console.log(row);
				res.status(200).send(row);
			})
		}

	})
};


var eraseEvents = (req, res, next) => {

	db.all(`DELETE FROM events;`, [], (err)=>{
		if(err){
			throw err;
		}
		return res.status(200).send();

	})
};

module.exports = {
	getAllEvents: getAllEvents,
	addEvent: addEvent,
	getByActor: getByActor,
	eraseEvents: eraseEvents
};

















