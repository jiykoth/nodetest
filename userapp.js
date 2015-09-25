var pg = require('pg');
var conString = "postgres://nathan:drowssa7@nodetest.crldwbqkcoid.us-east-1.rds.amazonaws.com:5432/node";
var db = new pg.Client(conString);
db.connect();

UserApp = function() {
	/* initialization */
};

UserApp.prototype.getUsers = function(callback) {
	var sql = "select * from users order by id";
	db.query(sql, function(error, result) {
		if (error) return res.send(500);
		if (result.rows.length == 0) return null;
		callback(null, JSON.stringify(result.rows));
	});
};

UserApp.prototype.addUser = function(user, callback) {
	var sql = "insert into users (email, firstname, lastname) values ($1, $2, $3)";
	console.log(user.email);
	db.query(sql, [user.email, user.fname, user.lname], function(error, result) {
		if (error) return res.send(500);
		callback(null, 'success');
	});
};

UserApp.prototype.updateUser = function(user, callback) {
	var sql = "update users set email = $1, firstname = $2, lastname = $3 where id = $4";
	db.query(sql, [user.email, user.fname, user.lname, user.id], function(error, result) {
		if (error) return res.send(500);
		callback(null, 'success');
	});
};

UserApp.prototype.deleteUser = function(user, callback) {
	var sql = "delete from users where id = $1";
	db.query(sql, [user.id], function(error, result) {
		if (error) return res.send(500);
		callback(null, 'success');
	});
};

exports.UserApp = UserApp;