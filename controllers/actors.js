var db = require('../database/db');

var getAllActors = (req, res) => {
	db.all(`SELECT actorid as id, a.login, a.avatar_url 
					 	FROM events e
						LEFT JOIN actors a on a.id = e.actorid
						group by 
						e.actorid
						order by count(e.actorid) desc, e.created_at desc, a.login
					  ;`, [], (err, row)=>{
						if(err){
							throw err;
						}
						res.status(200).send(row);
						
					  });
};

var updateActor = (req, res) => {
	let actor  = req.body;

	db.get(`SELECT * FROM actors WHERE id = ? and login = ?`, [actor.id, actor.login], (err, row)=>{
		if(err) {
			res.status(400).send(err.message);
		}
		if(row === null || row === undefined) {
			res.status(404).send();
		}	
		else{
			if(row.login !== actor.login) {
				res.status(400).send();
			}
			else {
				db.all(`UPDATE actors SET avatar_url = ? WHERE id = ?;`, [actor.avatar_url, actor.id], (err)=>{
					if(err){
						throw err;
					}
					res.status(200).send();
				})
			}
		}

	})
};

var getStreak = () => {
	
};


module.exports = {
	updateActor: updateActor,
	getAllActors: getAllActors,
	getStreak: getStreak
};

















