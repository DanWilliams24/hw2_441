
var express = require('express');
const bodyParser = require('body-parser');
var mysql = require('mysql2');

var app = express();
 
// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
///
///	Create connection to MySQL database server.
/// 
function getMySQLConnection() {
	return mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : 'password',
	  database : 'gamedata'
	});
}

///
/// Use pug as templating engine. Pug is renamed jade.
///
app.set('view engine', 'pug');

///
/// HTTP Method	: POST
/// Endpoint 	: /person
/// 
/// To ADD A PERSON TO THE DATABASE
///

var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.post('/person', urlencodedParser, (req, res) => {
	console.log(req.body)
	
	var connection = getMySQLConnection();
	connection.connect(function(err){
		if(err) throw err;
		console.log("Connected to DB to add record")

		console.log(res.body)
		// Do the query to get data.
		connection.query('SELECT * FROM gamescores WHERE id = ' + req.body.id, function(err, rows, fields) {

			if (err) {
				console.log(err)
				res.status(500).json({"status_code": 500,"status_message": "internal server error"});
			} else {
				// Check if the result is found or not
				if(rows.length==0) {
					console.log(req.body)
					connection.query('INSERT INTO gamescores (id, name, points) VALUES (?,?,?)', [req.body.id, req.body.name, req.body.points],(error, 
						results) => {
						if (error) return res.json({ error: error });
						console.log("Added Data to database!")
							//res.redirect("/person")
						});
				}
			}
		});
	});
	
	
});

var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.post('/person', urlencodedParser, (req, res) => {
	console.log(req.body)
	
	var connection = getMySQLConnection();
	connection.connect(function(err){
		if(err) throw err;
		console.log("Connected to DB to add record")

		console.log(res.body)
		// Do the query to get data.
		connection.query('SELECT * FROM gamescores WHERE id = ' + req.body.id, function(err, rows, fields) {

			if (err) {
				console.log(err)
				res.status(500).json({"status_code": 500,"status_message": "internal server error"});
			} else {
				// Check if the result is found or not
				if(rows.length==0) {
					console.log(req.body)
					connection.query('INSERT INTO gamescores (id, name, points) VALUES (?,?,?)', [req.body.id, req.body.name, req.body.points],(error, 
						results) => {
						if (error) return res.json({ error: error });
						console.log("Added Data to database!")
							//res.redirect("/person")
						});
				}
			}
		});
	});
	
	
});


///
/// HTTP Method	: GET
/// Endpoint 	: /person
/// 
/// To SHOW ALL PEOPLE IN THE DATABASE
///

app.get('/person', function(req, res) {
	var personList = [];

	// Connect to MySQL database.
	var connection = getMySQLConnection();
	connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
      });

	// Do the query to get data.
	connection.query('SELECT * FROM gamescores', function(err, rows, fields) {
	  	if (err) {
	  		res.status(500).json({"status_code": 500,"status_message": "internal server error"});
	  	} else {
	  		// Loop check on each row
	  		for (var i = 0; i < rows.length; i++) {

	  			// Create an object to save current row's data
		  		var person = {
		  			'id':rows[i].id,
		  			'name':rows[i].name,
		  			'points':rows[i].points
		  		}
		  		// Add object into array
		  		personList.push(person);
	  	}

	  	// Render index.pug page using array 
	  	res.render('index', {"personList": personList});
	  	}
	});

	// Close the MySQL connection
	connection.end();
	
});

///
/// HTTP Method	: GET
/// Endpoint	: /person/:id
/// 
/// Search to get specific data of person based on their identifier.
///
app.get('/person/:id', function(req, res) {
	// Connect to MySQL database.
	var connection = getMySQLConnection();
	connection.connect();

	// Do the query to get data.
	connection.query('SELECT * FROM gamescores WHERE id = ' + req.params.id, function(err, rows, fields) {
		var person;

	  	if (err) {
	  		res.status(500).json({"status_code": 500,"status_message": "internal server error"});
	  	} else {
	  		// Check if the result is found or not
	  		if(rows.length==1) {
	  			// Create the object to save the data.
	  			var person = {
		  			'id':rows[0].id,
		  			'name':rows[0].name,
		  			'points':rows[0].points,
		  		}
		  		// render the details.plug page.
		  		res.render('details', {"person": person});
	  		} else {
	  			// render not found page
	  			res.status(404).json({"status_code":404, "status_message": "Not found"});
	  		}
	  	}
	});

	connection.end();
});


app.listen(3000, function () {
    console.log('listening on port', 3000);
});